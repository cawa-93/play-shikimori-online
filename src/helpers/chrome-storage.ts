import LocalStorageArea = chrome.storage.LocalStorageArea;
import SyncStorageArea = chrome.storage.SyncStorageArea;

class ChromeStorageArea {
    private namespace: SyncStorageArea | LocalStorageArea;

    /**
     * @param {'sync' | 'local'} namespace
     */
    constructor(namespace: 'sync' | 'local') {
        this.namespace = chrome.storage[namespace];
    }


    /**
     *
     * @param {string | Object | string[]} keys
     */
    public get<T>(keys: string | string[] | object | null): Promise<T> {
        return new Promise((resolve, reject) => {
            this.namespace.get(keys, (items) => {
                const err = chrome.runtime.lastError;
                if (err) {
                    reject(err);
                } else {
                    // @ts-ignore
                    resolve(items);
                }
            });
        });
    }


    /**
     *
     * @param {Object} items
     */
    public set(items: object) {
        return new Promise((resolve, reject) => {
            this.namespace.set(items, () => {
                const err = chrome.runtime.lastError;
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }


    /**
     *
     * @param {string | string[] | undefined} keys
     */
    public getBytesInUse(keys: string | string[] | null) {
        return new Promise((resolve, reject) => {
            this.namespace.getBytesInUse(keys, (items) => {
                const err = chrome.runtime.lastError;
                if (err) {
                    reject(err);
                } else {
                    resolve(items);
                }
            });
        });
    }


    /**
     *
     * @param {string | string[] | undefined} keys
     */
    public remove(keys: string | string[]) {
        return new Promise((resolve, reject) => {
            this.namespace.remove(keys, () => {
                const err = chrome.runtime.lastError;
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }


    public clear() {
        return new Promise((resolve, reject) => {
            this.namespace.clear(() => {
                const err = chrome.runtime.lastError;
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }


    /**
     * Выполняет unshift в массив данных в Chrome Storage.
     * Если новый массив превышает квоту — удаляет елементы массива, начиная от самых старых,
     * до тех пор пока результирующий массив данных не поместится в квоту
     *
     * @param {string} key Ключ переменной в хранилище
     * @param {{id: any, [key: string]: any}} value Данные для сохранения в массыв в хранилище
     * @returns {Promise<any[]>} Массив сохраненных данных
     */
    public async unshift(key: string, value: { id: any, [k: string]: any }) {
        let {[key]: array} = await this.get<{ [key: string]: any[] }>({[key]: []});
        array = (array || []).filter((item) => item && item.id !== value.id);
        array.unshift(value);

        while (array.length) {
            try {
                await this.set({[key]: array});
                break;
            } catch (error) {
                if (error.message.indexOf('QUOTA_BYTES') !== -1) {
                    array.pop();
                } else {
                    return Promise.reject(error);
                }
            }
        }

        return array;
    }
}


export const sync = new ChromeStorageArea('sync');
export const local = new ChromeStorageArea('local');
