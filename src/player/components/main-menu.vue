<template>
  <div>
    <template v-if="!user">
      <v-btn color="error" large class="ma-0" @click="updateAuth">Включить синхронизацию</v-btn>
    </template>
    <template v-else>
      <v-list-tile style="height: 44px">
        <v-list-tile-avatar>
          <img :src="user.image.x80" :alt="user.nickname">
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{user.nickname}}</v-list-tile-title>
          <v-list-tile-sub-title>Синхронизация включена</v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-btn icon @click="logout">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </template>
  </div>
</template>

<script>
import { sync, updateAuth, getAuth } from "../../helpers";
export default {
  name: "main-menu",

  computed: {
    user() {
      console.log({ user: this.$store.state.shikimori.user });
      return this.$store.state.shikimori.user;
    }
  },

  methods: {
    updateAuth() {
      return updateAuth();
    },

    async logout() {
      const auth = await getAuth();
      if (!auth || !auth.access_token) return;

      auth.access_token = "";
      sync.set({ userAuth: auth });
    }
  }
};
</script>

