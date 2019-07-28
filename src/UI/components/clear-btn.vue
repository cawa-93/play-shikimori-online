<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn @click="clear" text small color="error" v-on="on" icon>
        <v-icon>delete_forever</v-icon>
      </v-btn>
    </template>
    <span>Сбросить все данные</span>
  </v-tooltip>
</template>


<script>
import { sync, local } from "../../helpers";
import { storage } from "kv-storage-polyfill";

export default {
  name: "clear-btn",

  methods: {
    /**
     * @see https://stackoverflow.com/a/179514/4543826
     */
    deleteAllCookies() {
      const cookies = document.cookie.split(";");

      for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    },

    async clear() {
      if (
        !confirm(
          `Все данные программы и история просмотров будут удалены а эта страница будет закрыта.\n\nВы уверены, что хотите продолжить?`
        )
      ) {
        return;
      }

      this.$ga.event("actions", "clear-all-data");

      const promise = Promise.all([
        sync.clear(),
        local.clear(),
        storage.clear()
      ]);
      localStorage.clear();
      sessionStorage.clear();
      this.deleteAllCookies();

      await promise;
      chrome.runtime.reload();
    }
  }
};
</script>
