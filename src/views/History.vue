<template>
  <v-container class="grid-container" fluid role="feed">
    <section class="d-grid">

      <template v-if="groups.length">

        <template v-for="group in groups">
          <h2 class="mt-3">{{group.title}}</h2>
          <anime :key="group.title+malId" :malId="malId" v-for="malId in group.ids"/>
        </template>
      </template>
      <template v-else>
        <h2 class="mt-3">
          <v-skeleton-loader height="1.5em" type="heading" width="100%"/>
        </h2>
        <v-skeleton-loader :key="index"
                           height="314"
                           type="image"
                           v-for="index in 12" width="225"/>

      </template>
    </section>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import AnimeSlider from '@/components/AnimeSlider.vue';
  import {shikimori} from '@/plugins/shikimori.axios';
  import Anime from '@/components/Anime.vue';
  import {seriesStore} from '@/store/modules/series';
  import {anime365Client} from '@/ApiClasses/Anime365Client';


  const WEEK = 604800000;
  const now = new Date(Date.now() - (WEEK * 3)); // Вычисляем текущий сезон с отставанием на месяц
  const year = now.getFullYear();
  const m = now.getMonth();
  const season = m <= 1 ? 'winter' : m <= 4 ? 'spring' : m <= 7 ? 'summer' : m <= 10 ? 'fall' : 'winter';

  const animesPromise = shikimori.get('/animes', {
    params: {
      limit: 12,
      order: 'popularity',
      season: `${season}_${year}`,
    },
  });


  @Component({
    components: {
      Anime,
      AnimeSlider,
    },
  })
  export default class History extends Vue {

    public groups: ({ title: string, ids: number[] })[] = [];
    public season = season;



    public async loadSeries(ids: number[]) {
      const needLoad = ids.filter((id: number) => !seriesStore.malMap[id]);

      if (!needLoad.length) {
        return;
      }

      const series = await anime365Client.getSeriesCollection({
        myAnimeListId: needLoad,
      });

      series.forEach((s) => seriesStore.set(s));
    }



    public async created() {

      document.title = 'Медиа центр';




      shikimori.get('/v2/user_rates', {
        params: {
          user_id: 143570,
          target_type: 'Anime',
          status: 'watching'
        }
      })
        // .then(({data}: {data: any[]}) => data.map(i => i.id))
        .then(async ({data}: { data: any[] }) => {
          const ids =
            data
              .sort((rate1, rate2) => {
                return new Date(rate2.updated_at).getTime() - new Date(rate1.updated_at).getTime();
              })
              .splice(0, 12)
              .map(rate => rate.target_id);

          await this.loadSeries(ids);
          return ids;
        })
        .then((ids) => {
          this.groups.push({
            title: `Смотрите сейчас`,
            ids
          });
        });

      const {data} = await animesPromise;
      const ids = data.map((item: any) => item.id);

      await this.loadSeries(ids);

      let rusSeasonName;
      switch (season) {
        case 'fall':
          rusSeasonName = 'осеннем';
          break;
        case 'winter':
          rusSeasonName = 'зимнем';
          break;
        case 'spring':
          rusSeasonName = 'весеннем';
          break;
        case 'summer':
          rusSeasonName = 'летнем';
          break;
      }

      this.groups.push({
        title: `Популярно в ${rusSeasonName} сезоне ${year}`,
        ids
      });
    }



  }
</script>

<style scoped>
  .grid-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .d-grid {
    --columns-count: 6;
    display: grid;
    grid-template-columns: [container-start] repeat(var(--columns-count), minmax(225px, 1fr)) [container-end];
    grid-gap: 20px;
    justify-items: center;
    align-items: center;
  }

  @media (max-width: 1474px) {
    .d-grid {
      --columns-count: 4;
    }
  }


  @media (max-width: 984px) {
    .d-grid {
      --columns-count: 3;
    }
  }


  @media (max-width: 734px) {
    .d-grid {
      --columns-count: 2;
    }
  }


  @media (max-width: 494px) {
    .d-grid {
      --columns-count: 1;
    }
  }

  .d-grid h2 {
    width: 100%;
    grid-column: container;
    justify-self: start;
  }
</style>
