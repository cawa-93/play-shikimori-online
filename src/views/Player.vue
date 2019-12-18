<template>
  <v-container class="component-root view-component-root player-view-component py-3 px-12">
    <video-player/>
    <episodes-list/>
    <translations-list/>
  </v-container>
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
    components: {VideoPlayer, TranslationsList, EpisodesList},
  })
  export default class Player extends Vue {

    @Watch('$route.params', {immediate: true})
    public async onParamsChanged(
      to: { seriesId: string | number, episodeId?: string | number, translationId?: string | number },
      from?: { seriesId?: string | number, episodeId?: string | number, translationId?: string | number },
    ) {

      to.seriesId = Number.parseInt(to.seriesId as string, 10);
      to.episodeId = to.episodeId ? Number.parseInt(to.episodeId as string, 10) : 0;
      to.translationId = to.translationId ? Number.parseInt(to.translationId as string, 10) : 0;

      if (!from) {
        from = {};
      }
      from.seriesId = Number.parseInt(from.seriesId as string, 10);
      from.episodeId = from.episodeId ? Number.parseInt(from.episodeId as string, 10) : 0;
      from.translationId = from.translationId ? Number.parseInt(from.translationId as string, 10) : 0;

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
        const episodes = episodesStore.getForSeries(to.seriesId);

        if (episodes.length) {
          const selectedEpisode = getEpisode(episodes);

          if (selectedEpisode) {
            to.episodeId = selectedEpisode.id;
          }
        }
      }

      if (to.translationId) {
        if (!from.translationId || to.translationId !== from.translationId) {
          // ...
        }

      } else if (to.episodeId) {
        await translationsStore.loadTranslations(to.episodeId);
        const translations = translationsStore.getForEpisode(to.episodeId);

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
          params: to as any,
        });
      } catch (e) {
        if (e.name !== 'NavigationDuplicated') {
          console.error(e);
        }
      }
    }

  }


  function getEpisode(episodes: Array<typeof episodesStore.items[number]>) {
    return episodes.find((e) => e.episodeInt === '1');
  }
</script>
