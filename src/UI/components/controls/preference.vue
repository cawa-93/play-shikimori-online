<template>
    <v-btn
        @click="openOptionsPage"
        aria-label="Настройки"
        class="flex-parent preference"
        text
    >
        <v-icon :color="!user ? 'error' : ''">mdi-{{user ? 'settings' : 'sync-off'}}</v-icon>
        <span class="long-and-truncated ml-2" v-if="!compact">Настройки</span>
    </v-btn>
</template>

<script lang="ts">
    import profileStore from '@/UI/store/profile';
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({
        name: 'preference',
    })
    export default class Preference extends Vue {
        @Prop() public readonly compact!: boolean;

        get user() {
            return profileStore.user;
        }

        public openOptionsPage() {
            return chrome.runtime.openOptionsPage();
        }
    }
</script>
