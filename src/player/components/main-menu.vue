<template>
  <div>
    <template v-if="!user">
      <v-btn color="error" @click="updateAuth">Включить синхронизацию</v-btn>
    </template>
    <template v-else>вы вошли как {{user.nickname}}</template>
  </div>
</template>

<script>
import { updateAuth } from "../../helpers/oauth-provider";
export default {
  name: "main-menu",

  computed: {
    user() {
      return this.$store.state.shikimori.user;
    }
  },

  methods: {
    updateAuth() {
      return updateAuth();
    }
  }
};
</script>

