<template>
  <v-app id="root">
    <v-container>
      <router-view></router-view>
      <app-footer></app-footer>

      <messages></messages>
    </v-container>
  </v-app>
</template>

<script>
import appFooter from "./components/app-footer.vue";
import messages from "./components/messages.vue";

export default {
  name: "root",

  components: { appFooter, messages }
};
</script>
