<template>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-btn @click="clear" class="mx-4" icon text v-bind="attrs" v-on="on">
                <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
        </template>
        <span>Сбросить все данные</span>
    </v-tooltip>
</template>


<script lang="ts">
    import {local, sync} from '@/helpers/chrome-storage';
    // @ts-ignore
    import storage from 'kv-storage-polyfill';
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class ClearBtn extends Vue {
        /**
         * @see https://stackoverflow.com/a/179514/4543826
         */
        public deleteAllCookies() {
            const cookies = document.cookie.split(';');

            for (const cookie of cookies) {
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
            }
        }


        public async clear() {
            const confirmMessage =
                'Все данные программы и история просмотров будут удалены а эта страница будет закрыта.'
                + '\n\n'
                + 'Вы уверены, что хотите продолжить?';
            if (!confirm(confirmMessage)) {
                return;
            }

            const promise = Promise.all([
                sync.clear(),
                local.clear(),
                storage.clear(),
            ]);
            localStorage.clear();
            sessionStorage.clear();
            this.deleteAllCookies();

            await promise;
            chrome.runtime.reload();
        }
    }
</script>
