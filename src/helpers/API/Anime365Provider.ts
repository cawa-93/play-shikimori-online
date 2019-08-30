import {RequestProvider} from '@/helpers/API/RequestProvider';

export class Anime365Provider extends RequestProvider {
    public static baseURL = 'https://smotret-anime-365.ru/api';
    public static cachePrefix = 'anime-365-cache-v';
    public static cacheVersion = 1;
}

Anime365Provider.clearLegacyCaches();
