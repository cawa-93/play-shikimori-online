<template>
	<section class="translation-list">
		<v-select
			:items="groupedTranslations"
			:label="label"
			:loading="translations.length === 0"
			filled
			hide-details
			item-text="authorsSummary"
			item-value="id"
			no-data-text="Пока нет ни одного перевода"
			v-model="currentTranslation"
		>
			<template v-slot:item="{item}">
				<template v-if="item.label">
					<v-subheader>{{item.label}}</v-subheader>
				</template>
				<template v-else>
					<v-list-item-action>
						<v-icon v-if="item.qualityType === 'uncensored'">mdi-explicit</v-icon>
						<v-icon v-else-if="item.qualityType !== 'tv' ">mdi-quality-high</v-icon>
					</v-list-item-action>

					<v-list-item-content>
						<v-list-item-title>{{item.authorsSummary}}</v-list-item-title>
					</v-list-item-content>
				</template>
			</template>

			<template v-slot:append-item>
				<v-list-item class="mt-2" href="https://smotret-anime-365.ru/translations/create">
					<v-list-item-action>
						<v-icon>mdi-plus-box</v-icon>
					</v-list-item-action>

					<v-list-item-content>
						<v-list-item-title>Добавить перевод</v-list-item-title>
					</v-list-item-content>

					<v-list-item-action>
						<v-icon>mdi-open-in-new</v-icon>
					</v-list-item-action>
				</v-list-item>
			</template>
		</v-select>
	</section>
</template>


<script>
	import {storage} from 'kv-storage-polyfill'


	export default {
		name: 'translation-list',

		data() {
			return {
				filters: {
					type: {
						value: 'voiceRu',
						options: [],
					},
				},
			}
		},

		computed: {
			translations() {
				return this.$store.state.player.currentEpisode &&
				       this.$store.state.player.currentEpisode.translations
				       ? this.$store.state.player.currentEpisode.translations
				       : []
			},

			groupedTranslations() {
				const items = []

				if (!this.translations || !this.translations.length) {
					return items
				}
				const groups = [
					{type: 'voiceRu', label: 'Озвучка'},
					{type: 'voiceEn', label: 'Английская Озвучка'},
					{type: 'subRu', label: 'Русские Субтитры'},
					{type: 'subEn', label: 'Английские Субтитры'},
					{type: 'subJa', label: 'Японские Субтитры'},
					{type: 'raw', label: 'Оригинал'},
				]

				groups.forEach(({type, label}) => {
					const translations = this.translations
						.filter(t => t.type === type)
						.map(translation => {
							if (!translation.authorsSummary) {
								translation.authorsSummary = 'Неизвестный'
							}

							return translation
						})

					if (translations.length) {
						items.push({
							label,
							disabled: true,
						})

						items.push(...translations)

						items.push({
							divider: true,
							disabled: true,
						})
					}
				})

				return items
			},

			currentTranslation: {
				get() {
					return this.$store.state.player.currentTranslation
					       ? this.$store.state.player.currentTranslation.id
					       : null
				},
				async set(id) {
					const translation = this.translations.find(
						translation => translation.id === id,
					)

					if (translation) {
						this.$store.dispatch('player/selectTranslation', {
							translation,
						})

						this.$nextTick(async () => {
							/**
							 * @type {Map<number, anime365.Translation>}
							 */
							let history = await storage.get('lastSelectedTranslations')

							// Если ранее хранилище переводов не создавалось — инициализировать его
							if (!history) {
								history = new Map()
							}

							history.set(translation.seriesId, translation)

							await storage.set('lastSelectedTranslations', history)
						})
					}
				},
			},

			label() {
				if (!this.$store.state.player.currentTranslation) {
					return this.translations.length ? 'Выберите перевод' : 'Загрузка...'
				}
				switch (this.$store.state.player.currentTranslation.type) {
					case 'voiceRu':
						return 'Озвучка'
					case 'voiceEn':
						return 'Английская Озвучка'
					case 'subRu':
						return 'Русские Субтитры'
					case 'subEn':
						return 'Английские Субтитры'
					case 'subJa':
						return 'Японские Субтитры'
					case 'raw':
						return 'Оригинал'
					default:
						'Перевод'
				}
			},
		},
	}
</script>


<style>
	.qualityType {
		text-align: center;
		flex: 1;
	}
</style>
