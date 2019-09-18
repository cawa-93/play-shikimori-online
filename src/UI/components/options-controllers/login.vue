<template>
    <v-list
        flat
        subheader
        two-line
    >
        <v-subheader>Синхронизация прогресса</v-subheader>

        <v-list-item-group
            multiple
            v-model="profiles"
        >
            <v-list-item value="shikimori">
                <template v-slot:default="{ active, toggle }">
                    <v-list-item-action>
                        <v-checkbox
                            color="primary"
                            v-model="active"
                        ></v-checkbox>
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title>Синхронизировать с Шикимори</v-list-item-title>
                        <v-list-item-subtitle>Все просмотренные серии будут автоматически добавлены в ваш список на shikimori.one</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar v-if="user && active">
                        <v-img :alt="user.nickname" :src="user.avatar"></v-img>
                    </v-list-item-avatar>
                </template>
            </v-list-item>

        </v-list-item-group>
    </v-list>
</template>


<script lang="ts">
    import profileStore from '@/UI/store/profile';
    import {Component, Vue} from 'vue-property-decorator';


    @Component({
        name: 'login-option',
    })
    export default class LoginOption extends Vue {
        // profiles: string[] = [];

        get user() {
            return profileStore.user;
        }

        get profiles() {
            if (this.user) {
                return ['shikimori'];
            } else {
                return [];
            }
        }

        //
        set profiles(value) {
            if (value.includes('shikimori')) {
                if (!this.user) {
                    profileStore.getValidCredentials(true);
                }
            } else {
                if (this.user) {
                    profileStore.logout();
                }
            }
        }


    }
</script>

<style scoped>

</style>
