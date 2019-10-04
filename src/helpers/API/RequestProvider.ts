import {APIError} from '@/helpers/errors/APIError.class';
import {PermissionError} from '@/helpers/errors/PermissionError.class';
// @ts-ignore
import {origins, permissions} from '@/manifest.js';
import retry from 'async-retry';

export class RequestProvider {
    public static baseURL = '';


    public static async fetch<T>(
        url: string,
        options: RequestInit & { errorMessage: string },
    ): Promise<T> {
        url = this.baseURL + url;
        let granted = await this.isPermissionsGranted(url);
        if (!granted) {
            try {
                granted = await this.requestPermissions({permissions, origins});
            } catch (e) {
                console.warn('Невозможно запросить у пользователя разрешение', {error: e});
            }
        }

        if (!granted) {
            throw new PermissionError({
                message: options.errorMessage,
            }, new URL(url).host);
        }

        return this.request<T>(url, options);
    }

    public static async request<T>(
        url: string,
        options: RequestInit & { errorMessage: string },
    ): Promise<T> {

        if (options.credentials === undefined) {
            options.credentials = 'omit';
        }

        options.headers = Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, options.headers || {});


        return retry(async (bail: (e: Error) => void) => {
            return fetch(url, options)
                .then(async (resp) => {
                    const error = await this.checkResponse(resp, bail, options.errorMessage);
                    if (error) {
                        error.request = {url, options};

                        const apiError = new APIError(error);

                        if (resp.status !== 429 && resp.status >= 400 && resp.status < 500) {
                            return bail(apiError);
                        } else {
                            throw apiError;
                        }
                    } else {
                        return await resp.json();
                    }
                });
        }, {
            retries: 3,
        });
    }

    public static isPermissionsGranted(url: string) {
        return new Promise((resolve) => {
            if (!chrome || !chrome.permissions || !chrome.permissions.contains) {
                return resolve(true);
            }
            const info = new URL(url);
            chrome.permissions.contains(
                {
                    origins: [`${info.protocol}//${info.hostname}/*`],
                },
                resolve,
            );
        });
    }

    // tslint:disable-next-line:no-shadowed-variable
    public static requestPermissions(permissions: chrome.permissions.Permissions) {
        return new Promise((resolve, reject) => {
            chrome.permissions.request(permissions, (granted) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                }
                resolve(granted);
            });
        });
    }

    protected static async checkResponse(
        resp: Response,
        bail: (e: Error) => void,
        errorMessage: string = 'Невозможно выполнить запрос',
    ): Promise<AppErrorSchema | null> {
        if (resp.ok) {
            return null;
        }

        let body = null;

        try {
            body = await resp.json();
        } catch (e) {
            try {
                body = await resp.text();
            } catch {
            }
        }

        let reason = `Сервер ответил с ошибкой ${resp.status}`;

        if (body && body.message) {
            reason = `${reason}; ${body.message}`;
        }

        return {
            name: 'APIError',
            message: errorMessage,
            reason,
            response: {
                status: resp.status,
                body,
            },
        };
    }
}
