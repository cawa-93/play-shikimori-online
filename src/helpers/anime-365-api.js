function anime365API(path, options = {}) {

	return new Promise((resolve, reject) => {
		const url = 'https://smotret-anime-365.ru/api' + path
		let headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}

		options.headers = headers
		options.credentials = 'include'

		chrome.runtime.sendMessage({
				contentScriptQuery: 'fetchUrl',
				url,
				options,
			},
			({response, error}) => {
				if (error) {
					return reject(error)
				}

				resolve(response)
			})


	})
}


export {anime365API}
export default anime365API