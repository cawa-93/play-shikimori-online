<template>
    <section class="d-flex justify-center w-100" id="controls">
        <div class="w-100 d-flex" id="toolbar">
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
    }
</script>


<style>
    #toolbar {
        background: none;
    }

    #toolbar .v-btn.v-btn--active::before {
        opacity: 0;
    }

    #toolbar .v-btn.v-btn--active:hover::before {
        opacity: 0.04;
    }

    #toolbar .v-btn.v-btn {
        border: none;
    }

    #toolbar .v-btn.v-btn .v-icon {
        color: inherit;
    }

    #toolbar .preference,
    #toolbar .download-video {
        flex-shrink: 1;
        flex-grow: 1;
    }

    #toolbar .open-on-shikimori,
    #toolbar .next-episode {
        flex-shrink: 2;
        flex-grow: 1;
    }
</style>
