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
          <img :src="user.image.x80" :alt="user.nickname" />
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{user.nickname}}</v-list-tile-title>
          <v-list-tile-sub-title>Синхронизация включена</v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-btn icon to="/history" title="История просмотров">
            <v-icon>history</v-icon>
          </v-btn>
        </v-list-tile-action>

        <v-list-tile-action>
          <v-btn icon @click="logout" title="Выключить синхронизацию">
            <v-icon>exit_to_app</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>

      <!-- Ссылка на авторизацию -->
      <v-list-tile avatar v-else @click="logIn">
        <v-list-tile-avatar>
          <v-icon>sync</v-icon>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>Включить синхронизацию</v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action @click.stop>
          <v-btn icon href="/history/index.html" title="История просмотров">
            <v-icon>history</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>

    <v-divider></v-divider>

    <actions></actions>
  </v-menu>
</template>

<script>
import actions from "./actions.vue";
export default {
  name: "main-menu",

  components: { actions },

  computed: {
    user() {
      return this.$store.state.shikimori.user;
    }
  },

  methods: {
    logIn() {
      return this.$store.dispatch("shikimori/getValidCredentials", true);
    },

    logout() {
      return this.$store.commit("shikimori/logout");
    }
  }
};
</script>

