import {RequestProvider} from '@/helpers/API/RequestProvider';

export class ShikimoriProvider extends RequestProvider {
    public static baseURL = 'https://shikimori.one';
    public static cachePrefix = 'shikimori-cache-v';
    public static cacheVersion = 1;


    protected static async checkResponse(
        resp: Response,
        bail: (e: Error) => void,
        errorMessage: string = 'Невозможно выполнить запрос к Шикимори',
    ) {
        const error = await super.checkResponse(resp, bail, errorMessage);

        if (
            error
            && error.response
            && error.response.body
            && Array.isArray(error.response.body)
            && error.response.body.every((i) => typeof i === 'string')
        ) {
            error.reason = `${error.reason}; ${error.response.body.join('; ')}`;
        }

        return error;
    }
}


ShikimoriProvider.clearLegacyCaches();
