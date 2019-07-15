<template>
  <v-layout row wrap>
    <v-flex>
      <v-btn
        class="ma-0"
        flat
        :disabled="!previous"
        @click.prevent="$store.dispatch('player/selectPreviousEpisode')"
        :href="urls.previous"
        target="_self"
        v-ga="$ga.commands.trackVideoControls.bind(this, 'previous-episode', 'out-frame')"
      >
        <v-icon left>skip_previous</v-icon>
        <span>Предыдущая</span>
        <span class="hide-on-xs ml-1">серия</span>
      </v-btn>
    </v-flex>

    <v-flex class="text-xs-center main-menu">
      <slot></slot>
    </v-flex>

    <v-flex class="text-xs-right">
      <v-btn
        class="ma-0"
        flat
        v-if="next || !$store.state.shikimori.nextSeason"
        :disabled="!next"
        @click.prevent="nextEpisode"
        :href="urls.next"
        target="_self"
        v-ga="$ga.commands.trackVideoControls.bind(this, 'next-episode', 'out-frame')"
      >
        Следующая
        <span class="hide-on-xs ml-1">серия</span>
        <v-icon right>skip_next</v-icon>
      </v-btn>

      <v-btn
        class="ma-0"
        flat
        v-else
        :href="urls.next"
        target="_self"
        @click="$store.dispatch('shikimori/markAsWatched')"
        v-ga="$ga.commands.trackVideoControls.bind(this, 'next-season', 'out-frame')"
      >
        {{$store.state.shikimori.nextSeason.name}}
        <v-icon right>skip_next</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>


<script>
import { shikimoriAPI, anime365API } from "../../helpers";

export default {
  name: "video-controls",

  computed: {
    previous() {
      return this.$store.state.player.currentEpisode
        ? this.$store.state.player.currentEpisode.previous
        : null;
    },

    next() {
      return this.$store.state.player.currentEpisode
        ? this.$store.state.player.currentEpisode.next
        : null;
    },

    urls() {
      const anime = this.$store.state.shikimori.anime
        ? this.$store.state.shikimori.anime.id
        : new URL(location.href).searchParams.get("anime");
      let next, previous;

      if (this.$store.getters["player/previousEpisode"]) {
        previous = new URL(chrome.runtime.getURL(`player/index.html`));
        previous.searchParams.append("anime", anime);
        previous.searchParams.append(
          "series",
          this.$store.getters["player/previousEpisode"].seriesId
        );
        previous.searchParams.append(
          "episodeInt",
          this.$store.getters["player/previousEpisode"].episodeInt
        );

        previous = previous.toString();
      }

      if (this.$store.getters["player/nextEpisode"]) {
        next = new URL(chrome.runtime.getURL(`player/index.html`));
        next.searchParams.append("anime", anime);
        next.searchParams.append(
          "series",
          this.$store.getters["player/nextEpisode"].seriesId
        );
        next.searchParams.append(
          "episodeInt",
          this.$store.getters["player/nextEpisode"].episodeInt
        );

        next = next.toString();
      } else if (this.$store.state.shikimori.nextSeason) {
        next = new URL(chrome.runtime.getURL(`player/index.html`));
        next.searchParams.append(
          "anime",
          this.$store.state.shikimori.nextSeason.id
        );
        next.searchParams.append(
          "series",
          this.$store.state.shikimori.nextSeason.series
        );
        next.searchParams.append(
          "episodeInt",
          this.$store.state.shikimori.nextSeason.episodeInt
        );

        next = next.toString();
      }

      return { next, previous };
    }
  },

  methods: {
    async nextEpisode() {
      this.$store.dispatch("shikimori/markAsWatched");
      this.$store.dispatch("player/selectNextEpisode");
    }
  }
};
</script>

<style scoped>
@media (max-width: 670px) {
  .main-menu {
    order: 3;
    flex-basis: 100%;
  }
}

@media (max-width: 768px) {
  .hide-on-xs {
    display: none;
  }
}
</style>
