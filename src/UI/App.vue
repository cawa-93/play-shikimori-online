<template>
    <v-app id="app">
        <v-container class="flex">
            <router-view></router-view>
        </v-container>
        <app-footer></app-footer>

        <!--    <messages></messages>-->
    </v-app>
</template>


<script lang="ts">
    import AppFooter from '@/UI/components/app-footer.vue';
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components: {
            AppFooter,
        },
    })
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
