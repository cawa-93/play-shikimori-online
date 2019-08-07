<template>
	<v-menu :close-on-content-click="true" :nudge-width="200" transition="slide-y-transition">
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
		</v-list>

		<v-divider></v-divider>

		<actions></actions>
	</v-menu>
</template>

<script>
	import actions from './actions.vue'


	export default {
		name: 'main-menu',

		components: {actions},

		computed: {
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

