export default {
  name: 'player',

  template: `<div class="player-container mdl-card mdl-shadow--2dp" v-if="$store.getters['player/currentTranslation']"> 
    <iframe 
      :src="$store.getters['player/currentTranslation'].embedUrl" 
      height="100%"
      width="100%"
      frameborder="0"
      allowfullscreen
      ></iframe>
  </div>`
}