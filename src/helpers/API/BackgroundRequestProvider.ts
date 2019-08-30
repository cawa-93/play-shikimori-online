import {RequestProvider} from '@/helpers/API/RequestProvider';
import {APIError} from '@/helpers/errors/APIError.class';
import {AppError} from '@/helpers/errors/AppError.class';
import {NetworkError} from '@/helpers/errors/NetworkError.class';
import {PermissionError} from '@/helpers/errors/PermissionError.class';

export class BackgroundRequestProvider extends RequestProvider {
    public static request<T>(
        url: string,
        options: RequestInit & { errorMessage: string },
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    contentScriptQuery: 'fetchUrl',
                    url,
                    options,
                },
                ({response, error}) => {
                    if (error) {
                        if (error.reason) {
                            // Причина ошибки уже записана в поле message.
                            // Её нужно удалить так как далее она будет добавлена заномо
                            error.message = error.message.replace(`: ${error.reason}`, '');
                        }
                        switch (error.name) {
                            case 'AppError':
                                return reject(new AppError(error));
                            case 'APIError':
                                return reject(new APIError(error));
                            case 'NetworkError':
                                return reject(new NetworkError(error));
                            case 'PermissionError':
                                return reject(new PermissionError(error));
                            default:
                                // @ts-ignore
                                return reject(new window[error.name](error));
                        }
                    } else {
                        resolve(response);
                    }
                },
            );
        });
    }
}
