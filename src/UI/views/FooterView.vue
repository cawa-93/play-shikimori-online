<template>
    <div>
        <v-container class="flex" id="page-content">
            <router-view></router-view>
        </v-container>
        <app-footer></app-footer>

        <messages></messages>
    </div>

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
