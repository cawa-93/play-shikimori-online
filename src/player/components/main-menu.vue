<template>
  <v-menu :close-on-content-click="true" :nudge-width="200" lazy>
    <template v-slot:activator="{ on }">
      <v-btn :color="user ? '' : 'error'" v-on="on" flat class="ma-0 pr-2">
        <v-icon class="mr-1" v-if="!user">sync_problem</v-icon>
        <span>{{user ? 'Открыть меню' : "Синхронизация отключена"}}</span>
        <v-icon class="ml-1">arrow_drop_down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <!-- Виджет пользователя когда он авторизован -->
      <v-list-tile avatar v-if="user">
        <v-list-tile-avatar>
          <img :src="user.image.x80" :alt="user.nickname">
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{user.nickname}}</v-list-tile-title>
          <v-list-tile-sub-title>Синхронизация включена</v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-btn icon @click="logout">
            <v-icon>logout</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>

      <!-- Ссылка на авторизацию -->
      <v-list-tile avatar v-else @click="updateAuth">
        <v-list-tile-avatar>
          <v-icon>sync</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>Включить синхронизацию</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-divider></v-divider>

    <actions v-if="$store.state.shikimori.anime"></actions>

    <!-- <div>
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
    </div>-->
  </v-menu>
</template>

<script>
import { sync, updateAuth, getAuth } from "../../helpers";
import actions from "./actions.vue";
export default {
  name: "main-menu",

  components: { actions },

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

