<template>
	<v-menu :close-on-content-click="true" :nudge-width="200" nudge-top="83">
		<template v-slot:activator="{ on, attrs }">
			<v-btn :color="user ? '' : 'error'" class="pr-2" text v-bind="attrs" v-on="on">
				<v-icon class="mr-1" v-if="!user">mdi-sync-alert</v-icon>
				<span
					class="long-and-truncated"
				>{{$vuetify.breakpoint.xsOnly ? 'Меню' : user ? 'Открыть меню' : 'Синхронизация отключена'}}</span>
				<v-icon class="ml-1">mdi-menu-down</v-icon>
			</v-btn>
		</template>

		<v-list>
			<!-- Виджет пользователя когда он авторизован -->
			<v-list-item key="user-logged-in" v-if="user">
				<v-list-item-avatar>
					<img :alt="user.nickname" :src="user.image.x80"/>
				</v-list-item-avatar>

				<v-list-item-content>
					<v-list-item-title>{{user.nickname}}</v-list-item-title>
					<v-list-item-subtitle>Синхронизация включена</v-list-item-subtitle>
				</v-list-item-content>

				<v-list-item-action key="open-history">
					<v-tooltip top>
						<template v-slot:activator="{on, attrs}">
							<v-btn :to="{name: 'history'}" icon small v-bind="attrs" v-on="on">
								<v-icon>mdi-history</v-icon>
							</v-btn>
						</template>
						<span>История просмотров</span>
					</v-tooltip>
				</v-list-item-action>

				<v-list-item-action>
					<v-tooltip top>
						<template v-slot:activator="{on, attrs}">
							<v-btn @click="logout" icon small v-bind="attrs" v-on="on">
								<v-icon>mdi-sync-off</v-icon>
							</v-btn>
						</template>
						<span>Выключить синхронизацию</span>
					</v-tooltip>
				</v-list-item-action>
			</v-list-item>

			<!-- Ссылка на авторизацию -->
			<!-- Обязательну нужно указать key отличный от предыдущего пункта -->
			<!-- Иначе клик по вложенным кнопкам будет запускать авторизацию -->
			<v-list-item @click="logIn" key="user-logged-out" v-else>
				<v-list-item-avatar>
					<v-icon>mdi-sync</v-icon>
				</v-list-item-avatar>

				<v-list-item-content>
					<v-list-item-title>Включить синхронизацию</v-list-item-title>
				</v-list-item-content>

				<v-list-item-action @click.stop key="open-history">
					<v-btn :to="{name: 'history'}" icon small title="История просмотров">
						<v-icon>mdi-history</v-icon>
					</v-btn>
				</v-list-item-action>
			</v-list-item>


			<v-divider class="mb-2"></v-divider>

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

	</v-menu>
</template>

<script>
	export default {
		name: 'main-menu',

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
					url: `https://shikimori.one/animes/${this.shikiID}`,
				}
			},

			reportAboutError() {
				return {
					label: 'Сообщить о проблеме с видео',
					url: `https://smotret-anime-365.ru/translations/report/${this.$store.state.player.currentTranslation.id}`,
				}
			},
			user() {
				return this.$store.state.shikimori.user
			},
		},

		methods: {
			logIn() {
				return this.$store.dispatch('shikimori/getValidCredentials', true)
			},

			logout() {
				return this.$store.commit('shikimori/logout')
			},
		},
	}
</script>

