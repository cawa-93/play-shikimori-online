<template>
  <div role="feed">
    <anime-slider :ids="[38691,39468,20899,37105,37924,35015,30240,3702,14719,34612,33255,37141,28891,31240,28977,11061,37521,32935,34933,39198,38000,36882,38524]"
                  title="История просмотров"></anime-slider>
    <anime-slider :ids="ids" title="Популярно в текущем сезоне" v-if="ids.length"></anime-slider>
  </div>
</template>

<script lang="ts">


  import {Component, Vue} from 'vue-property-decorator';
  import AnimeSlider from '@/components/AnimeSlider.vue';
  import {shikimori} from '@/plugins/shikimori.axios';


  const WEEK = 604800000;
  const now = new Date(Date.now() - WEEK); // Вычисляем текущий сезон с отставанием на неделю
  const year = now.getFullYear();
  const m = now.getMonth();
  const season = m <= 1 ? 'winter' : m <= 4 ? 'spring' : m <= 7 ? 'summer' : m <= 10 ? 'fall' : 'winter';

  const animesPromise = shikimori.get('/animes', {
    params: {
      limit: 20,
      order: 'popularity',
      season: `${season}_${year}`
    }
  });


  @Component({
    components: {
      AnimeSlider
    }
  })
  export default class History extends Vue {

    ids: number[] = [];
    season = season;



    async created() {
      const {data} = await animesPromise;
      this.ids = data.map((a: any) => a.id);
    }

  }
</script>
