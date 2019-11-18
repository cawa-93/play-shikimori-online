import axios from 'axios';
import axiosRetry from 'axios-retry';

export const anime365 = axios.create({
    baseURL: 'https://smotret-anime.online/api',
    // headers: {'User-Agent': 'play-shiki-app'},
});

axiosRetry(anime365, {
    retries: 5,
    retryDelay: (c: number) => c * 1000,
});
