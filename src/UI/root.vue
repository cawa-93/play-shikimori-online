<template>
  <v-app id="root">
    <v-container class="flex">
      <router-view></router-view>
    </v-container>
    <app-footer></app-footer>

    <messages></messages>
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

<style>
.w-100 {
  width: 100%;
}
.v-btn {
  letter-spacing: normal;
}
</style>
