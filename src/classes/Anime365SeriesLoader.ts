import {Series} from '@/interfaces/Series';
import {SeriesChainBase} from '@/classes/SeriesChainBase';
import * as anime356API from '@/interfaces/anime356API';
import {SuccessResponse} from '@/interfaces/anime356API';
import {Anime365Series} from '@/classes/Anime365Series';



export class Anime365SeriesLoader extends SeriesChainBase {
  private static isSuccessResponse<T>(response: anime356API.Response<T>): response is SuccessResponse<T> {
    return (response as anime356API.ErrorResponse).error === undefined;
  }



  public getSeries(id: number): Promise<Series | undefined> {
    return fetch(`https://smotret-anime.online/api/series/${id}`)
      .then<anime356API.Response<anime356API.Series>>((response) => {
        if (response.ok) {
          return response.json();
        }

        return Promise.reject(response);
      })

      .then((response) => {
        if (Anime365SeriesLoader.isSuccessResponse(response)) {
          return new Anime365Series(response.data);
        }

        return Promise.reject(response);
      })

      .catch((error) => {
        console.error(error);
        return super.getSeries(id);
      });
  }
}
