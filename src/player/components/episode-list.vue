<template>
  <section class="episode-list">
    <div class="mdc-select">
      <v-select
        item-text="episodeFull"
        item-value="id"
        :items="filteredEpisodes"
        box
        label="Епизод"
        v-model="currentEpisodeID"
        :loading="episodes.length === 0"
        :menu-props="{auto:false}"
      >
        <template v-slot:item="{item, parent, tile}">
          <v-list-tile-action @click.stop>
            <v-checkbox
              :input-value="item.episodeInt <= watchedEpisodes"
              @click.prevent="markAsWatched(item)"
            ></v-checkbox>
          </v-list-tile-action>

          <v-list-tile-content class="inset">
            <v-list-tile-title>{{item.episodeFull}}</v-list-tile-title>
          </v-list-tile-content>
        </template>
      </v-select>
    </div>
  </section>
</template>

<script>
export default {
  name: "episode-list",

  computed: {
    episodes() {
      return this.$store.getters["player/episodes"];
    },

    filteredEpisodes() {
      return this.episodes.filter(e => e.isActive).reverse();
    },

    currentEpisodeID: {
      get() {
        return this.$store.state.player.currentEpisodeID;
      },

      set(id) {
        return this.$store.dispatch("player/setCurrentEpisode", id);
      }
    },

    watchedEpisodes() {
      return this.$store.state.shikimori.anime &&
        this.$store.state.shikimori.anime.user_rate
        ? this.$store.state.shikimori.anime.user_rate.episodes
        : 0;
    }
  },

  methods: {
    markAsWatched(episode) {
      this.$store.dispatch("shikimori/saveUserRate", {
        episodes: parseInt(episode.episodeInt)
      });
    }
  }
};
</script>

<style>
</style>