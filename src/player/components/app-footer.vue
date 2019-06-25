<template>
  <footer class="mt-5 text-xs-center">
    <p>
      Разработчик:
      <a :href="manifest.developer.url">{{manifest.developer.name}}</a>
    </p>

    <p>
      <a :href="manifest.homepage_url">Клуб на Шикимори</a>
      •
      <a href="https://github.com/cawa-93/play-shikimori-online">Исходынй код на GitHub</a>
    </p>

    <p>
      Работает на базе:
      <a rel="noopener noreferrer" href="https://shikimori.one">shikimori.one</a>,
      <a rel="noopener noreferrer" href="https://smotret-anime-365.ru">smotret-anime-365.ru</a>,
      <a rel="noopener noreferrer" href="https://myanimelist.net">myanimelist.net</a>
    </p>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      manifest: chrome.runtime.getManifest()
    };
  }
};
</script>
