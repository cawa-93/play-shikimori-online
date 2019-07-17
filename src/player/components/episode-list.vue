<template>
  <section class="episode-list">
    <div class="mdc-select">
      <v-select
        item-text="episodeFull"
        item-value="id"
        :items="episodes"
        box
        :label="label"
        v-model="selectedEpisode"
        :loading="episodes.length === 0"
        :menu-props="{auto:false}"
        no-data-text="Пока нет ни одной серии"
      >
        <template v-slot:item="{item}">
          <v-list-tile-action @click.prevent.stop="markAsWatched(item)">
            <v-checkbox @click.prevent :input-value="item.episodeInt <= watchedEpisodes"></v-checkbox>
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
      return this.$store.state.player.episodes;
    },

    selectedEpisode: {
      get() {
        return this.$store.state.player.currentEpisode
          ? this.$store.state.player.currentEpisode.id
          : null;
      },

      set(id) {
        return this.$store.dispatch(
          "player/selectEpisode",
          this.episodes.find(e => e.id === id)
        );
      }
    },

    watchedEpisodes() {
      return this.$store.state.shikimori.anime &&
        this.$store.state.shikimori.anime.user_rate
        ? this.$store.state.shikimori.anime.user_rate.episodes
        : 0;
    },

    label() {
      return this.$store.state.shikimori.anime &&
        (this.$store.state.shikimori.anime.russian ||
          this.$store.state.shikimori.anime.name)
        ? this.$store.state.shikimori.anime.russian ||
            this.$store.state.shikimori.anime.name
        : "Серия";
    }
  },

  methods: {
    markAsWatched(episode) {
      let episodes = parseInt(episode.episodeInt);

      if (episodes <= this.watchedEpisodes) {
        episodes--;
      }

      this.$store.dispatch("shikimori/saveUserRate", { episodes });
    }
  }
};
</script>

<style>
</style>