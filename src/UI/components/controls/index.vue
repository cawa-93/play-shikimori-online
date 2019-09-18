<template>
    <section class="d-flex justify-center w-100" id="controls">
        <div class="w-100  v-item-group v-btn-toggle" id="toolbar">
            <previous :compact="true"></previous>
            <preference :compact="compact"></preference>
            <download-video :compact="compact"></download-video>
            <open-on-shikimori :compact="compact"></open-on-shikimori>
            <next :compact="compact"></next>
        </div>
    </section>
</template>

<script lang="ts">
    import DownloadVideo from '@/UI/components/controls/download.vue';
    import Next from '@/UI/components/controls/next.vue';
    import OpenOnShikimori from '@/UI/components/controls/open-on-shikimori.vue';
    import Preference from '@/UI/components/controls/preference.vue';
    import Previous from '@/UI/components/controls/previous.vue';
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components: {
            Previous, OpenOnShikimori, Preference, Next, DownloadVideo,
        },
    })
    export default class Controls extends Vue {
        public $el!: HTMLDivElement;

        get compact() {
            return this.$vuetify.breakpoint.smAndDown;
        }

        // reCalculateCompact() {
        //     this.compact =;
        // }
        //
        // created() {
        //     window.addEventListener('resize', () => this.reCalculateCompact());
        // }
    }
</script>


<style>

    #toolbar.v-btn-toggle > .v-btn.v-btn {
        border: none;
    }

    #toolbar.v-btn-toggle > .v-btn.v-btn .v-icon {
        color: inherit;
    }

    #toolbar.v-btn-toggle .preference,
    #toolbar.v-btn-toggle .download-video {
        flex-shrink: 1;
        flex-grow: 1;
    }

    #toolbar.v-btn-toggle .open-on-shikimori,
    #toolbar.v-btn-toggle .next-episode {
        flex-shrink: 2;
        flex-grow: 1;
    }
</style>
