<template>
  <v-footer padless :absolute="false" :fixed="false" class="mt-12">
    <v-card flat tile width="100%" class="text-center red lighten-1" :dark="false">
      <v-card-text>
        <v-btn
          rounded
          outlined
          color
          class="mx-4"
          href="https://www.patreon.com/bePatron?u=18212353&utm_source=extension&utm_medium=footer-button&utm_campaign=play-shikimori-online&utm_content=Угостить%20автора%20печенькой"
          @click="track('https://www.patreon.com/bePatron?u=18212353')"
        >
          <v-icon size="24px" class="mr-2">mdi-patreon</v-icon>
          <span>Угостить автора печенькой</span>
        </v-btn>
        <v-tooltip top v-for="link of links" :key="link.url">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-4"
              icon
              :href="link.url"
              v-on="on"
              v-bind="attrs"
              @click="track(link.url)"
            >
              <v-icon size="24px">{{ link.icon }}</v-icon>
            </v-btn>
          </template>

          <span>{{link.label}}</span>
        </v-tooltip>

        <clear-btn></clear-btn>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text>
        <v-icon small>mdi-copyright</v-icon>
        <a
          v-for="domain of copyright"
          :key="domain"
          :href="'https://' + domain"
          class="px-2 color-inherit d-inline-block"
          @click="track('https://' + domain)"
        >{{domain}}</a>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import clearBtn from "./clear-btn.vue";
export default {
  components: { clearBtn },
  data() {
    const manifest = chrome.runtime.getManifest();
    return {
      manifest,

      links: [
        {
          icon: "mdi-account-question",
          label: "Обсудить расширение или задать вопрос автору",
          url: manifest.homepage_url
        },
        {
          icon: "mdi-gitlab",
          label: "Исходный код на GitLab",
          url: "https://gitlab.com/kozackunisoft/play-shikimori-online"
        }
      ],

      copyright: ["shikimori.one", "smotret-anime-365.ru", "myanimelist.net"]
    };
  },

  methods: {
    track(label) {
      this.$ga.event("actions", "footer-link", label);
    }
  }
};
</script>