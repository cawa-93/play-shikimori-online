<template>
    <v-app id="app">
        <router-view></router-view>
    </v-app>
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
</style>
