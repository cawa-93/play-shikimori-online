<template>
  <v-layout row wrap>
    <v-flex>
      <v-btn
        text
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

    <v-flex class="text-center main-menu">
      <slot></slot>
    </v-flex>

    <v-flex class="text-right">
      <v-btn
        text
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
        text
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
      let next, previous;

      if (this.previous) {
        previous = new URL(chrome.runtime.getURL(`UI/index.html`));
        previous.hash = `/player/anime/${this.previous.myAnimelist}/${this.previous.episodeInt}`;

        previous = previous.toString();
      }

      if (this.next) {
        next = new URL(chrome.runtime.getURL(`UI/index.html`));
        next.hash = `/player/anime/${this.next.myAnimelist}/${this.next.episodeInt}`;

        next = next.toString();
      } else if (this.$store.state.shikimori.nextSeason) {
        next = new URL(chrome.runtime.getURL(`UI/index.html`));
        next.hash = `/player/anime/${this.$store.state.shikimori.nextSeason.id}`;

        if (this.$store.state.shikimori.nextSeason.episodeInt !== undefined) {
          next.hash += `/${this.$store.state.shikimori.nextSeason.episodeInt}`;
        }

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
