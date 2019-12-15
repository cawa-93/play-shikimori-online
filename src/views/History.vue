<template>
  <v-container class="grid-container" fluid role="feed">
    <section class="d-grid">

      <template v-if="groups.length">

        <template v-for="group in groups">
          <h2 class="mt-3">{{group.title}}</h2>
          <anime :key="group.title+malId" :malId="malId" v-for="malId in group.ids" v-if="malMap[malId]"/>
          <v-skeleton-loader height="314"
                             type="image"
                             v-else
                             width="225"/>
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


  const WEEK = 604800000;
  const now = new Date(Date.now() - (WEEK * 3)); // Вычисляем текущий сезон с отставанием на месяц
  const year = now.getFullYear();
  const m = now.getMonth();
  const season = m <= 1 ? 'winter' : m <= 4 ? 'spring' : m <= 7 ? 'summer' : m <= 10 ? 'fall' : 'winter';



  @Component({
    components: {
      Anime,
      AnimeSlider,
    },
  })
  export default class History extends Vue {

    public groups: Array<{ title: string, ids: number[] }> = [];



    get malMap() {
      return seriesStore.malMap;
    }



    public loadSeries(ids: number[]) {
      return seriesStore.search({myAnimeListId: ids});
    }



    public async created() {

      document.title = 'Медиа центр';

      let userId;
      if (process.env.NODE_ENV === 'development') {
        userId = 143570;
      }

      if (userId) {

        let {data: rates} = await shikimori.get('/v2/user_rates', {
          params: {
            user_id: userId,
            target_type: 'Anime',
            status: 'watching,planned,rewatching',
          },
        });

        if (Array.isArray(rates) && rates.length) {
          rates = rates.sort((rate1, rate2) => {
            return new Date(rate2.updated_at).getTime() - new Date(rate1.updated_at).getTime();
          });

          const watching = [];
          const planned = [];

          for (const rate of rates) {
            if (watching.length <= 11 && rate.status === 'watching' || rate.status === 'rewatching') {
              watching.push(rate.target_id);
            } else if (planned.length <= 11 && rate.status === 'planned') {
              planned.push(rate.target_id);
            }

            if (watching.length > 11 && planned.length > 11) {
              break;
            }
          }

          this.loadSeries([...watching, ...planned]);

          this.groups.push({
            title: 'Недавно смотрели',
            ids: watching,
          });

          this.groups.push({
            title: 'Запланировано',
            ids: planned,
          });
        }

      }


      const {data} = await shikimori.get('/animes', {
        params: {
          limit: 12,
          order: 'popularity',
          season: `${season}_${year}`,
        },
      });

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
        default :
          rusSeasonName = 'текущем';
      }

      this.groups.push({
        title: `Популярно в ${rusSeasonName} сезоне ${year}`,
        ids,
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
