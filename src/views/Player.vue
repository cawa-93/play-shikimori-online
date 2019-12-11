<template>
  <div class="player-view py-3 px-12">
    <video-player/>
    <episodes-list/>
    <translations-list/>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {seriesStore} from '@/store/modules/series';
  import {episodesStore} from '@/store/modules/episodes';
  import {translationsStore} from '@/store/modules/translations';
  import EpisodesList from '@/components/EpisodesList.vue';
  import TranslationsList from '@/components/TranslationsList.vue';
  import VideoPlayer from '@/components/VideoPlayer.vue';


  @Component({
    components: {VideoPlayer, TranslationsList, EpisodesList}
  })
  export default class Player extends Vue {

    @Watch('$route.params', {immediate: true})
    async onParamsChanged(to: { seriesId: string | number, episodeId?: string | number, translationId?: string | number }, from?: { seriesId?: string | number, episodeId?: string | number, translationId?: string | number }) {

      to.seriesId = Number.parseInt(to.seriesId as string);
      to.episodeId = to.episodeId ? Number.parseInt(to.episodeId as string) : 0;
      to.translationId = to.translationId ? Number.parseInt(to.translationId as string) : 0;

      if (!from) {
        from = {};
      }
      from.seriesId = Number.parseInt(from.seriesId as string);
      from.episodeId = from.episodeId ? Number.parseInt(from.episodeId as string) : 0;
      from.translationId = from.translationId ? Number.parseInt(from.translationId as string) : 0;

      if (to.seriesId) {
        if (!from.seriesId || to.seriesId !== from.seriesId) {
          seriesStore.load(to.seriesId);
          episodesStore.loadEpisodesForSeries(to.seriesId);
        }
      }

      if (to.episodeId) {
        if (!from.episodeId || to.episodeId !== from.episodeId) {
          translationsStore.loadTranslations(to.episodeId);
        }
      } else if (to.seriesId) {
        await episodesStore.loadEpisodesForSeries(to.seriesId);
        let episodes = episodesStore.getForSeries(to.seriesId);

        if (episodes.length) {
          const selectedEpisode = getEpisode(episodes);

          if (selectedEpisode) {
            to.episodeId = selectedEpisode.id;
          }
        }
      }

      if (to.translationId) {
        if (!from.translationId || to.translationId !== from.translationId) {
          //...
        }

      } else if (to.episodeId) {
        await translationsStore.loadTranslations(to.episodeId);
        let translations = translationsStore.getForEpisode(to.episodeId);

        if (translations.length) {
          const selectedTranslation = translations[0];

          if (selectedTranslation) {
            to.translationId = selectedTranslation.id;
          }
        }
      }


      try {
        await this.$router.replace({
          name: 'player',
          params: to as any
        });
      } catch (e) {
        if (e.name !== 'NavigationDuplicated') {
          console.error(e);
        }
      }
    }




    // @Watch('$route.params.seriesId', {immediate: true})
    // onSeriesIdChange(id: string) {
    //   if (id) {
    //     episodesStore.loadEpisodesForSeries(Number.parseInt(id, 10));
    //     seriesStore.load(Number.parseInt(id, 10));
    //   }
    // }


    //
    // @Watch('$route.params.seriesId', {immediate: true})
    // @Watch('$route.params.episodeId', {immediate: true})
    // async onEpisodeIdChange() {
    //   if (this.$route.params.episodeId) {
    //     await transactionsStore.loadTranslations(Number.parseInt(this.$route.params.episodeId, 10));
    //   } else if (this.$route.params.seriesId) {
    //     let episodes = episodesStore.items.filter(e => e.seriesId === Number.parseInt(this.$route.params.seriesId, 10));
    //
    //     if (!episodes.length) {
    //       await episodesStore.loadEpisodesForSeries(Number.parseInt(this.$route.params.seriesId, 10));
    //     }
    //
    //     episodes = episodesStore.items.filter(e => e.seriesId === Number.parseInt(this.$route.params.seriesId, 10));
    //
    //
    //
    //     if (episodes.length) {
    //       const ep = getEpisode(episodes);
    //
    //       if (ep) {
    //         transactionsStore.loadTranslations(ep.id);
    //         await this.$router.replace({
    //           name: 'player',
    //           params: {
    //             seriesId: this.$route.params.seriesId,
    //             episodeId: String(ep.id)
    //           }
    //         });
    //       }
    //     }
    //   }
    // }


    //
    //   @Watch('$route.params.episodeId', {immediate: true})
    //   @Watch('$route.params.translationId', {immediate: true})
    //   async onTranslationIdChange() {
    //     if (this.$route.params.translationId) {
    //       // await transactionsStore.loadTranslations(Number.parseInt(id, 10));
    //     } else if (this.$route.params.episodeId) {
    //       let translations = transactionsStore.items.filter(e => e.episodeId === Number.parseInt(this.$route.params.episodeId, 10));
    //
    //       if (!translations.length) {
    //         await transactionsStore.loadTranslations(Number.parseInt(this.$route.params.episodeId, 10));
    //       }
    //
    //       translations = transactionsStore.items.filter(e => e.episodeId === Number.parseInt(this.$route.params.episodeId, 10));
    //
    //
    //
    //       if (translations.length) {
    //         const t = translations[0];
    //
    //         if (t) {
    //           // transactionsStore.loadTranslations(ep.id);
    //           await this.$router.replace({
    //             name: 'player',
    //             params: {
    //               seriesId: this.$route.params.seriesId,
    //               episodeId: this.$route.params.episodeId,
    //               translationId: String(t.id)
    //             }
    //           });
    //         }
    //       }
    //     }
    //   }
  }


  function getEpisode(episodes: (typeof episodesStore.items[number])[]) {
    return episodes.find(e => e.episodeInt === '1');
  }
</script>


<style>
  .player-view {

  }
</style>
