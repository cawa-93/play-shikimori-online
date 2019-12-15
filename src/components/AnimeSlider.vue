<template>
  <section class="d-grid mt-3">
    <h2>{{title}}</h2>
    {{ids}}
    <!--    <anime :key="group.title+malId" :malId="malId" v-for="malId in ids" v-if="malMap[malId]"/>-->
    <!--    <v-skeleton-loader height="314" type="image" v-else width="225"/>-->
  </section>
</template>

<script lang="ts">
  import Anime from '@/components/Anime.vue';

  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {seriesStore} from '@/store/modules/series';




  @Component({
    components: {Anime},
  })
  export default class extends Vue {
    @Prop(String) public readonly title!: string;
    @Prop() public readonly searchParams!: any;

    ids: number[] = [];



    public async created() {
      const idsSet = new Set<number>();

      if (this.searchParams.id) {
        this.searchParams.id.forEach((id: number) => idsSet.add(id));
      }

      if (this.searchParams.myAnimeListId) {
        this.searchParams.myAnimeListId.forEach((id: number) => idsSet.add(seriesStore.malMap[id]));
      }
      this.ids = [...idsSet].filter(id => !!id);


      try {
        const series = await seriesStore.search(this.searchParams);

        if (series) {
          series.forEach(({id}) => idsSet.add(id));
          this.ids = [...idsSet].filter(id => !!id);
        }
      } finally {
        // this.loading = false;
      }
    }
  }
</script>


<style scoped>

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
