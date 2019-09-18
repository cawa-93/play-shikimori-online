<template>
    <v-btn
        :icon="compact"
        :text="!compact"
        @click="openOptionsPage"
        aria-label="Настройки"
        class="flex-parent profile"
    >
        <v-icon :left="!compact">
            mdi-settings
        </v-icon>
        <span class="long-and-truncated"
              v-if="!compact">Настройки</span>
    </v-btn>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
    name: 'preference',
})
export default class Preference extends Vue {
    @Prop() public readonly compact!: boolean;

    public openOptionsPage() {
        return chrome.runtime.openOptionsPage();
    }
}
</script>
