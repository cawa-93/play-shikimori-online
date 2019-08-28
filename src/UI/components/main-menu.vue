<template>
    <v-menu :close-on-content-click="true" :nudge-width="240" nudge-left="80" nudge-top="83">
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

                <v-list-item-action>
                    <v-tooltip top>
                        <template v-slot:activator="{on, attrs}">
                            <v-btn @click="toggleTheme" icon small v-bind="attrs" v-on="on">
                                <v-icon>mdi-brightness-6</v-icon>
                            </v-btn>
                        </template>
                        <span>Включить {{$vuetify.theme.dark ? 'светлую' : 'темную'}} тему</span>
                    </v-tooltip>
                </v-list-item-action>

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

                <v-list-item-action @click.stop>
                    <v-tooltip top>
                        <template v-slot:activator="{on, attrs}">
                            <v-btn @click="toggleTheme" icon small v-bind="attrs" v-on="on">
                                <v-icon>mdi-brightness-6</v-icon>
                            </v-btn>
                        </template>
                        <span>Включить {{$vuetify.theme.dark ? 'светлую' : 'темную'}} тему</span>
                    </v-tooltip>
                </v-list-item-action>

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
                v-if="reportAboutError"
            >
                <v-list-item-action>
                    <v-icon>mdi-alert-octagon</v-icon>
                </v-list-item-action>

                <v-list-item-title>{{ reportAboutError.label }}</v-list-item-title>
            </v-list-item>
        </v-list>

    </v-menu>
</template>

<script lang="ts">
    import {playerStore, profileStore} from '@/UI/store';
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        name: 'main-menu',
    })
    export default class MainMenu extends Vue {
        public theme: string = localStorage.getItem('theme') || 'dark';

        get player() {
            return playerStore;
        }

        get shikiID() {
            if (this.player.currentEpisode) {
                return this.player.currentEpisode.myAnimelist;
            }

            return this.$route.params.anime;
        }

        get shikiLink() {
            return {
                label: 'Открыть на Шикимори',
                url: `https://shikimori.one/animes/${this.shikiID}`,
            };
        }


        get reportAboutError() {
            if (!this.player.currentTranslation) {
                return null;
            }

            return {
                label: 'Сообщить о проблеме с видео',
                url: `https://smotret-anime-365.ru/translations/report/${this.player.currentTranslation.id}`,
            };
        }

        get user() {
            return profileStore.user;
        }


        public logIn() {
            return profileStore.getValidCredentials(true);
        }

        public logout() {
            return profileStore.logout();
        }

        public toggleTheme() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
            localStorage.setItem('theme', this.$vuetify.theme.dark ? 'dark' : 'light');
            document.querySelector('html')!.style.background = this.$vuetify.theme.dark ? '#303030' : '#fafafa';
        }
    }
</script>

