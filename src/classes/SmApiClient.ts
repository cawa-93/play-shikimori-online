import type {AxiosInstance, AxiosRequestConfig} from 'axios';
import type {SmResponse} from '@/interfaces/smotret-anime-api';



export class SmApiClient<Q, R> {



  constructor(private readonly httpClient: AxiosInstance) {
  }



  public getSingle(id: number) {
    return this.makeRequest<R>({
      url: `/${id}`,
    });
  }



  public search<F extends keyof R>(query: Q, fields: F[] = []) {

    const params: Q & { fields?: string } = JSON.parse(JSON.stringify(query));

    if (fields && fields.length > 0) {
      params.fields = fields.join(',');
    }

    return this.makeRequest<Array<Pick<R, F>>>({
      url: '/',
      params,
    });
  }



  private makeRequest<T>(config: AxiosRequestConfig) {
    return this.httpClient(config)
      .then((r) => r.data as SmResponse<T>)
      .then((r) => {
        if ('error' in r) {
          throw new Error(`${r.error.code}: ${r.error.message}`);
        }

        return r.data;
      });
  }
}



// const instance = axios.create({
//   baseURL: 'https://smotret-anime.online/api',
// });


// export const anime = new SmApiClient<SmAnimeQuery, SmAnimeResponse>('/series', instance);
// export const episode = new SmApiClient<SMEpisodeQuery, SMEpisode>('/episodes', instance);
// export const translation = new SmApiClient<SMTranslationQuery, SMTranslation>('/translations', instance);


