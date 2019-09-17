<template>
    <section class="d-flex justify-center w-100" id="controls">
        <div class="w-100  v-item-group v-btn-toggle" id="toolbar">
            <previous></previous>

            <open-on-shikimori :compact="compact"></open-on-shikimori>

            <profile :compact="compact"></profile>

            <next :compact="compact"></next>
        </div>
    </section>
</template>

<script lang="ts">
import Next from '@/UI/components/controls/next.vue';
import OpenOnShikimori from '@/UI/components/controls/open-on-shikimori.vue';
import Previous from '@/UI/components/controls/previous.vue';
import Profile from '@/UI/components/controls/profile.vue';
import {Component, Vue} from 'vue-property-decorator';

@Component({
    components: {
        Previous, OpenOnShikimori, Profile, Next,
    },
})
export default class Controls extends Vue {
    public $el!: HTMLDivElement;

    get compact() {
        return this.$vuetify.breakpoint.xsOnly;
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
    #controls {
        /*position: sticky;*/
        bottom: 20px;
        z-index: 10;
        background-color: #000;
    }

    #controls #toolbar {
        border: none;
        background-color: rgba(7, 20, 30, .7);
    }

    .theme--light #toolbar {
        background-color: #fafafa;
    }

    #toolbar.v-btn-toggle > .v-btn.v-btn {
        border: none;
        color: #fff;
    }

    #toolbar.v-btn-toggle > .v-btn.v-btn .v-icon {
        color: inherit;
    }

    #toolbar.v-btn-toggle .open-on-shikimori,
    #toolbar.v-btn-toggle .profile,
    #toolbar.v-btn-toggle .next-episode {
        flex: 1;
    }
</style>
