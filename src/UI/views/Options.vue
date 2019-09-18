<template>
    <v-app id="app">

        <v-list
            flat
            subheader
            two-line
        >

            <v-subheader>Синхронизация прогресса</v-subheader>

            <v-list-item-group
                multiple
                v-model="sync"
            >
                <v-list-item>
                    <template v-slot:default="{ active, toggle }">
                        <v-list-item-action>
                            <v-checkbox
                                @click="toggle"
                                color="primary"
                                v-model="active"
                            ></v-checkbox>
                        </v-list-item-action>

                        <v-list-item-content>
                            <v-list-item-title>Синхронизировать с Шикимори</v-list-item-title>
                            <v-list-item-subtitle>Все просмотренные серии будут автоматически добавлены в ваш список на shikimori.one</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-action>
                            <v-avatar v-if="user && active">
                                <v-img :src="user.avatar"></v-img>
                            </v-avatar>

                        </v-list-item-action>
                    </template>
                </v-list-item>

            </v-list-item-group>
        </v-list>

        <v-list
            class="mt-3"
            flat
            subheader
            two-line
        >

            <v-subheader>Внешний вид</v-subheader>

            <v-list-item-group
                multiple
                v-model="theme"
            >
                <v-list-item>
                    <template v-slot:default="{ active, toggle }">
                        <v-list-item-action>
                            <v-checkbox
                                @click="toggle"
                                color="primary"
                                v-model="active"
                            ></v-checkbox>
                        </v-list-item-action>

                        <v-list-item-content>
                            <v-list-item-title>Включить темную тему</v-list-item-title>
                        </v-list-item-content>
                    </template>
                </v-list-item>

            </v-list-item-group>
        </v-list>

    </v-app>
</template>

<script lang="ts">
    import profileStore from '@/UI/store/profile';
    import {Component, Vue} from 'vue-property-decorator';


    @Component
    export default class Options extends Vue {
        public syncPrivate: number[] = [];

        get user() {
            return profileStore.user;
        }

        get sync() {
            return this.user ? [0] : [];
        }

        set sync(v) {
            v.length ? this.logIn() : this.logout();
            this.syncPrivate = v;
        }

        get theme() {
            return this.$vuetify.theme.dark ? [0] : [];
        }

        set theme(v) {
            // @ts-ignore
            this.$vuetify.theme.dark = v.length > 0;
            localStorage.setItem('theme', v.length > 0 ? 'dark' : 'light');
        }


        public logIn() {
            return profileStore.getValidCredentials(true);
        }

        public logout() {
            return profileStore.logout();
        }


    }
</script>

<style scoped>

</style>
