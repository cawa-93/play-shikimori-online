<template>
  <section class="episode-list">
    <div class="mdc-select">
      <v-select
        item-text="episodeFull"
        item-value="id"
        :items="filteredEpisodes"
        box
        label="Серия"
        v-model="currentEpisodeID"
        :loading="episodes.length === 0"
        :menu-props="{auto:false}"
        no-data-text="Пока нет ни одной серии"
      >
        <template v-slot:item="{item}">
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

        <template v-slot:selection="{item}">
          <v-list-tile-content class="inset">
            <v-list-tile-title>
              {{item.episodeFull}}
              <span v-if="item.episodeInt <= watchedEpisodes">— просмотрено</span>
            </v-list-tile-title>
          </v-list-tile-content>
        </template>

        <template v-slot:append-item>
          <v-divider class="mb-2"></v-divider>

          <v-list-tile href="https://smotret-anime-365.ru/translations/create">
            <v-list-tile-action>
              <v-icon>add</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>Добавить серию</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>open_in_new</v-icon>
            </v-list-tile-action>
          </v-list-tile>
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
      return this.episodes.filter(e => e.isActive);
    },

    currentEpisodeID: {
      get() {
        return this.$store.state.player.currentEpisodeID;
      },

      set(id) {
        return this.$store.dispatch("player/selectEpisode", id);
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