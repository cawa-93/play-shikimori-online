import {SmApiClient} from '@/classes/SmApiClient';
import axios from 'axios';



export abstract class SmAbstractFactory<Q, R> {
  protected apiClient: SmApiClient<Q, R>;



  protected constructor(endpoint: string) {
    const axiosInstance = axios.create({
      baseURL: 'https://smotret-anime.online/api' + endpoint,
    });

    // axiosRetry( axiosInstance )

    this.apiClient = new SmApiClient<Q, R>(axiosInstance);
  }
}
