import {RequestProvider} from '@/helpers/API/RequestProvider';
// @ts-ignore
import storage from 'kv-storage-polyfill';

declare interface CachedSeries {
    resp: anime365.api.SeriesCollection;
    maxAge: number;
}

const DAY = 1000 * 60 * 60 * 24;


export class Anime365Provider extends RequestProvider {
    public static baseURL = 'https://smotret-anime-365.ru/api';
    public static cachePrefix = 'anime-365-cache-v';
    public static cacheVersion = 1;
    public static cachedSeries: Map<string, CachedSeries> = new Map();

    public static cachedSeriesReady: Promise<void> = storage.get('cachedSeries')
        .then((storeData?: Map<string, CachedSeries>) => {
            if (storeData) {
                Anime365Provider.cachedSeries = storeData;
            }
        });


    public static async request<T>(
        url: string,
        options: RequestInit & { errorMessage: string },
    ): Promise<T> {
        const isSeriesRequest = /\/api\/series\//.test(url);
        if (isSeriesRequest) {
            await this.cachedSeriesReady;
        }

        if (isSeriesRequest && this.cachedSeries.has(url)) {
            const cache = this.cachedSeries.get(url);
            if (cache && cache.maxAge && cache.maxAge > Date.now()) {
                // @ts-ignore
                return cache.resp as T;
            }
        }

        try {
            const resp = await super.request<T>(url, options);

            /**
             * Если текущий запрос — это запрос к списку серий
             * Запустить процесс кэширования
             */
            if (isSeriesRequest) {
                // @ts-ignore
                const SeriesCollection = resp as anime365.api.SeriesCollection;

                /**
                 * Если список серий не пуст
                 */
                if (SeriesCollection
                    && SeriesCollection.data[0]
                    && SeriesCollection.data[0].episodes
                    && SeriesCollection.data[0].episodes.length > 0
                ) {
                    // По умолчанию не кэшируем ответ
                    let maxAge = 0;

                    // Определяем дату последней добавленной серии
                    const newestEpisodeDateTime = Math.max(
                        ...SeriesCollection.data[0].episodes.map((e) => new Date(e.firstUploadedDateTime).getTime()),
                    );

                    // Если последняя серия была добавлена более двух недель назад
                    // увеличить срок кэширования до 7 дней
                    // if (newestEpisodeDateTime && newestEpisodeDateTime < (Date.now() - DAY * 14)) {
                    //     maxAge = Date.now() + DAY * 7;
                    // }

                    // Если последняя серия была добавлена более 30 дней назад
                    // увеличить срок кэширования до 30 дней
                    if (newestEpisodeDateTime && newestEpisodeDateTime < (Date.now() - DAY * 30)) {
                        maxAge = Date.now() + DAY * 30;
                    }

                    this.cachedSeries.set(url, {resp: SeriesCollection, maxAge});
                    if (this.cachedSeries.size > 5) {
                        this.cachedSeries = new Map([...this.cachedSeries.entries()].splice(-5));
                    }
                    storage.set('cachedSeries', this.cachedSeries);
                }

            }

            return resp;
        } catch (e) {
            throw e;
        }
    }

}

Anime365Provider.clearLegacyCaches();
