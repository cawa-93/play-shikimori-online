<template>
  <section v-if="series.length || this.loading">
    <h2>{{title}}</h2>

    <div class="content">
      <div class="box">
        <anime :key="index" :series="series[index] || null" v-for="index of series.length -1 || ids.length -1"></anime>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import Anime from '@/components/Anime.vue';

  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {seriesStore} from '@/store/modules/series';
  import {anime365Client} from '@/ApiClasses/Anime365Client';




  @Component({
    components: {Anime},
  })
  export default class extends Vue {
    @Prop(String) public readonly title!: string;
    @Prop(Array) public readonly ids!: number[];

    public loading = true;



    get series() {
      const series: Array<typeof seriesStore.items[number]> = [];

      this.ids.forEach((id) => {
        if (seriesStore.malMap[id] && seriesStore.items[seriesStore.malMap[id]]) {
          series.push(seriesStore.items[seriesStore.malMap[id]]);
        }
      });

      return series;
    }



    public async created() {
      try {

        const ids = this.ids.filter((id) => !seriesStore.malMap[id]);

        const series = await anime365Client.getSeriesCollection({
          myAnimeListId: ids,
        });

        series.forEach((s) => seriesStore.set(s));
      } finally {
        this.loading = false;
      }
    }
  }
</script>


<style scoped>
  h2 {
    margin-left: 10px;
  }

  .anime-item.anime-poster {
    margin: 10px
  }

  .content {
    flex: 1;
    display: flex;
    overflow: auto;
    padding-bottom: 20px;
  }

  .box {
    min-width: min-content; /* needs vendor prefixes */
    display: flex;
  }
</style>
