<template>
    <div class="flex-parent preference">
        <v-btn
            @click="openOptionsPage"
            aria-label="Настройки"
            text
            v-if="readyToShow"
        >
            <v-icon :color="!user ? 'error' : ''">mdi-{{user ? 'settings' : 'sync-off'}}</v-icon>
            <span class="long-and-truncated ml-2" v-if="!compact">Настройки</span>
        </v-btn>
        <v-skeleton-loader type="button" v-else></v-skeleton-loader>
    </div>

</template>

<script lang="ts">
import Boilerplate from '@/UI/mixins/boilerplate';
import profileStore from '@/UI/store/profile';
import {mixins} from 'vue-class-component';
import {Component, Prop, Watch} from 'vue-property-decorator';

@Component({
    name: 'preference',
})
export default class Preference extends mixins(Boilerplate) {
    @Prop() public readonly compact!: boolean;

    get user() {
        return profileStore.user;
    }

    public openOptionsPage() {
        return chrome.runtime.openOptionsPage();
    }

    @Watch('user', {deep: false})
    public nextEpisodeOnChange() {
        this.readyToShow = true;
    }
}
</script>
