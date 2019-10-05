<template>
    <section class="d-flex w-100" id="toolbar">
        <previous :compact="true"></previous>
        <preference :compact="compact"></preference>
        <download-video :compact="compact"></download-video>
        <open-on-shikimori :compact="compact"></open-on-shikimori>
        <next :compact="compact"></next>
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
    #toolbar .v-btn.v-btn .v-icon {
        color: inherit;
    }

    /*#toolbar > div {*/
    /*    flex: 1;*/
    /*}*/

    #toolbar > div .v-btn,
    #toolbar > div .v-skeleton-loader,
    #toolbar > div .v-skeleton-loader .v-skeleton-loader__button {
        width: 100%;
    }

    #toolbar > div:not(:first-child) .v-skeleton-loader {
        padding-left: 5px;
    }

    #toolbar .preference,
    #toolbar .download-video {
        flex: 1;
    }

    #toolbar .open-on-shikimori,
    #toolbar .next-episode {
        flex: 2;
    }
</style>
