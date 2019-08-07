class ChromeStorageArea {
	/**
	 * @param {'sync' | 'local'} namespace
	 */
	constructor(namespace) {
		this.namespace = chrome.storage[namespace]
	}


	/**
	 *
	 * @param {string | Object | string[]} keys
	 */
	get(keys) {
		let promise = new Promise((resolve, reject) => {
			this.namespace.get(keys, (items) => {
				let err = chrome.runtime.lastError
				if (err) {
					reject(err)
				} else {
					resolve(items)
				}
			})
		})
		return promise
	}


	/**
	 *
	 * @param {Object} items
	 */
	set(items) {
		let promise = new Promise((resolve, reject) => {
			this.namespace.set(items, () => {
				let err = chrome.runtime.lastError
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
		return promise
	}


	/**
	 *
	 * @param {string | string[] | undefined} keys
	 */
	getBytesInUse(keys) {
		let promise = new Promise((resolve, reject) => {
			this.namespace.getBytesInUse(keys, (items) => {
				let err = chrome.runtime.lastError
				if (err) {
					reject(err)
				} else {
					resolve(items)
				}
			})
		})
		return promise
	}


	/**
	 *
	 * @param {string | string[] | undefined} keys
	 */
	remove(keys) {
		let promise = new Promise((resolve, reject) => {
			this.namespace.remove(keys, () => {
				let err = chrome.runtime.lastError
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
		return promise
	}


	clear() {
		let promise = new Promise((resolve, reject) => {
			this.namespace.clear(() => {
				let err = chrome.runtime.lastError
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
		return promise
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
	async unshift(key, value) {
		let {[key]: array} = await this.get({[key]: []})
		array = (
			array || []
		).filter(item => item && item.id !== value.id)
		array.unshift(value)

		while (array.length) {
			try {
				await this.set({[key]: array})
				break
			} catch (error) {
				if (error.message.indexOf('QUOTA_BYTES') !== -1) {
					array.pop()
				} else {
					return Promise.reject(error)
				}
			}
		}

		return array
	}
}



export const sync = new ChromeStorageArea('sync')
export const local = new ChromeStorageArea('local')
