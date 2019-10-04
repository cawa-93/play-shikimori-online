<template>
    <v-app id="app">
        <v-container class="flex" id="page-content">
            <transition appear mode="out-in" name="fade-transition">
                <router-view></router-view>
            </transition>
        </v-container>
        <app-footer></app-footer>

        <messages></messages>
    </v-app>

</template>

<script lang="ts">
    import AppFooter from '@/UI/components/app-footer.vue';
    import Messages from '@/UI/components/messages.vue';
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        name: 'footer-template',
        components: {
            AppFooter,
            Messages,
        },
    })
    export default class FooterTemplate extends Vue {
    }
</script>
