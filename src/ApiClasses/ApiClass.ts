import axios, {AxiosInstance, AxiosPromise, AxiosRequestConfig} from 'axios';
import axiosRetry from 'axios-retry';
//
export type requestConfig = AxiosRequestConfig & { args?: { [p: string]: any } }
//
// declare interface Endpoint {
//   method: AxiosRequestConfig['method'];
//   url: string;
//   fields?: string[]
// }
//
export class ApiClass {

  protected readonly client: AxiosInstance;
  protected queryToRequest = new Map<string, AxiosPromise>();



  constructor(options: AxiosRequestConfig = {}) {
    /**
     * Инстанс axios
     */
    this.client = axios.create({
      ...options,
    });



    /**
     * Повторная попытка выполнить запрос
     */
    axiosRetry(this.client, {
      retries: 5,
      retryDelay: (c: number) => c * 1000,
    });
  }




  /**
   * Выполняет обращение к серверу
   * @param options
   */
  public request<R = any>(options: AxiosRequestConfig = {}): AxiosPromise<R> {
    const key = JSON.stringify(options);
    let saved = this.queryToRequest.get(key);

    if (!saved) {
      saved = this.client(options).finally(() => {
        this.queryToRequest.delete(key);
      });
      this.queryToRequest.set(key, saved);
    }

    return saved;
  }
}



//
//
//
//
//
// export function buildProxy<T extends ApiClass, K extends keyof T>(c: T , ENDPOINTS: any) {
//   return new Proxy(
//     c,
//     {
//       get: (target, name: K) => {
//         if (ENDPOINTS[name] === undefined) {
//           return target[name];
//         }
//
//
//         return ({params = {}, data = {}, args = {}}: requestConfig = {}) => {
//           return target.client({
//             method: ENDPOINTS[name].method,
//             url: ENDPOINTS[name].url,
//             data,
//             params: {
//               ...params,
//               fields: (ENDPOINTS[name].fields || []).join(','),
//             },
//           });
//         };
//       },
//     },
//   )
// }
