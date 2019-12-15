<template>
  <section>

    <video :src="streamUrl" autoplay controls key="main-video" preload v-if="streamUrl"/>


    <div class="stretchy-wrapper" v-else-if="loading">
      <v-skeleton-loader class="video-loader" type="image"/>
    </div>

    <p v-else>

      <span>Невозможно загрузить видео</span>
      <br>
      {{selectedTranslation}}
      <br>
      {{embed}}
    </p>


  </section>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {translationsStore} from '@/store/modules/translations';
  import {anime365Client} from '@/ApiClasses/Anime365Client';
  import {Embed} from '@/types/anime365';
  import {episodesStore} from '@/store/modules/episodes';
  import {seriesStore} from '@/store/modules/series';


  /**
   * Это временное решение для простого кэширования списка видео файлов
   * TODO: Заменить на  vuex-модуль
   */
  const cache = new Map();


  @Component
  export default class VideoPlayer extends Vue {
    public embed: Embed | null = null;
    public loading = true;



    get episodeMap() {
      return episodesStore.episodeMap(this.$route);
    }



    get selectedTranslation() {
      if (!this.$route.params.translationId) {
        return;
      }
      return translationsStore.items[Number.parseInt(this.$route.params.translationId, 10)];
    }



    get series() {
      if (!this.$route.params.seriesId) {
        return;
      }
      return seriesStore.items[Number.parseInt(this.$route.params.seriesId, 10)];
    }



    get streamUrl(): string {
      if (!this.embed || !this.embed.stream || !this.embed.stream.length) {
        return '';
      }

      let maxIndex = 0;
      let maxHeight = 0;
      this.embed.stream.forEach((item, index) => {
        if (item.height > maxHeight) {
          maxHeight = item.height;
          maxIndex = index;
        }
      });

      return this.embed.stream[maxIndex].urls[0];
    }



    @Watch('selectedTranslation.title')
    public onTitleChange(to: string) {
      if (to) {
        document.title = to.split('/')[0];
      }
    }



    @Watch('selectedTranslation.id', {immediate: true})
    public setUp(to: string) {

      if (!this.selectedTranslation) {
        return;
      }

      // @ts-ignore
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.selectedTranslation.title,
        artist: this.selectedTranslation.authorsSummary,
        album: this.series?.titles?.ru || 'Аниме',
        artwork: [

          {src: this.series?.posterUrlSmall, sizes: '200x356', type: 'image/png'},
          {src: this.series?.posterUrl, sizes: '338x600', type: 'image/png'},
        ],
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.$router.replace({
          name: 'player',
          params: {
            seriesId: this.$route.params.seriesId,
            episodeId: `${this.episodeMap.previousEpisode ? this.episodeMap.previousEpisode : ''}`
          }
        });
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.$router.replace({
          name: 'player',
          params: {
            seriesId: this.$route.params.seriesId,
            episodeId: `${this.episodeMap.nextEpisode ? this.episodeMap.nextEpisode : ''}`
          }
        });
      });
    }



    @Watch('selectedTranslation.id', {immediate: true})
    public onIdChange(to: string) {
      if (to) {

        if (cache.has(to)) {
          this.embed = cache.get(to);
          return;
        }
        this.loading = true;
        this.embed = null;

        anime365Client.request({
          method: 'get',
          url: '/translations/embed/' + to,
        })
          .then(({data: {data}}) => {
            this.embed = data;
            cache.set(to, data);
          })
          .catch(console.error)
          .finally(() => this.loading = false);
      }
    }
  }
</script>

<style>
  video {
    width: 100%;
  }

  .stretchy-wrapper {
    width: 100%;
    padding-bottom: calc(100% / (16 / 9)); /* Соотношение сторон 16:9 */
    position: relative;

  }

  .stretchy-wrapper > .video-loader {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
