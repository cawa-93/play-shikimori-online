<template>
    <v-btn
        :icon="compact"
        :text="!compact"
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
    name: 'profile',
})
export default class Profile extends Vue {
    @Prop() public readonly compact!: boolean;
}
</script>

<style scoped>

</style>
