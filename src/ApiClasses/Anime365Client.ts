import {AxiosRequestConfig} from 'axios';
import {
  Anime365Response,
  Episode as EpisodeFull,
  Series as SeriesFull,
  Translation as TranslationFull
} from '@/types/anime365';
import {ApiClass} from '@/ApiClasses/ApiClass';



class Anime365Client extends ApiClass {


  constructor(options: AxiosRequestConfig = {}) {
    options.baseURL = 'https://smotret-anime.online/api';

    super(options);


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

    return this.request<Anime365Response<Series[] | Series>>({
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
   * @param id
   * @param params
   */
  public getSeriesSingle(
    id: SeriesFull['id'],
    params: AxiosRequestConfig['params'] = {},
  ): Promise<SeriesFull> {
    return this.request<Anime365Response<SeriesFull>>({
      method: 'get',
      url: `/series/${id}`,
      params,
    })
      .then(({data}) => data.data);
  }



  public getEpisodesCollection<T extends keyof EpisodeFull>(
    searchParams: Partial<Record<keyof EpisodeFull, any>> = {},
    fields: T[] = [],
  ) {

    type Episode = Pick<EpisodeFull, T | 'id'>;

    return this.request<Anime365Response<Episode[] | Episode>>({
      method: 'get',
      url: '/episodes',
      params: {
        ...searchParams,
        fields,
      },
    })
      .then(({data}) => {
        if (!Array.isArray(data.data)) {
          data.data = [data.data];
        }

        return data.data;
      });
  }



  public getTranslationsCollection<T extends keyof TranslationFull>(
    searchParams: Partial<Record<keyof TranslationFull, any>> = {},
    fields: T[] = [],
  ) {

    type Translation = Pick<TranslationFull, T | 'id'>;

    return this.request<Anime365Response<Translation[] | Translation>>({
      method: 'get',
      url: '/translations',
      params: {
        ...searchParams,
        fields,
      },
    })
      .then(({data}) => {
        if (!Array.isArray(data.data)) {
          data.data = [data.data];
        }

        return data.data;
      });
  }

}




export const anime365Client = new Anime365Client();

// TODO: DELETE AFTER DEBUG
if (process.env.NODE_ENV !== 'production') {
// @ts-ignore
  window.anime365Client = anime365Client;
}
