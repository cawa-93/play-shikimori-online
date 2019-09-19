<template>
    <v-app id="app">
        <v-container class="flex pb-3" id="page-content">
            <login-option class="mb-3"></login-option>
            <theme-option class="mb-3"></theme-option>

            <footer class="d-flex pt-3 justify-center">
                <v-btn href="https://github.com/cawa-93/play-shikimori-online/wiki/FAQ" outlined rounded>FAQ</v-btn>
            </footer>
        </v-container>
    </v-app>
</template>

<script lang="ts">
    import LoginOption from '@/UI/components/options-controllers/login.vue';
    import ThemeOption from '@/UI/components/options-controllers/theme.vue';
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        components: {LoginOption, ThemeOption},
    })
    export default class Options extends Vue {
    }
</script>

<style scoped>

</style>
