<template>
  <section>
    <video :src="streamUrl" autoplay controls v-if="streamUrl"/>

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


  @Component
  export default class VideoPlayer extends Vue {
    embed: Embed | null = null;
    loading = true;



    get selectedTranslation() {
      if (!this.$route.params.translationId) {
        return;
      }
      return translationsStore.items[Number.parseInt(this.$route.params.translationId)];
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
    onTitleChange(to: string) {
      if (to) {
        document.title = to.split('/')[0];
      }
    }



    @Watch('selectedTranslation.id', {immediate: true})
    onIdChange(to: string) {
      if (to) {
        this.loading = true;
        this.embed = null;

        anime365Client.request({
          method: 'get',
          url: '/translations/embed/' + to
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
    padding-bottom: 56.25%;
    position: relative;

  }

  .stretchy-wrapper > .video-loader {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .video-loader .v-skeleton-loader__image {
    height: 100%;
  }
</style>
