<template>
	<main>
		<v-progress-linear :indeterminate="true" class="ma-0" v-if="loading"></v-progress-linear>

		<div class="d-grid" v-if="history.length">
			<div :key="anime.id" class="grid-item" md3 sm6 v-for="anime of history" xs12>
				<v-card :to="'/player/anime/' + anime.id + '/' + (anime.episodes + 1)" hover>
					<v-img
							:aspect-ratio="225/314"
							:src="'https://shikimori.one' + anime.image"
							gradient="to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 68%,rgba(0,0,0,0.8) 100%"
					>
						<v-container class="fill-height" fill-height fluid>
							<v-layout fill-height>
								<v-flex align-end d-flex xs12>
									<span class="white--text body-1">{{anime.name}}</span>
								</v-flex>
							</v-layout>
						</v-container>
					</v-img>
				</v-card>
			</div>
		</div>

		<div class="text-center py-12" v-else>
			<p class="headline">Здесь будет отображаться ваша история просмотров</p>
			<p class="body-2">
				Откройте любое аниме на
				<a href="https://shikimori.one/animes" target="_self">Шикимори</a> или
				<a href="https://myanimelist.net/anime/season" target="_self">MyAnimeList</a> и нажмите «Начать
				просмотр»
			</p>
		</div>
	</main>
</template>

<script>
	import {sync}    from '../../helpers'
	import appFooter from '../components/app-footer.vue'
	import clearBtn  from '../components/clear-btn.vue'


	export default {
		components: {
			appFooter,
			clearBtn,
		},

		data() {
			return {
				history: [],
				loading: true,
			}
		},

		computed: {},

		beforeCreate() {
			document.title = 'История просмотров'
			document.head.querySelector('link[rel="icon"]').href = `/icons/play.png`
		},

		async mounted() {
			const {watching_history} = await sync.get({watching_history: []})

			this.loading = false
			this.history = watching_history || []

			chrome.storage.onChanged.addListener(changes => {
				if (!changes.watching_history) {
					return
				}

				this.history = changes.watching_history.newValue || []
			})

			// Заранее загружаем первое в списке аниме так как вероятнее всего именно его откроет пользователь
			if (this.history[0] && !this.$store.state.player.episodes.length) {
				console.log(this.history[0])
				this.$store.dispatch('player/loadEpisodes', {
					anime: this.history[0].id,
					episode: this.history[0].episodes + 1, // Загружаем следующую серию
				})
			}

			this.$ga.page(`/history`) // Отправляем данные в аналитику
		},
	}
</script>

<style scoped>
	.d-grid {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 20px;
	}

	@media (min-width: 428px) {
		.d-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 663px) {
		.d-grid {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}

	@media (min-width: 1264px) {
		.d-grid {
			grid-template-columns: 1fr 1fr 1fr 1fr;
		}
	}

	@media (min-width: 1904px) {
		.d-grid {
			grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		}
	}
</style>
