<template>
  <v-app id="app" :dark="theme.dark">
    <v-progress-linear :indeterminate="true" v-if="loading" class="ma-0"></v-progress-linear>
    <v-container>
      <div class="d-grid" v-if="history.length">
        <div v-for="anime of history" :key="anime.id" xs12 sm6 md3 class="grid-item">
          <v-card
            hover
            :href="'/player/index.html?anime=' + anime.id + 'episode=' + (anime.episodes + 1)"
          >
            <v-img
              :src="'https://shikimori.one' + anime.image"
              :aspect-ratio="225/314"
              gradient="to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 68%,rgba(0,0,0,0.8) 100%"
            >
              <v-container fill-height fluid class="fill-height">
                <v-layout fill-height>
                  <v-flex xs12 align-end d-flex>
                    <span class="white--text body-1">{{anime.name}}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-img>
          </v-card>
        </div>
      </div>

      <div v-else class="text-xs-center py-5">
        <p class="headline">Здесь будет отображаться ваша история просмотров</p>
        <p class="body-2">
          Откройте любое аниме на
          <a href="https://shikimori.one/animes">Шикимори</a> и нажмите "Начать просмотр"
        </p>
      </div>

      <app-footer></app-footer>

      <v-flex class="mt-5 mt-5 text-xs-center">
        <clear-btn class>Сбросить все данные</clear-btn>
      </v-flex>
    </v-container>
  </v-app>
</template>

<script>
import {
  myanimelistAPI,
  sync,
  push as message,
  getReviewUrl
} from "../../helpers";
import appFooter from "../../player/components/app-footer.vue";
import clearBtn from "../../player/components/clear-btn.vue";
import theme from "../../mixins/theme";
export default {
  components: {
    appFooter,
    clearBtn
  },

  mixins: [theme],

  data() {
    return {
      history: [],
      loading: true
    };
  },

  computed: {},

  async mounted() {
    const { watching_history } = await sync.get({ watching_history: [] });

    this.loading = false;
    this.history = watching_history || [];

    chrome.storage.onChanged.addListener(changes => {
      if (!changes.watching_history) {
        return;
      }

      this.history = changes.watching_history.newValue || [];
    });

    this.$ga.page(`/history`); // Отправляем данные в аналитику
  }
};
</script>

<style scoped>
.d-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
}

@media (min-width: 428px) {
  .d-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 663px) {
  .d-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media (min-width: 1264px) {
  .d-grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

@media (min-width: 1904px) {
  .d-grid {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
}
</style>
