<template>
  <v-footer padless :absolute="false" :fixed="false" class="mt-12">
    <v-card flat tile class="w-100 text-center red lighten-1" :dark="false">
      <v-card-text>
        <v-btn rounded outlined color>
          <span>Поддержать</span>
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

      <v-card-text class="white--text">
        <v-icon small>copyright</v-icon>
        <a
          v-for="domain of copyright"
          :key="domain"
          :href="'https://' + domain"
          class="white--text px-2"
        >{{domain}}</a>
      </v-card-text>
    </v-card>
  </v-footer>
  <!-- <footer class="mt-12 text-center" id="app-footer">
    <a
      href="https://www.patreon.com/bePatron?u=18212353&utm_source=extension&utm_medium=footer-button&utm_campaign=play-shikimori-online&utm_content=Купить%201%20кофе"
      @click="track('https://www.patreon.com/bePatron?u=18212353')"
      id="become-a-patron"
    >
      <img src="/icons/Patreon_Mark_NoBackground.png" alt="Patreon logo" width="16px" height="16px" />
      <span style="margin-left:8px">Купить 1 кофе</span>
    </a>

    <p>
      Разработчик:
      <a
        href="https://t.me/kozack"
        @click="track('https://t.me/kozack')"
      >{{manifest.author}}</a>
    </p>

    <p>
      <a :href="manifest.homepage_url" @click="track(manifest.homepage_url)">Клуб на Шикимори</a>
      •
      <a
        href="https://gitlab.com/kozackunisoft/play-shikimori-online"
        @click="track('https://gitlab.com/kozackunisoft/play-shikimori-online')"
      >Исходный код на GitLab</a>
    </p>

    <p>
      Работает на базе:
      <a
        rel="noopener noreferrer"
        href="https://shikimori.one"
        @click="track('https://shikimori.one')"
      >shikimori.one</a>,
      <a
        rel="noopener noreferrer"
        href="https://smotret-anime-365.ru"
        @click="track('https://smotret-anime-365.ru')"
      >smotret-anime-365.ru</a>,
      <a
        rel="noopener noreferrer"
        href="https://myanimelist.net"
        @click="track('https://myanimelist.net')"
      >myanimelist.net</a>
    </p>

    <v-flex class="mt-12 text-center">
      <clear-btn></clear-btn>
    </v-flex>
  </footer>-->
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
          icon: "home",
          label: "Открыть клуб на Шикимори",
          url: manifest.homepage_url
        },
        {
          icon: "code",
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


<style>
#become-a-patron {
  /* -webkit-box-align: center; */
  align-items: center;
  backface-visibility: hidden;
  background-color: rgb(232, 91, 70);
  /* box-sizing: border-box; */
  cursor: pointer;
  display: inline-flex;
  font-weight: 500;
  height: 36px;
  /* -webkit-box-pack: center; */
  justify-content: center;
  position: relative;
  /* pointer-events: unset; */
  /* text-align: center; */
  /* text-transform: none; */
  user-select: none;
  /* white-space: unset; */
  width: 176px;
  color: rgb(255, 255, 255) !important;
  font-size: 14px !important;
  border-radius: 9999px;
  /* border-width: initial; */
  /* border-style: none; */
  /* border-color: initial; */
  /* border-image: initial; */
  padding: 9.5px 16px;
  text-decoration: none;
  transition: all 300ms cubic-bezier(0.19, 1, 0.22, 1) 0s;
  line-height: 1.4;

  margin-bottom: 2rem;
}

#become-a-patron:hover,
#become-a-patron:focus {
  background-color: rgb(231, 81, 59);
}

#app-footer {
  font-size: 0.9rem;
}
</style>
