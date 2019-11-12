import axios from 'axios';
import axiosRetry from 'axios-retry';

export const shikimori = axios.create({
    baseURL: 'https://shikimori.one/api',
    // headers: {'User-Agent': 'play-shiki-app'},
});

axiosRetry(shikimori, {
    retries: 5,
    retryDelay: (c: number) => c * 1000,
});

