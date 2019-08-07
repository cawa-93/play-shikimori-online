export function getReviewUrl() {
	switch (chrome.runtime.id) {
		case 'ionmfilakmebhkkioabnjhghleommgjb':
			return 'https://addons.opera.com/ru/extensions/details/play-shikimori-beta/'

		case '{dd3b05c4-06cb-4775-b47a-a30f3dfe8532}':
			return 'https://addons.mozilla.org/uk/firefox/addon/play-shikimori/reviews/'

		default:
			return 'https://chrome.google.com/webstore/detail/play-%D1%88%D0%B8%D0%BA%D0%B8%D0%BC%D0%BE%D1%80%D0%B8-online/eopmgkejoplocjnpljjhgbeadjoomcbd/reviews?hl=ru'

	}
}