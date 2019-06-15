<template>
  <v-layout row wrap>
    <v-flex>
      <v-btn
        class="ma-0"
        flat
        :disabled="!$store.getters['player/previousEpisode']"
        @click="$store.dispatch('player/initPreviousEpisode')"
        v-ga="$ga.commands.trackVideoControls.bind(this, 'previous-episode', 'out-frame')"
      >
        <v-icon left>skip_previous</v-icon>Предыдущий эпизод
      </v-btn>
    </v-flex>
    <v-flex class="text-xs-center">
      <slot></slot>
    </v-flex>
    <v-flex class="text-xs-right">
      <v-btn
        class="ma-0"
        flat
        :disabled="!$store.getters['player/nextEpisode']"
        @click="nextEpisode"
        v-ga="$ga.commands.trackVideoControls.bind(this, 'next-episode', 'out-frame')"
      >
        Следующий эпизод
        <v-icon right>skip_next</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>


<script>
import { shikimoriAPI, anime365API } from "../../helpers";

export default {
  name: "video-controls",

  methods: {
    async nextEpisode() {
      this.$store.dispatch("shikimori/markAsWatched");
      this.$store.dispatch("player/initNextEpisode");
    },

    async saveRate(value) {
      return this.$store.dispatch("shikimori/saveUserRate", {
        score: value * 2
      });
    }
  }
};
</script>
