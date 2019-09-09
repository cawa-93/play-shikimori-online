<template>
    <v-tooltip :nudge-left="36" left transition="slide-x-reverse-transition">
        <template v-slot:activator="{on: left}">
            <v-tooltip right transition="slide-x-transition">
                <template v-slot:activator="{on: right, attrs}">
                    <v-btn
                        :loading="loading"
                        @click.exact="() => $emit('loadMore')"
                        @click.shift.exact="() => $emit('loadAll')"
                        aria-label="Загрузить больше комментариев"
                        icon
                        v-bind="attrs"
                        v-on="mergeHandlers(left, right)"
                    >
                        <v-icon large>mdi-chevron-down</v-icon>
                    </v-btn>
                </template>
                <span>+ Shift — Загрузить все</span>
            </v-tooltip>
        </template>
        <span>Загрузить больше</span>
    </v-tooltip>
</template>

<script lang="ts">
    import Component from 'vue-class-component';
    import {Prop, Vue} from 'vue-property-decorator';

    @Component({
        name: 'load-more',
    })
    export default class LoadMore extends Vue {
        @Prop() public readonly loading!: boolean;

        public mergeHandlers(handlers1: Record<string, () => void>, handlers2: Record<string, () => void>) {
            const merged: Record<string, () => void> = {};

            for (const event of new Set([...Object.keys(handlers1), ...Object.keys(handlers2)])) {

                if (handlers1[event] && handlers2[event]) {
                    merged[event] = () => {
                        handlers1[event]();
                        handlers2[event]();
                    };
                } else {
                    if (handlers1[event]) {
                        merged[event] = handlers1[event];
                    }
                    if (handlers2[event]) {
                        merged[event] = handlers2[event];
                    }

                }
            }
            return merged;
        }
    }
</script>
