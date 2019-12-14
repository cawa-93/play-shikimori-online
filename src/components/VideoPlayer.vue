<template>
  <section>
    {{episodeMap}}
    <video :src="streamUrl" controls v-if="streamUrl"/>


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
  import {MediaMetadata} from '@/types/shims-tsx.d.ts';


  @Component
  export default class VideoPlayer extends Vue {
    public embed: Embed | null = null;
    public loading = true;



    get episodeMap() {
      const map
        : {
        startEpisode: number,
        selectedEpisode: number,
        previousEpisode: number,
        nextEpisode: number,
      }
        = {
        startEpisode: 0,
        selectedEpisode: 0,
        previousEpisode: 0,
        nextEpisode: 0,
      };

      if (this.$route.params && this.$route.params.seriesId) {

        const episodes = episodesStore.getForSeries(Number.parseInt(this.$route.params.seriesId, 10));

        if (!episodes.length) {
          return map;
        }

        let minimalEpisodeInt = Number.parseFloat(episodes[0].episodeInt);
        episodes.forEach((episode) => {
          const episodeInt = Number.parseFloat(episode.episodeInt);


          // Стартовая серия
          if (episodeInt <= minimalEpisodeInt) {
            minimalEpisodeInt = episodeInt;
            map.startEpisode = episode.id;
          }

          // Текущая серия
          if (this.$route.params && this.$route.params.episodeId) {
            const episodeId = Number.parseInt(this.$route.params.episodeId, 10);
            if (episodeId === episode.id) {
              map.selectedEpisode = episode.id;
            }
          }
        });


        if (map.selectedEpisode) {
          // const selectedEpisodeInt = Number.parseFloat(this.items[map.selectedEpisode].episodeInt)
          const selectedEpisode = episodesStore.items[map.selectedEpisode];
          let previousEpisode: any;
          let nextEpisode: any;

          episodes.forEach((episode) => {

            // Следующая серия
            if (
              Number.parseFloat(episode.episodeInt) > Number.parseFloat(selectedEpisode.episodeInt)
              && (
                !nextEpisode
                || Number.parseFloat(episode.episodeInt) < Number.parseFloat(nextEpisode.episodeInt)
              )
            ) {
              nextEpisode = episode;
            }

            // Предыдущая серия
            if (
              Number.parseFloat(episode.episodeInt) < Number.parseFloat(selectedEpisode.episodeInt)
              && (
                !previousEpisode
                || Number.parseFloat(episode.episodeInt) > Number.parseFloat(previousEpisode.episodeInt)
              )
            ) {
              previousEpisode = episode;
            }
          });

          if (nextEpisode) {
            map.nextEpisode = nextEpisode.id;
          }

          if (previousEpisode) {
            map.previousEpisode = previousEpisode.id;
          }
        }
      }

      return map;

    }



    get selectedTranslation() {
      if (!this.$route.params.translationId) {
        return;
      }
      return translationsStore.items[Number.parseInt(this.$route.params.translationId, 10)];
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

      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.selectedTranslation.title,
        artist: this.selectedTranslation.authorsSummary,
        album: 'Whenever You Need Somebody',
        artwork: [
          {src: 'https://dummyimage.com/96x96', sizes: '96x96', type: 'image/png'},
          {src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png'},
          {src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png'},
          {src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png'},
          {src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png'},
          {src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png'},
        ],
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        // console.log('previoustrack — click');
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        // console.log('nexttrack — click');
      });
    }



    @Watch('selectedTranslation.id', {immediate: true})
    public onIdChange(to: string) {
      if (to) {
        this.loading = true;
        this.embed = null;

        anime365Client.request({
          method: 'get',
          url: '/translations/embed/' + to,
        })
          .then(({data: {data}}) => this.embed = data)
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
