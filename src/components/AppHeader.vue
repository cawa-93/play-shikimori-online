<template>
  <v-app-bar app flat>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-settings</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class AppHeader extends Vue {



  }
</script>
