<template>
	<section class="episode-list">
		<template class="mdc-select">
			<v-select
				:items="episodes"
				:label="label"
				:loading="episodes.length === 0"
				filled
				hide-details
				item-text="episodeFull"
				item-value="id"
				no-data-text="Пока нет ни одной серии"
				v-model="selectedEpisode"
			>
				<template v-slot:item="{item}">
					<v-list-item-action @click.prevent.stop="markAsWatched(item)" v-if="$store.state.shikimori.user">
						<v-checkbox :input-value="item.episodeInt <= watchedEpisodes" @click.prevent></v-checkbox>
					</v-list-item-action>

					<v-list-item-content class="inset">
						<v-list-item-title>{{item.episodeFull}}</v-list-item-title>
					</v-list-item-content>
				</template>

				<template v-slot:selection="{item}">
					<div class="v-select__selection v-select__selection--comma">
						<span>{{item.episodeFull}}</span>
						<span class="ml-1" v-if="item.episodeInt <= watchedEpisodes">— просмотрено</span>
					</div>
				</template>

				<template v-slot:append-item>
					<v-divider class="mb-2"></v-divider>

					<v-list-item href="https://smotret-anime-365.ru/translations/create">
						<v-list-item-action>
							<v-icon>mdi-plus-box</v-icon>
						</v-list-item-action>

						<v-list-item-content>
							<v-list-item-title>Добавить серию</v-list-item-title>
						</v-list-item-content>

						<v-list-item-action>
							<v-icon>mdi-open-in-new</v-icon>
						</v-list-item-action>
					</v-list-item>
				</template>
			</v-select>
		</template>
	</section>
</template>

<script>
	export default {
		name: 'episode-list',

		computed: {
			episodes() {
				return this.$store.state.player.episodes
			},

			selectedEpisode: {
				get() {
					return this.$store.state.player.currentEpisode
					       ? this.$store.state.player.currentEpisode.id
					       : null
				},

				set(id) {
					return this.$store.dispatch(
						'player/selectEpisode',
						this.episodes.find(e => e.id === id),
					)
				},
			},

			watchedEpisodes() {
				return this.$store.state.shikimori.anime &&
				       this.$store.state.shikimori.anime.user_rate
				       ? this.$store.state.shikimori.anime.user_rate.episodes
				       : 0
			},

			label() {
				return this.$store.state.shikimori.anime &&
				       (
					       this.$store.state.shikimori.anime.russian ||
					       this.$store.state.shikimori.anime.name
				       )
				       ? this.$store.state.shikimori.anime.russian ||
				         this.$store.state.shikimori.anime.name
				       : 'Серия'
			},
		},

		methods: {
			markAsWatched(episode) {
				let episodes = parseInt(episode.episodeInt)

				if (episodes <= this.watchedEpisodes) {
					episodes--
				}

				this.$store.dispatch('shikimori/saveUserRate', {episodes})
			},
		},
	}
</script>

<style>
</style>