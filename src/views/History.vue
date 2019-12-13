<template>
  <div role="feed">
    <anime-slider :ids="[39468,20899,37105,37924,35015,30240,3702,14719,34612,38000]" title="История просмотров"/>
    <anime-slider :ids="ids" title="Популярно в текущем сезоне" v-if="ids.length"/>
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
      season: `${season}_${year}`,
    },
  });


  @Component({
    components: {
      AnimeSlider,
    },
  })
  export default class History extends Vue {

    public ids: number[] = [];
    public season = season;



    public async created() {
      const {data} = await animesPromise;
      this.ids = data.map((a: any) => a.id);
      document.title = 'Медиа центр';
    }



  }
</script>
