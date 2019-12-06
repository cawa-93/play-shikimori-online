import axios, {AxiosInstance, AxiosPromise, AxiosRequestConfig} from 'axios';
import axiosRetry from 'axios-retry';
import {Anime365Response, Series as SeriesFull} from '@/types/anime365';

class Anime365Client {

  private readonly client: AxiosInstance;

  private queryToRequest = new Map<string, Map<number | 'requested', any>>();


  constructor(options: AxiosRequestConfig = {}) {

    /**
     * Инстанс axios
     */
    this.client = axios.create({
      baseURL: 'https://smotret-anime.online/api',
      ...options,
    });


    /**
     * Повторная попытка выполнить запрос
     */
    axiosRetry(this.client, {
      retries: 5,
      retryDelay: (c: number) => c * 1000,
    });


    /**
     * Форматирование параметра fields
     */
    this.client.interceptors.request.use((config) => {
      if (config && config.params && Array.isArray(config.params.fields)) {
        if (config.params.fields.length) {
          config.params.fields.push('id');
          config.params.fields = config.params.fields.join(',');
        } else {
          delete config.params.fields;
        }
      }

      return config;
    });


    /**
     * Обработка ошибки от сервера
     */
    this.client.interceptors.response.use((response) => {
      if (response.data && response.data.error) {
        throw response.data.error;
      }
      return response;
    });

  }


  /**
   * Возвращает Map сезонов по переданным параметрам поиска
   * @param searchParams Параметры фильтрации результатов
   * @param fields
   */
  public getSeriesCollection<T extends keyof SeriesFull>(
    searchParams: Partial<Record<keyof SeriesFull, any>> = {},
    fields: T[] = [],
  ) {

    type Series = Pick<SeriesFull, T | 'id'>;

    return this.request<Series[] | Series>({
      method: 'get',
      url: '/series',
      params: {
        ...searchParams,
        fields,
      },
    })
      .then(({data}) => {
        const map = new Map<Series['id'], Series>();
        if (Array.isArray(data.data)) {
          data.data.forEach((s) => map.set(s.id, s));
        } else {
          map.set(data.data.id, data.data);
        }

        return map;
      });
  }


  /**
   * Возвращает один сезон по переданному ID
   * @param myAnimeListId
   * @param fields
   */
  public getSeries<T extends (keyof SeriesFull | 'myAnimeListId')>(
    myAnimeListId: SeriesFull['myAnimeListId'],
    fields: T[] = [],
  ): Promise<Pick<SeriesFull, T | 'id' | 'myAnimeListId'> | undefined> {


    interface SavedRequest {
      promise: Promise<Pick<SeriesFull, T | 'id' | 'myAnimeListId'> | undefined>;
      resolve: (val: Pick<SeriesFull, T | 'id' | 'myAnimeListId'> | undefined) => void;
    }

    type Queue = Map<number | 'requested', SavedRequest>;

    const queueId = JSON.stringify({fields});
    const queue: Queue = this.queryToRequest.has(queueId) ? this.queryToRequest.get(queueId)! : new Map();


    if (queue.has(myAnimeListId)) {
      return queue.get(myAnimeListId)!.promise;
    }

    const request = {} as SavedRequest;

    request.promise = new Promise((resolve) => request.resolve = resolve);
    queue.set(myAnimeListId, request);
    this.queryToRequest.set(queueId, queue);

    setTimeout(() => {
      if (queue.has('requested')) {
        return;
      }

      const ids = [...queue.keys()];

      if (Array.isArray(fields) && fields.length) {
        fields.push('myAnimeListId' as T);
      }

      this.getSeriesCollection<T | 'myAnimeListId'>({myAnimeListId: ids}, fields)
        .then((series) => {

          series.forEach((s) => {
            const malId = s.myAnimeListId;
            if (!malId) {
              return;
            }

            if (queue.has(malId)) {
              queue.get(malId)!.resolve(s);
            }
          });

          queue.forEach((r) => {
            if (!r.resolve) {
              return;
            }

            r.resolve(undefined);
          });

          this.queryToRequest.delete(queueId);
        });

      queue.set('requested', {} as SavedRequest);
      this.queryToRequest.set(queueId, queue);


    }, 0);

    return request.promise;
  }


  /**
   * Выполняет обращение к серверу
   * @param options
   */
  private request<R>(options: AxiosRequestConfig = {}): AxiosPromise<Anime365Response<R>> {
    return this.client(options);
  }
}


export const anime365Client = new Anime365Client();

// TODO: DELETE AFTER DEBUG
if (process.env.NODE_ENV !== 'production') {
// @ts-ignore
  window.anime365Client = anime365Client;
}
