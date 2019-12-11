<template>
  <section v-if="selectedTranslation">
    <video autoplay
           controls
           src="https://c1596293.anime-feel.ru/route/?m=7773439&r=80aaa3e872d0114cb6f6980589dfe509528bb04ef363e36eeda1bf664f9d6ba5c688b22a7b827f4ed7ea6a8b5ae357cfca19996467ae705b4c11f2f6508a3b40c90027a23edc6c2008213a5e988720e85d8696090d2fa383da72f3d20efded26b032ef52528186e14c213004b9487aaac942c36c50c6e451f42e781999c9d333a054888be9ff39cf0064f36f342e828c197286425b93e381424800659eb1b3e5a68f71679537ba52568d44ea48ef92af82cfab31de2324a7c8889f074e64490f2c6032ba63c40da07e32f1704a5decfa298880237fb85139e620bb5f13705356f6e7a1350a920b20c34ac3b57c1fc964e0177e7b903b552b0b35073eafc4ac2d98341f3425b6da8db704f047cc4cf744f28f9ea405d6af4ea77a1a826282619490a0dd0e0b5f2bd1db95be52caf4506e4738aa14c80b050351ac5a7e74bf6577351ccccf7354098d54331f060f075cd0"></video>
    <!--    <iframe :src="selectedTranslation.embedUrl"></iframe>-->
    {{selectedTranslation}}
  </section>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {translationsStore} from '@/store/modules/translations';


  @Component
  export default class VideoPlayer extends Vue {
    get selectedTranslation() {
      if (!this.$route.params.translationId) {
        return;
      }
      return translationsStore.items[Number.parseInt(this.$route.params.translationId)];
    }
  }
</script>

<style scoped>
  video {
    width: 100%;
  }
</style>
