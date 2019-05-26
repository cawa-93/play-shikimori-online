export default {
  name: 'player-controls',

  template: `<div>
    <button v-if="$store.getters['player/previosEpisode']" @click="$store.dispatch('player/initPreviosEpisode')">Previos</button>
    <button v-if="$store.getters['player/nextEpisode']" @click="$store.dispatch('player/initNextEpisode')">Next</button>
  </div>`,



}