<template>
  <v-layout>
    <v-flex class="trunc">
      <v-btn
        text
        :disabled="!previous"
        @click.prevent="$store.dispatch('player/selectPreviousEpisode')"
        :href="urls.previous"
        target="_self"
        v-ga="$ga.commands.trackVideoControls.bind(this, 'previous-episode', 'out-frame')"
        class="flex-parent"
      >
        <v-icon left>mdi-skip-previous</v-icon>
        <span class="long-and-truncated">Предыдущая {{ $vuetify.breakpoint.xsOnly ? '' : 'серия'}}</span>
      </v-btn>
    </v-flex>

    <v-flex class="text-center main-menu trunc">
      <slot></slot>
    </v-flex>

    <v-flex class="text-right trunc">
      <v-btn
        text
        v-if="next || !$store.state.shikimori.nextSeason"
        :disabled="!next"
        @click.prevent="nextEpisode"
        :href="urls.next"
        target="_self"
        v-ga="$ga.commands.trackVideoControls.bind(this, 'next-episode', 'out-frame')"
        class="flex-parent"
      >
        <span class="long-and-truncated">Следующая {{ $vuetify.breakpoint.xsOnly ? '' : 'серия'}}</span>
        <v-icon right>mdi-skip-next</v-icon>
      </v-btn>

      <v-btn
        text
        v-else-if="$store.state.shikimori.nextSeason"
        @click.prevent="nextSeason"
        v-ga="$ga.commands.trackVideoControls.bind(this, 'next-season', 'out-frame')"
      >
        {{$store.state.shikimori.nextSeason.name}}
        <v-icon right>mdi-skip-next</v-icon>
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
      }

      // else if (this.$store.state.shikimori.nextSeason) {
      //   next = new URL(chrome.runtime.getURL(`UI/index.html`));
      //   next.hash = `/player/anime/${this.$store.state.shikimori.nextSeason.id}`;

      //   if (this.$store.state.shikimori.nextSeason.episodeInt !== undefined) {
      //     next.hash += `/${this.$store.state.shikimori.nextSeason.episodeInt}`;
      //   }

      //   next = next.toString();
      // }

      return { next, previous };
    }
  },

  methods: {
    async nextEpisode() {
      this.$store.dispatch("shikimori/markAsWatched");
      this.$store.dispatch("player/selectNextEpisode");
    },

    async nextSeason() {
      this.$store.dispatch("shikimori/markAsWatched");

      this.$store.commit("player/clear");

      this.$store.dispatch("player/loadEpisodes", {
        anime: parseInt(this.$store.state.shikimori.nextSeason.id),
        episode: parseFloat(this.$store.state.shikimori.nextSeason.episodeInt)
      }); // Загрузка списка серий и запуск видео

      this.$store.dispatch(
        "shikimori/loadAnime",
        this.$store.state.shikimori.nextSeason.id
      ); // Загрузка информации про аниме и оценку от пользователя если тот авторизован
    }
  }
};
</script>

<style>
.flex.trunc,
.flex.trunc .v-btn__content {
  min-width: 0 !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
}

.long-and-truncated {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* @media (max-width: 670px) {
  .main-menu {
    order: 3;
    flex-basis: 100%;
  }
}

@media (max-width: 768px) {
  .hide-on-xs {
    display: none;
  }
} */
</style>
