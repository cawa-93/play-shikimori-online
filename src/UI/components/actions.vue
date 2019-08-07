<template>
	<v-list>
		<template v-if="pictureInPictureEnabled">
			<v-list-item
					@click="pictureInPictureToggle"
					v-ga="$ga.commands.trackAction.bind(this, 'picture-in-picture')"
			>
				<v-list-item-action>
					<v-icon>mdi-picture-in-picture-bottom-right</v-icon>
				</v-list-item-action>

				<v-list-item-title>Картинка в картинке</v-list-item-title>
			</v-list-item>

			<v-divider class="my-2"></v-divider>
		</template>

		<v-list-item
				:href="shikiLink.url"
				rel="noopener noreferrer"
				v-ga="$ga.commands.trackAction.bind(this, 'open-on-shikimori')"
				v-if="shikiID"
		>
			<v-list-item-action>
				<v-icon>mdi-open-in-new</v-icon>
			</v-list-item-action>

			<v-list-item-title>{{ shikiLink.label }}</v-list-item-title>
		</v-list-item>

		<v-list-item
				:href="reportAboutError.url"
				rel="noopener noreferrer"
				v-ga="$ga.commands.trackAction.bind(this, 'report-about-error')"
				v-if="$store.state.player.currentTranslation"
		>
			<v-list-item-action>
				<v-icon>mdi-alert-octagon</v-icon>
			</v-list-item-action>

			<v-list-item-title>{{ reportAboutError.label }}</v-list-item-title>
		</v-list-item>
	</v-list>
</template>

<script>
	export default {
		name:     'actions',
		data() {
			return {
				pictureInPictureEnabled: document.pictureInPictureEnabled,
			}
		},
		computed: {
			shikiID() {
				if (this.$store.state.player.currentEpisode) {
					return this.$store.state.player.currentEpisode.myAnimelist
				}

				return this.$route.params.anime
			},
			shikiLink() {
				return {
					label: 'Открыть на Шикимори',
					url:   `https://shikimori.one/animes/${this.shikiID}`,
				}
			},

			reportAboutError() {
				return {
					label: 'Сообщить о проблеме с видео',
					url:   `https://smotret-anime-365.ru/translations/report/${this.$store.state.player.currentTranslation.id}`,
				}
			},
		},

		methods: {
			pictureInPictureToggle() {
				/** @type {HTMLIFrameElement} */
				const iframe = document.body.querySelector('iframe#player')
				if (iframe) {
					iframe.contentWindow.postMessage(
						{name: 'pictureInPictureToggle'},
						'*',
					)
				}
			},
		},
	}
</script>
