
<template>
  <v-list>
    <template v-if="pictureInPictureEnabled">
      <v-list-tile
        v-ga="$ga.commands.trackAction.bind(this, 'picture-in-picture')"
        @click="pictureInPictureToggle"
      >
        <v-list-tile-action>
          <v-icon>picture_in_picture</v-icon>
        </v-list-tile-action>

        <v-list-tile-title>Картинка в картинке</v-list-tile-title>
      </v-list-tile>

      <v-divider class="my-2"></v-divider>
    </template>

    <v-list-tile
      v-if="shikiID"
      :href="shikiLink.url"
      rel="noopener noreferrer"
      v-ga="$ga.commands.trackAction.bind(this, 'open-on-shikimori')"
    >
      <v-list-tile-action>
        <v-icon>open_in_new</v-icon>
      </v-list-tile-action>

      <v-list-tile-title>{{ shikiLink.label }}</v-list-tile-title>
    </v-list-tile>

    <v-list-tile
      v-if="$store.state.player.currentTranslation"
      :href="reportAboutError.url"
      rel="noopener noreferrer"
      v-ga="$ga.commands.trackAction.bind(this, 'report-about-error')"
    >
      <v-list-tile-action>
        <v-icon>report</v-icon>
      </v-list-tile-action>

      <v-list-tile-title>{{ reportAboutError.label }}</v-list-tile-title>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  name: "actions",
  data() {
    return {
      pictureInPictureEnabled: document.pictureInPictureEnabled
    };
  },
  computed: {
    shikiID() {
      if (this.$store.state.player.currentEpisode) {
        return this.$store.state.player.currentEpisode.myAnimelist;
      }

      return this.$route.params.anime;
    },
    shikiLink() {
      return {
        label: "Открыть на Шикимори",
        url: `https://shikimori.one/animes/${this.shikiID}`
      };
    },

    reportAboutError() {
      return {
        label: "Сообщить о проблеме с видео",
        url: `https://smotret-anime-365.ru/translations/report/${this.$store.state.player.currentTranslation.id}`
      };
    }
  },

  methods: {
    pictureInPictureToggle() {
      /** @type {HTMLIFrameElement} */
      const iframe = document.body.querySelector("iframe#player");
      if (iframe) {
        iframe.contentWindow.postMessage(
          { name: "pictureInPictureToggle" },
          "*"
        );
      }
    }
  }
};
</script>
