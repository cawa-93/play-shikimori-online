export default {
  name: 'player',

  template: `<div v-if="$store.getters['player/currentTranslation']"> 
    <iframe 
      :src="$store.getters['player/currentTranslation'].embedUrl" 
      :height="$store.getters['player/currentTranslation'].height"
      width="100%"
      frameborder="0"
      allowfullscreen
      ></iframe>
  </div>`
}