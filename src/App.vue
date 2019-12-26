<template>
  <v-app id="app">
    <app-header/>
    <v-content>
      <keep-alive include="History">
        <router-view/>
      </keep-alive>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import AppHeader from '@/components/AppHeader.vue';
  // import {episodesStore} from '@/store/modules/episodes';
  // import {translationsStore} from '@/store/modules/translations';
  // import {seriesStore} from '@/store/modules/series';




  @Component({
    components: {AppHeader},
  })
  export default class App extends Vue {
  }
</script>

<style>
  .cursor-wait {
    cursor: wait;
  }

  .v-skeleton-loader__image {
    height: 100% !important;
  }
</style>
