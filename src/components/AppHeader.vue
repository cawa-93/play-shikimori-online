<template>
  <v-app-bar absolute app class="component-root app-header-component-root" clipped-left clipped-right dense flat>
    <v-spacer></v-spacer>
    <v-btn icon to="/">
      <v-icon>mdi-history</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-settings</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';


  @Component
  export default class AppHeader extends Vue {


  }
</script>
