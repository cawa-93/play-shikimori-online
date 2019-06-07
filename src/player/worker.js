import { storage } from "kv-storage-polyfill";

onmessage = async ({ data: { episode } }) => {
  let lastSelectedTranslations = await storage.get("lastSelectedTranslations");

  // Если ранее хранилище переводов не создавалось — инициализировать его
  if (!lastSelectedTranslations) {
    lastSelectedTranslations = new Map()

    // Демо значения для отладкии
    // lastSelectedTranslations.set(1016, { "id": 2262988, "addedDateTime": "2019-02-02 01:54:43", "activeDateTime": "2019-02-02 02:40:26", "authorsList": ["AniDub"], "fansubsTranslationId": 0, "isActive": 1, "priority": 1664, "qualityType": "tv", "type": "voiceRu", "typeKind": "voice", "typeLang": "ru", "updatedDateTime": "2019-02-02 02:40:26", "title": "OVA 15 серия Легенда о героях Галактики / Ginga Eiyuu Densetsu озвучка от AniDub", "seriesId": 1016, "episodeId": 33431, "countViews": 8, "url": "https://smotret-anime-365.ru/catalog/ginga-eiyuu-densetsu-1016/ova-15-seriya-33431/ozvuchka-2262988", "embedUrl": "https://smotret-anime-365.ru/translations/embed/2262988", "authorsSummary": "AniDub", "episode": { "id": 33431, "episodeFull": "OVA 15 серия", "episodeInt": "15", "episodeTitle": "", "episodeType": "ova", "firstUploadedDateTime": "2015-11-25 05:22:46", "isActive": 1, "seriesId": 1016, "countViews": 973 }, "series": { "id": 1016, "aniDbId": 584, "animeNewsNetworkId": 1786, "fansubsId": 1321, "imdbId": 0, "worldArtId": 723, "isActive": 1, "isAiring": 0, "isHentai": 0, "links": [{ "title": "World Art", "url": "http://www.world-art.ru/animation/animation.php?id=723" }, { "title": "Шикимори.org", "url": "https://shikimori.org/animes/820" }, { "title": "Шикимори.one", "url": "https://shikimori.one/animes/820" }, { "title": "MyAnimeList", "url": "https://myanimelist.net/anime/820" }, { "title": "AniDb ", "url": "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=584" }, { "title": "Anime News Network", "url": "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=1786" }, { "title": "Kage Project", "url": "http://fansubs.ru/base.php?id=1321" }, { "title": "銀河英雄伝説 - оф.сайт - яп", "url": "http://www.ginei.jp" }, { "title": "Legend of the Galactic Heroes - форум перевода - инфо - ру", "url": "http://www.fansubs.ru/forum/viewtopic.php?t=9420" }, { "url": "http://www.allcinema.net/prog/show_c.php?num_c=89133", "title": "Allcinema" }, { "url": "http://en.wikipedia.org/wiki/Legend_of_the_Galactic_Heroes", "title": "Wikipedia" }, { "url": "http://ru.wikipedia.org/wiki/%D0%9B%D0%B5%D0%B3%D0%B5%D0%BD%D0%B4%D0%B0_%D0%BE_%D0%B3%D0%B5%D1%80%D0%BE%D1%8F%D1%85_%D0%93%D0%B0%D0%BB%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B8", "title": "Википедия" }, { "url": "http://ja.wikipedia.org/wiki/%E9%8A%80%E6%B2%B3%E8%8B%B1%E9%9B%84%E4%BC%9D%E8%AA%AC", "title": "ウィキペディア" }], "myAnimeListId": 820, "myAnimeListScore": "9.1", "worldArtScore": "8.7899", "worldArtTopPlace": 86, "numberOfEpisodes": 110, "season": "Зима 1989", "year": 1988, "type": "ova", "typeTitle": "OVA", "countViews": 1, "titles": { "ru": "Легенда о героях Галактики", "romaji": "Ginga Eiyuu Densetsu", "en": "Legend of the Galactic Heroes", "ja": "Heldensagen vom Kosmosinsel 銀河英雄伝説", "short": "HvK" }, "posterUrl": "https://smotret-anime-365.ru/posters/1016.13649588523.jpg", "posterUrlSmall": "https://smotret-anime-365.ru/posters/1016.13649588523.200x600.0.jpg", "titleLines": ["Легенда о героях Галактики", "Ginga Eiyuu Densetsu"], "allTitles": ["Легенда о героях Галактики", "Ginga Eiyuu Densetsu", "Legend of the Galactic Heroes", "Heldensagen vom Kosmosinsel 銀河英雄伝説", "Heldensagen vom Kosmosinsel", "Легенда о героях галактики", "Legend of Galactic Heroes", "HvK", "LGH", "GED", "gin`eiden", "LotGH", "GinEi", "ЛоГГ", "LoGH", "銀河英雄伝説", "Легенда о героях Галактики OVA-1", "銀英伝", "gineiden", "Gin'eiden", "Ginga Eiyu Densetsu", "Heldensagen Vom Kosmosinsel", "GinEiDen"], "title": "Легенда о героях Галактики / Ginga Eiyuu Densetsu", "url": "https://smotret-anime-365.ru/catalog/ginga-eiyuu-densetsu-1016" }, "duration": "1445.74", "width": 960, "height": 720 })
    // lastSelectedTranslations.set(2400, { "id": 546597, "addedDateTime": "2015-10-23 17:28:24", "activeDateTime": "2019-02-24 20:42:03", "authorsList": ["Origin"], "fansubsTranslationId": 0, "isActive": 1, "priority": 1706, "qualityType": "bd", "type": "voiceRu", "typeKind": "voice", "typeLang": "ru", "updatedDateTime": "2019-02-24 20:42:03", "title": "OVA 1 серия Стальной алхимик: Братство / Hagane no Renkinjutsushi (2009) / FMA (2009) озвучка от  (BD)", "seriesId": 2400, "episodeId": 56865, "countViews": 30, "url": "https://smotret-anime-365.ru/catalog/hagane-no-renkinjutsushi-2009-2400/ova-1-seriya-56865/ozvuchka-546597", "embedUrl": "https://smotret-anime-365.ru/translations/embed/546597", "authorsSummary": "Origin", "episode": { "id": 56865, "episodeFull": "OVA 1 серия", "episodeInt": "1", "episodeTitle": "", "episodeType": "ova", "firstUploadedDateTime": "2015-05-21 12:24:28", "isActive": 1, "seriesId": 2400, "countViews": 1308 }, "series": { "id": 2400, "aniDbId": 6107, "animeNewsNetworkId": 10216, "fansubsId": 2342, "imdbId": 0, "worldArtId": 7116, "isActive": 1, "isAiring": 0, "isHentai": 0, "links": [{ "title": "World Art", "url": "http://www.world-art.ru/animation/animation.php?id=7116" }, { "title": "Шикимори.org", "url": "https://shikimori.org/animes/5114" }, { "title": "Шикимори.one", "url": "https://shikimori.one/animes/5114" }, { "title": "MyAnimeList", "url": "https://myanimelist.net/anime/5114" }, { "title": "AniDb ", "url": "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=6107" }, { "title": "Anime News Network", "url": "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=10216" }, { "title": "Kage Project", "url": "http://fansubs.ru/base.php?id=2342" }, { "url": "http://cal.syoboi.jp/tid/1575/time", "title": "Сетка вещания" }, { "url": "http://www.allcinema.net/prog/show_c.php?num_c=333401", "title": "Allcinema" }, { "url": "http://wiki.livedoor.jp/radioi_34/d/%b9%dd%a4%ce%cf%a3%b6%e2%bd%d1%bb%d5%20FULLMETAL%20ALCHEMIST", "title": "seesaa" }, { "url": "http://en.wikipedia.org/wiki/Fullmetal_Alchemist", "title": "Wikipedia" }, { "url": "http://ru.wikipedia.org/wiki/Fullmetal_Alchemist:_Brotherhood", "title": "Википедия" }, { "url": "http://ja.wikipedia.org/wiki/%E9%8B%BC%E3%81%AE%E9%8C%AC%E9%87%91%E8%A1%93%E5%B8%AB_FULLMETAL_ALCHEMIST", "title": "ウィキペディア" }, { "url": "http://seesaawiki.jp/w/radioi_34/d/%b9%dd%a4%ce%cf%a3%b6%e2%bd%d1%bb%d5%20FULLMETAL%20ALCHEMIST", "title": "seesaa" }], "myAnimeListId": 5114, "myAnimeListScore": "9.24", "worldArtScore": "9.1647", "worldArtTopPlace": 4, "numberOfEpisodes": 64, "season": "Весна 2009", "year": 2009, "type": "tv", "typeTitle": "ТВ сериал", "countViews": 1, "titles": { "ru": "Стальной алхимик: Братство", "en": "Fullmetal Alchemist: Brotherhood", "romaji": "Hagane no Renkinjutsushi (2009)", "ja": "鋼の錬金術師 FULLMETAL ALCHEMIST (2009)", "short": "FMA (2009)" }, "posterUrl": "https://smotret-anime-365.ru/posters/2400.10127424713.jpg", "posterUrlSmall": "https://smotret-anime-365.ru/posters/2400.10127424713.200x600.0.jpg", "titleLines": ["Стальной алхимик: Братство", "Hagane no Renkinjutsushi (2009) / FMA (2009)"], "allTitles": ["Стальной алхимик: Братство", "Fullmetal Alchemist: Brotherhood", "Hagane no Renkinjutsushi (2009)", "鋼の錬金術師 FULLMETAL ALCHEMIST (2009)", "Fullmetal Alchemist (2009)", "Full Metal Alchemist: Brotherhood", "Fullmetal Alchemist 2", "Full Metal Alchemist 2", "Стальной Алхимик: Братство", "Fullmetal Alchemist Brotherhood", "Full Metal Alchemist S2", "Full Metal Alchemist 2nd Season", "Fullmetal Alchemist 2 сезон", "鋼の錬金術師 FULLMETAL ALCHEMIST", "FMA (2009)", "FMAB", "FMA2", "hagaren2", "HagaRen (2009)", "Fullmetal Alchemist S2", "Fullmetal Alchemist 2nd Season", "FMA: B", "Full Metal Alchemist 2 сезон", "Стальной алхимик [ТВ-2]", "FMA:B", "鋼の錬金術師 Fullmetal Alchemist (2009)", "Hagane no Renkinjutsushi", "Стальной алхимик 2", "Стальной алхимик 2 сезон", "Стальной алхимик S2", "FMA", "Стальной алхимик 2nd Season", "Hagane no Renkinjutsushi: Fullmetal Alchemist"], "title": "Стальной алхимик: Братство / Hagane no Renkinjutsushi (2009) / FMA (2009)", "url": "https://smotret-anime-365.ru/catalog/hagane-no-renkinjutsushi-2009-2400" }, "duration": "975.488", "width": 852, "height": 480 })
    // lastSelectedTranslations.set(18908, { "id": 2383377, "addedDateTime": "2019-04-17 23:57:14", "activeDateTime": "2019-04-18 00:05:07", "authorsList": ["AniDub"], "fansubsTranslationId": 0, "isActive": 1, "priority": 1736, "qualityType": "tv", "type": "voiceRu", "typeKind": "voice", "typeLang": "ru", "updatedDateTime": "2019-04-18 00:05:07", "title": "14 серия Дороро / Dororo озвучка от AniDub", "seriesId": 18908, "episodeId": 194552, "countViews": 372, "url": "https://smotret-anime-365.ru/catalog/dororo-18908/14-seriya-194552/ozvuchka-2383377", "embedUrl": "https://smotret-anime-365.ru/translations/embed/2383377", "authorsSummary": "AniDub", "episode": { "id": 194552, "episodeFull": "14 серия", "episodeInt": "14", "episodeTitle": "", "episodeType": "tv", "firstUploadedDateTime": "2019-04-15 16:44:12", "isActive": 1, "seriesId": 18908, "countViews": 7612 }, "series": { "id": 18908, "aniDbId": 13946, "animeNewsNetworkId": 20779, "fansubsId": 6142, "imdbId": 0, "worldArtId": 9635, "isActive": 1, "isAiring": 1, "isHentai": 0, "links": [{ "title": "World Art", "url": "http://www.world-art.ru/animation/animation.php?id=9635" }, { "title": "Шикимори.org", "url": "https://shikimori.org/animes/37520" }, { "title": "Шикимори.one", "url": "https://shikimori.one/animes/37520" }, { "title": "MyAnimeList", "url": "https://myanimelist.net/anime/37520" }, { "title": "AniDb ", "url": "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=13946" }, { "title": "Anime News Network", "url": "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=20779" }, { "title": "Kage Project", "url": "http://fansubs.ru/base.php?id=6142" }, { "url": "https://ja.wikipedia.org/wiki/%E3%81%A9%E3%82%8D%E3%82%8D", "title": "ウィキペディア" }, { "url": "http://www.allcinema.net/prog/show_c.php?num_c=363750", "title": "Allcinema" }, { "url": "https://en.wikipedia.org/wiki/Dororo", "title": "wikipedia" }, { "url": "https://dororo-anime.com", "title": "оф. сайт" }, { "url": "https://ru.wikipedia.org/wiki/Dororo", "title": "википедия" }, { "url": "http://cal.syoboi.jp/tid/5188/time", "title": "syoboi" }, { "url": "https://seesaawiki.jp/w/radioi_34/d/%a4%c9%a4%ed%a4%ed%a1%ca2019%c7%af%a1%cb", "title": "seesaa" }, { "url": "https://www.kinopoisk.ru/film/1226631", "title": "kinopoisk" }], "myAnimeListId": 37520, "myAnimeListScore": "8.48", "worldArtScore": "-1", "worldArtTopPlace": null, "numberOfEpisodes": 24, "season": "Зима 2019", "year": 2019, "type": "tv", "typeTitle": "ТВ сериал", "countViews": 1, "titles": { "en": "Dororo (2019)", "romaji": "Dororo", "ru": "Дороро", "ja": "どろろ (2019)" }, "posterUrl": "https://smotret-anime-365.ru/posters/18908.31722152983.jpg", "posterUrlSmall": "https://smotret-anime-365.ru/posters/18908.31722152983.200x600.0.jpg", "titleLines": ["Дороро", "Dororo"], "allTitles": ["Dororo (2019)", "Dororo", "Дороро", "どろろ (2019)", "Дороро [ТВ-2]", "どろろ", "Dororo to Hyakkimaru"], "title": "Дороро / Dororo", "url": "https://smotret-anime-365.ru/catalog/dororo-18908" }, "duration": "1465.05", "width": 1920, "height": 1080 })

    await storage.set("lastSelectedTranslations", lastSelectedTranslations);
  }

  // Если нет епизидо илии переводов в нем — возвращаем значение
  if (!episode || !episode.translations || !episode.translations.length) {
    return postMessage({ translation: undefined })
  }

  // Выбираем последний перевод для конкретного сериала
  let lastSelectedTranslation = lastSelectedTranslations.get(episode.seriesId)

  // Если сохранён перевод для конкретно этой серии — немедленно его вернуть
  if (lastSelectedTranslation && lastSelectedTranslation.episodeId === episode.id) {
    return postMessage({ translation: lastSelectedTranslation })
  }

  // Если переводов для этого сериала нет — перебрать все переводы и выбрать наиболее часто используемый
  else if (!lastSelectedTranslation) {

    // Поиск наиболее частоиспользуемого типа переводов
    const typesMap = new Map()
    for (const translate of lastSelectedTranslations.values()) {

      if (!typesMap.has(translate.type)) {
        typesMap.set(translate.type, 1)
      } else {
        typesMap.set(translate.type, 1 + typesMap.get(translate.type))
      }
    }

    let priorityType = 'voiceRu'
    {
      let maxCount = -1

      for (const [name, count] of typesMap) {
        if (count > maxCount) {
          priorityType = name
          maxCount = count
        }
      }
    }


    // Поиск наиболее частоиспользуемого автора перевода
    const authorsMap = new Map()

    for (const { authorsList } of lastSelectedTranslations.values()) {
      for (const author of authorsList) {
        const name = clearStr(author)
        if (!name) continue

        if (!authorsMap.has(name)) {
          authorsMap.set(name, 1)
        } else {
          authorsMap.set(name, 1 + authorsMap.get(name))
        }

      }

    }

    let priorityAuthor = ''
    {
      let maxCount = -1

      for (const [name, count] of authorsMap) {
        if (count > maxCount) {
          priorityAuthor = name
          maxCount = count
        }
      }
    }


    // Определяем наиболее частоиспользуемый перевод на основе тиипа и автора
    let mostSelectedTranslations = [...lastSelectedTranslations.values()].filter(t => t.type === priorityType && t.authorsList.map(clearStr).includes(priorityAuthor))

    // Если подходящих переводов не нашлось — использовать все доступные
    if (!mostSelectedTranslations.length) {
      mostSelectedTranslations = [...lastSelectedTranslations.values()]
    }

    // Среди доступных переводов выбираем один по свойству priority (получено от smotret-anime-365.ru)
    lastSelectedTranslation = getMostPriority(mostSelectedTranslations)
  }

  if (lastSelectedTranslation) {
    // Фильтруем все переводы на основе приоритетного типа
    let appropriateTranslations = episode.translations.filter(t => t.type === lastSelectedTranslation.type)
    if (!appropriateTranslations.length) {
      appropriateTranslations = episode.translations
    } else {
      episode.translations = appropriateTranslations
    }


    // Фильтруем все переводы на основе приоритетного автора
    appropriateTranslations = episode.translations.filter(t =>
      t.authorsList.length
      && t.authorsList.find(author => {
        const name = clearStr(author)
        return lastSelectedTranslation.authorsList.map(clearStr).includes(name)
      })
    )

    if (!appropriateTranslations.length) {
      appropriateTranslations = episode.translations
    } else {
      episode.translations = appropriateTranslations
    }
  }


  // Среди доступных переводов выбираем один по свойству priority (получено от smotret-anime-365.ru)
  postMessage({ translation: getMostPriority(episode.translations) });
};


/**
 * Функция очищает строку
 * Удаляет всё кроме букв
 * @param {string} name 
 */
function clearStr(name) {
  return name.replace(/[^\p{L}]/giu, "")
    .trim()
    .toLowerCase();
}

function getMostPriority(arr) {
  let maxCount = -1
  let mostPriority = undefined
  for (const translation of arr) {
    if (translation.priority > maxCount) {
      mostPriority = translation
      maxCount = translation.priority
    }
  }

  return mostPriority
}