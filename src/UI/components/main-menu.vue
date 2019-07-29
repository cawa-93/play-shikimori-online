<template>
  <v-menu :close-on-content-click="false" :nudge-width="200">
    <template v-slot:activator="{ on, attrs }">
      <v-btn :color="user ? '' : 'error'" v-on="on" v-bind="attrs" text class="pr-2">
        <v-icon class="mr-1" v-if="!user">mdi-sync-alert</v-icon>
        <span>{{user ? 'Открыть меню' : "Синхронизация отключена"}}</span>
        <v-icon class="ml-1">mdi-menu-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <!-- Виджет пользователя когда он авторизован -->
      <v-list-item v-if="user">
        <v-list-item-avatar>
          <img :src="user.image.x80" :alt="user.nickname" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{user.nickname}}</v-list-item-title>
          <v-list-item-subtitle>Синхронизация включена</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon small to="/history" title="История просмотров">
            <v-icon>mdi-history</v-icon>
          </v-btn>
        </v-list-item-action>

        <v-list-item-action>
          <v-btn icon small @click="logout" title="Выключить синхронизацию">
            <v-icon>mdi-sync-off</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <!-- Ссылка на авторизацию -->
      <v-list-item avatar v-else @click="logIn">
        <v-list-item-avatar>
          <v-icon>mdi-sync</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Включить синхронизацию</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action @click.stop>
          <v-btn icon small href="/history/index.html" title="История просмотров" tabindex="0">
            <v-icon>mdi-history</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
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

