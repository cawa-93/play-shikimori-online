<template>

    <router-view></router-view>

</template>


<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class App extends Vue {
    }
</script>

<style>
    .v-application--wrap > .container {
        padding-bottom: 0;
    }

    .w-100 {
        width: 100%;
    }

    .v-btn {
        letter-spacing: normal;
    }

    .color-inherit {
        color: inherit !important;
    }

    .player-container .v-skeleton-loader__image {
        height: 100%;
    }
</style>
