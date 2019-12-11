<template>
  <v-app id="app">
    <app-header></app-header>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import AppHeader from '@/components/AppHeader.vue';
  import {shikimori} from '@/plugins/shikimori.axios.ts';
  // import {episodesStore} from '@/store/modules/episodes';
  // import {translationsStore} from '@/store/modules/translations';
  // import {seriesStore} from '@/store/modules/series';




  @Component({
    components: {AppHeader}
  })
  export default class App extends Vue {
  }
</script>

<style>
  .cursor-wait {
    cursor: wait;
  }
</style>
