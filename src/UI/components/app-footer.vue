<template>
	<v-footer :absolute="false" :fixed="false" class="mt-12" padless>
		<v-card :dark="false" class="text-center red lighten-1" flat tile width="100%">
			<v-card-text>
				<v-btn
					@click="track('https://www.patreon.com/bePatron?u=18212353')"
					class="mx-4"
					color
					href="https://www.patreon.com/bePatron?u=18212353&utm_source=extension&utm_medium=footer-button&utm_campaign=play-shikimori-online&utm_content=Угостить%20автора%20печенькой"
					outlined
					rounded
				>
					<v-icon class="mr-2" size="24px">mdi-patreon</v-icon>
					<span>Угостить автора печенькой</span>
				</v-btn>
				<v-tooltip :key="link.url" top v-for="link of links">
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							:href="link.url"
							@click="track(link.url)"
							class="mx-4"
							icon
							v-bind="attrs"
							v-on="on"
						>
							<v-icon size="24px">{{ link.icon }}</v-icon>
						</v-btn>
					</template>

					<span>{{link.label}}</span>
				</v-tooltip>

				<clear-btn></clear-btn>
			</v-card-text>

			<v-divider></v-divider>

			<v-card-text>
				<v-icon small>mdi-copyright</v-icon>
				<a
					:href="'https://' + domain"
					:key="domain"
					@click="track('https://' + domain)"
					class="px-2 color-inherit d-inline-block"
					v-for="domain of copyright"
				>{{domain}}</a>
			</v-card-text>
		</v-card>
	</v-footer>
</template>

<script>
	import clearBtn from './clear-btn.vue'


	export default {
		components: {clearBtn},
		data() {
			const manifest = chrome.runtime.getManifest()
			return {
				manifest,

				links: [
					{
						icon: 'mdi-account-question',
						label: 'Обсудить расширение или задать вопрос автору',
						url: manifest.homepage_url,
					},
					{
						icon: 'mdi-github-circle',
						label: 'Исходный код на GitHub',
						url: 'https://github.com/cawa-93/play-shikimori-online',
					},
				],

				copyright: ['shikimori.one', 'smotret-anime-365.ru', 'myanimelist.net'],
			}
		},

		methods: {
			track(label) {
				this.$ga.event('actions', 'footer-link', label)
			},
		},
	}
</script>