import {RequestProvider} from '@/helpers/API/RequestProvider';

export class MyAnimeListProvider extends RequestProvider {
    public static baseURL = 'https://api.jikan.moe/v3';
}
