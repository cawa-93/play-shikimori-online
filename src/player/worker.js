import { storage } from "kv-storage-polyfill";

onmessage = async ({ data: { episode } }) => {
  let lastSelectedTranslations = await storage.get("lastSelectedTranslations");

  // Если ранее хранилище переводов не создавалось — инициализировать его
  if (!lastSelectedTranslations) {
    lastSelectedTranslations = new Map()

    // Демо значения для отладки
    // lastSelectedTranslations.set(1016, { "id": 2262988, "addedDateTime": "2019-02-02 01:54:43", "activeDateTime": "2019-02-02 02:40:26", "authorsList": ["AniDub"], "fansubsTranslationId": 0, "isActive": 1, "priority": 1664, "qualityType": "tv", "type": "voiceRu", "typeKind": "voice", "typeLang": "ru", "updatedDateTime": "2019-02-02 02:40:26", "title": "OVA 15 серия Легенда о героях Галактики / Ginga Eiyuu Densetsu озвучка от AniDub", "seriesId": 1016, "episodeId": 33431, "countViews": 8, "url": "https://smotret-anime-365.ru/catalog/ginga-eiyuu-densetsu-1016/ova-15-seriya-33431/ozvuchka-2262988", "embedUrl": "https://smotret-anime-365.ru/translations/embed/2262988", "authorsSummary": "AniDub", "episode": { "id": 33431, "episodeFull": "OVA 15 серия", "episodeInt": "15", "episodeTitle": "", "episodeType": "ova", "firstUploadedDateTime": "2015-11-25 05:22:46", "isActive": 1, "seriesId": 1016, "countViews": 973 }, "series": { "id": 1016, "aniDbId": 584, "animeNewsNetworkId": 1786, "fansubsId": 1321, "imdbId": 0, "worldArtId": 723, "isActive": 1, "isAiring": 0, "isHentai": 0, "links": [{ "title": "World Art", "url": "http://www.world-art.ru/animation/animation.php?id=723" }, { "title": "Шикимори.org", "url": "https://shikimori.org/animes/820" }, { "title": "Шикимори.one", "url": "https://shikimori.one/animes/820" }, { "title": "MyAnimeList", "url": "https://myanimelist.net/anime/820" }, { "title": "AniDb ", "url": "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=584" }, { "title": "Anime News Network", "url": "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=1786" }, { "title": "Kage Project", "url": "http://fansubs.ru/base.php?id=1321" }, { "title": "銀河英雄伝説 - оф.сайт - яп", "url": "http://www.ginei.jp" }, { "title": "Legend of the Galactic Heroes - форум перевода - инфо - ру", "url": "http://www.fansubs.ru/forum/viewtopic.php?t=9420" }, { "url": "http://www.allcinema.net/prog/show_c.php?num_c=89133", "title": "Allcinema" }, { "url": "http://en.wikipedia.org/wiki/Legend_of_the_Galactic_Heroes", "title": "Wikipedia" }, { "url": "http://ru.wikipedia.org/wiki/%D0%9B%D0%B5%D0%B3%D0%B5%D0%BD%D0%B4%D0%B0_%D0%BE_%D0%B3%D0%B5%D1%80%D0%BE%D1%8F%D1%85_%D0%93%D0%B0%D0%BB%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%B8", "title": "Википедия" }, { "url": "http://ja.wikipedia.org/wiki/%E9%8A%80%E6%B2%B3%E8%8B%B1%E9%9B%84%E4%BC%9D%E8%AA%AC", "title": "ウィキペディア" }], "myAnimeListId": 820, "myAnimeListScore": "9.1", "worldArtScore": "8.7899", "worldArtTopPlace": 86, "numberOfEpisodes": 110, "season": "Зима 1989", "year": 1988, "type": "ova", "typeTitle": "OVA", "countViews": 1, "titles": { "ru": "Легенда о героях Галактики", "romaji": "Ginga Eiyuu Densetsu", "en": "Legend of the Galactic Heroes", "ja": "Heldensagen vom Kosmosinsel 銀河英雄伝説", "short": "HvK" }, "posterUrl": "https://smotret-anime-365.ru/posters/1016.13649588523.jpg", "posterUrlSmall": "https://smotret-anime-365.ru/posters/1016.13649588523.200x600.0.jpg", "titleLines": ["Легенда о героях Галактики", "Ginga Eiyuu Densetsu"], "allTitles": ["Легенда о героях Галактики", "Ginga Eiyuu Densetsu", "Legend of the Galactic Heroes", "Heldensagen vom Kosmosinsel 銀河英雄伝説", "Heldensagen vom Kosmosinsel", "Легенда о героях галактики", "Legend of Galactic Heroes", "HvK", "LGH", "GED", "gin`eiden", "LotGH", "GinEi", "ЛоГГ", "LoGH", "銀河英雄伝説", "Легенда о героях Галактики OVA-1", "銀英伝", "gineiden", "Gin'eiden", "Ginga Eiyu Densetsu", "Heldensagen Vom Kosmosinsel", "GinEiDen"], "title": "Легенда о героях Галактики / Ginga Eiyuu Densetsu", "url": "https://smotret-anime-365.ru/catalog/ginga-eiyuu-densetsu-1016" }, "duration": "1445.74", "width": 960, "height": 720 })
    // lastSelectedTranslations.set(2400, { "id": 546597, "addedDateTime": "2015-10-23 17:28:24", "activeDateTime": "2019-02-24 20:42:03", "authorsList": ["Origin"], "fansubsTranslationId": 0, "isActive": 1, "priority": 1706, "qualityType": "bd", "type": "voiceRu", "typeKind": "voice", "typeLang": "ru", "updatedDateTime": "2019-02-24 20:42:03", "title": "OVA 1 серия Стальной алхимик: Братство / Hagane no Renkinjutsushi (2009) / FMA (2009) озвучка от  (BD)", "seriesId": 2400, "episodeId": 56865, "countViews": 30, "url": "https://smotret-anime-365.ru/catalog/hagane-no-renkinjutsushi-2009-2400/ova-1-seriya-56865/ozvuchka-546597", "embedUrl": "https://smotret-anime-365.ru/translations/embed/546597", "authorsSummary": "Origin", "episode": { "id": 56865, "episodeFull": "OVA 1 серия", "episodeInt": "1", "episodeTitle": "", "episodeType": "ova", "firstUploadedDateTime": "2015-05-21 12:24:28", "isActive": 1, "seriesId": 2400, "countViews": 1308 }, "series": { "id": 2400, "aniDbId": 6107, "animeNewsNetworkId": 10216, "fansubsId": 2342, "imdbId": 0, "worldArtId": 7116, "isActive": 1, "isAiring": 0, "isHentai": 0, "links": [{ "title": "World Art", "url": "http://www.world-art.ru/animation/animation.php?id=7116" }, { "title": "Шикимори.org", "url": "https://shikimori.org/animes/5114" }, { "title": "Шикимори.one", "url": "https://shikimori.one/animes/5114" }, { "title": "MyAnimeList", "url": "https://myanimelist.net/anime/5114" }, { "title": "AniDb ", "url": "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=6107" }, { "title": "Anime News Network", "url": "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=10216" }, { "title": "Kage Project", "url": "http://fansubs.ru/base.php?id=2342" }, { "url": "http://cal.syoboi.jp/tid/1575/time", "title": "Сетка вещания" }, { "url": "http://www.allcinema.net/prog/show_c.php?num_c=333401", "title": "Allcinema" }, { "url": "http://wiki.livedoor.jp/radioi_34/d/%b9%dd%a4%ce%cf%a3%b6%e2%bd%d1%bb%d5%20FULLMETAL%20ALCHEMIST", "title": "seesaa" }, { "url": "http://en.wikipedia.org/wiki/Fullmetal_Alchemist", "title": "Wikipedia" }, { "url": "http://ru.wikipedia.org/wiki/Fullmetal_Alchemist:_Brotherhood", "title": "Википедия" }, { "url": "http://ja.wikipedia.org/wiki/%E9%8B%BC%E3%81%AE%E9%8C%AC%E9%87%91%E8%A1%93%E5%B8%AB_FULLMETAL_ALCHEMIST", "title": "ウィキペディア" }, { "url": "http://seesaawiki.jp/w/radioi_34/d/%b9%dd%a4%ce%cf%a3%b6%e2%bd%d1%bb%d5%20FULLMETAL%20ALCHEMIST", "title": "seesaa" }], "myAnimeListId": 5114, "myAnimeListScore": "9.24", "worldArtScore": "9.1647", "worldArtTopPlace": 4, "numberOfEpisodes": 64, "season": "Весна 2009", "year": 2009, "type": "tv", "typeTitle": "ТВ сериал", "countViews": 1, "titles": { "ru": "Стальной алхимик: Братство", "en": "Fullmetal Alchemist: Brotherhood", "romaji": "Hagane no Renkinjutsushi (2009)", "ja": "鋼の錬金術師 FULLMETAL ALCHEMIST (2009)", "short": "FMA (2009)" }, "posterUrl": "https://smotret-anime-365.ru/posters/2400.10127424713.jpg", "posterUrlSmall": "https://smotret-anime-365.ru/posters/2400.10127424713.200x600.0.jpg", "titleLines": ["Стальной алхимик: Братство", "Hagane no Renkinjutsushi (2009) / FMA (2009)"], "allTitles": ["Стальной алхимик: Братство", "Fullmetal Alchemist: Brotherhood", "Hagane no Renkinjutsushi (2009)", "鋼の錬金術師 FULLMETAL ALCHEMIST (2009)", "Fullmetal Alchemist (2009)", "Full Metal Alchemist: Brotherhood", "Fullmetal Alchemist 2", "Full Metal Alchemist 2", "Стальной Алхимик: Братство", "Fullmetal Alchemist Brotherhood", "Full Metal Alchemist S2", "Full Metal Alchemist 2nd Season", "Fullmetal Alchemist 2 сезон", "鋼の錬金術師 FULLMETAL ALCHEMIST", "FMA (2009)", "FMAB", "FMA2", "hagaren2", "HagaRen (2009)", "Fullmetal Alchemist S2", "Fullmetal Alchemist 2nd Season", "FMA: B", "Full Metal Alchemist 2 сезон", "Стальной алхимик [ТВ-2]", "FMA:B", "鋼の錬金術師 Fullmetal Alchemist (2009)", "Hagane no Renkinjutsushi", "Стальной алхимик 2", "Стальной алхимик 2 сезон", "Стальной алхимик S2", "FMA", "Стальной алхимик 2nd Season", "Hagane no Renkinjutsushi: Fullmetal Alchemist"], "title": "Стальной алхимик: Братство / Hagane no Renkinjutsushi (2009) / FMA (2009)", "url": "https://smotret-anime-365.ru/catalog/hagane-no-renkinjutsushi-2009-2400" }, "duration": "975.488", "width": 852, "height": 480 })
    // lastSelectedTranslations.set(18908, { "id": 2383377, "addedDateTime": "2019-04-17 23:57:14", "activeDateTime": "2019-04-18 00:05:07", "authorsList": ["AniDub"], "fansubsTranslationId": 0, "isActive": 1, "priority": 1736, "qualityType": "tv", "type": "voiceRu", "typeKind": "voice", "typeLang": "ru", "updatedDateTime": "2019-04-18 00:05:07", "title": "14 серия Дороро / Dororo озвучка от AniDub", "seriesId": 18908, "episodeId": 194552, "countViews": 372, "url": "https://smotret-anime-365.ru/catalog/dororo-18908/14-seriya-194552/ozvuchka-2383377", "embedUrl": "https://smotret-anime-365.ru/translations/embed/2383377", "authorsSummary": "AniDub", "episode": { "id": 194552, "episodeFull": "14 серия", "episodeInt": "14", "episodeTitle": "", "episodeType": "tv", "firstUploadedDateTime": "2019-04-15 16:44:12", "isActive": 1, "seriesId": 18908, "countViews": 7612 }, "series": { "id": 18908, "aniDbId": 13946, "animeNewsNetworkId": 20779, "fansubsId": 6142, "imdbId": 0, "worldArtId": 9635, "isActive": 1, "isAiring": 1, "isHentai": 0, "links": [{ "title": "World Art", "url": "http://www.world-art.ru/animation/animation.php?id=9635" }, { "title": "Шикимори.org", "url": "https://shikimori.org/animes/37520" }, { "title": "Шикимори.one", "url": "https://shikimori.one/animes/37520" }, { "title": "MyAnimeList", "url": "https://myanimelist.net/anime/37520" }, { "title": "AniDb ", "url": "https://anidb.net/perl-bin/animedb.pl?show=anime&aid=13946" }, { "title": "Anime News Network", "url": "https://www.animenewsnetwork.com/encyclopedia/anime.php?id=20779" }, { "title": "Kage Project", "url": "http://fansubs.ru/base.php?id=6142" }, { "url": "https://ja.wikipedia.org/wiki/%E3%81%A9%E3%82%8D%E3%82%8D", "title": "ウィキペディア" }, { "url": "http://www.allcinema.net/prog/show_c.php?num_c=363750", "title": "Allcinema" }, { "url": "https://en.wikipedia.org/wiki/Dororo", "title": "wikipedia" }, { "url": "https://dororo-anime.com", "title": "оф. сайт" }, { "url": "https://ru.wikipedia.org/wiki/Dororo", "title": "википедия" }, { "url": "http://cal.syoboi.jp/tid/5188/time", "title": "syoboi" }, { "url": "https://seesaawiki.jp/w/radioi_34/d/%a4%c9%a4%ed%a4%ed%a1%ca2019%c7%af%a1%cb", "title": "seesaa" }, { "url": "https://www.kinopoisk.ru/film/1226631", "title": "kinopoisk" }], "myAnimeListId": 37520, "myAnimeListScore": "8.48", "worldArtScore": "-1", "worldArtTopPlace": null, "numberOfEpisodes": 24, "season": "Зима 2019", "year": 2019, "type": "tv", "typeTitle": "ТВ сериал", "countViews": 1, "titles": { "en": "Dororo (2019)", "romaji": "Dororo", "ru": "Дороро", "ja": "どろろ (2019)" }, "posterUrl": "https://smotret-anime-365.ru/posters/18908.31722152983.jpg", "posterUrlSmall": "https://smotret-anime-365.ru/posters/18908.31722152983.200x600.0.jpg", "titleLines": ["Дороро", "Dororo"], "allTitles": ["Dororo (2019)", "Dororo", "Дороро", "どろろ (2019)", "Дороро [ТВ-2]", "どろろ", "Dororo to Hyakkimaru"], "title": "Дороро / Dororo", "url": "https://smotret-anime-365.ru/catalog/dororo-18908" }, "duration": "1465.05", "width": 1920, "height": 1080 })

    await storage.set("lastSelectedTranslations", lastSelectedTranslations);
  }

  // Если нет епизидо или переводов в нем — возвращаем значение
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


    // Определяем наиболее частоиспользуемый перевод на основе типа и автора
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
  // const regex = /[^\p{L}]/giu // не работает в firefox 67.0.4
  const regex = /(?:[\0-@\[-`\{-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u036F\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482-\u0489\u0530\u0557\u0558\u055A-\u055F\u0589-\u05CF\u05EB-\u05EE\u05F3-\u061F\u064B-\u066D\u0670\u06D4\u06D6-\u06E4\u06E7-\u06ED\u06F0-\u06F9\u06FD\u06FE\u0700-\u070F\u0711\u0730-\u074C\u07A6-\u07B0\u07B2-\u07C9\u07EB-\u07F3\u07F6-\u07F9\u07FB-\u07FF\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u083F\u0859-\u085F\u086B-\u089F\u08B5\u08BE-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962-\u0970\u0981-\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA-\u09BC\u09BE-\u09CD\u09CF-\u09DB\u09DE\u09E2-\u09EF\u09F2-\u09FB\u09FD-\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34-\u0A37\u0A3A-\u0A58\u0A5D\u0A5F-\u0A71\u0A75-\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA-\u0ABC\u0ABE-\u0ACF\u0AD1-\u0ADF\u0AE2-\u0AF8\u0AFA-\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A-\u0B3C\u0B3E-\u0B5B\u0B5E\u0B62-\u0B70\u0B72-\u0B82\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BCF\u0BD1-\u0C04\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C3E-\u0C57\u0C5B-\u0C5F\u0C62-\u0C7F\u0C81-\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA-\u0CBC\u0CBE-\u0CDD\u0CDF\u0CE2-\u0CF0\u0CF3-\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D3E-\u0D4D\u0D4F-\u0D53\u0D57-\u0D5E\u0D62-\u0D79\u0D80-\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0E00\u0E31-\u0E3F\u0E47-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EB1\u0EB4-\u0EBC\u0EBE\u0EBF\u0EC5\u0EC7-\u0EDB\u0EE0-\u0EFF\u0F01-\u0F3F\u0F48\u0F6D-\u0F87\u0F8D-\u0FFF\u102B-\u103E\u1040-\u104F\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16F0\u16F9-\u16FF\u170D\u1712-\u171F\u1732-\u173F\u1752-\u175F\u176D\u1771-\u177F\u17B4-\u17D6\u17D8-\u17DB\u17DD-\u181F\u1879-\u187F\u1885-\u18A9\u18AB-\u18AF\u18F6-\u18FF\u191F-\u194F\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19FF\u1A17-\u1A1F\u1A55-\u1AA6\u1AA8-\u1B04\u1B34-\u1B44\u1B4C-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BFF\u1C24-\u1C4C\u1C50-\u1C59\u1C7E\u1C7F\u1C89-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1CFB-\u1CFF\u1DC0-\u1DFF\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u2070\u2072-\u207E\u2080-\u208F\u209D-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F-\u2182\u2185-\u2BFF\u2C2F\u2C5F\u2CE5-\u2CEA\u2CEF-\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7F\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF-\u2E2E\u2E30-\u3004\u3007-\u3030\u3036-\u303A\u303D-\u3040\u3097-\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u319F\u31BB-\u31EF\u3200-\u33FF\u4DB6-\u4DFF\u9FF0-\u9FFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA620-\uA629\uA62C-\uA63F\uA66F-\uA67E\uA69E\uA69F\uA6E6-\uA716\uA720\uA721\uA789\uA78A\uA7C0\uA7C1\uA7C7-\uA7F6\uA802\uA806\uA80B\uA823-\uA83F\uA874-\uA881\uA8B4-\uA8F1\uA8F8-\uA8FA\uA8FC\uA8FF-\uA909\uA926-\uA92F\uA947-\uA95F\uA97D-\uA983\uA9B3-\uA9CE\uA9D0-\uA9DF\uA9E5\uA9F0-\uA9FF\uAA29-\uAA3F\uAA43\uAA4C-\uAA5F\uAA77-\uAA79\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAC3-\uAADA\uAADE\uAADF\uAAEB-\uAAF1\uAAF5-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB68-\uAB6F\uABE3-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB1E\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFE6F\uFE75\uFEFD-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEFF\uDF20-\uDF2C\uDF41\uDF4A-\uDF4F\uDF76-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0-\uDFFF]|\uD801[\uDC9E-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56-\uDC5F\uDC77-\uDC7F\uDC9F-\uDCDF\uDCF3\uDCF6-\uDCFF\uDD16-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBD\uDDC0-\uDDFF\uDE01-\uDE0F\uDE14\uDE18\uDE36-\uDE5F\uDE7D-\uDE7F\uDE9D-\uDEBF\uDEC8\uDEE5-\uDEFF\uDF36-\uDF3F\uDF56-\uDF5F\uDF73-\uDF7F\uDF92-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCFF\uDD24-\uDEFF\uDF1D-\uDF26\uDF28-\uDF2F\uDF46-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC00-\uDC02\uDC38-\uDC82\uDCB0-\uDCCF\uDCE9-\uDD43\uDD45-\uDD4F\uDD73-\uDD75\uDD77-\uDD82\uDDB3-\uDDC0\uDDC5-\uDDD9\uDDDB\uDDDD-\uDDFF\uDE12\uDE2C-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEDF-\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A-\uDF3C\uDF3E-\uDF4F\uDF51-\uDF5C\uDF62-\uDFFF]|\uD805[\uDC35-\uDC46\uDC4B-\uDC5E\uDC60-\uDC7F\uDCB0-\uDCC3\uDCC6\uDCC8-\uDD7F\uDDAF-\uDDD7\uDDDC-\uDDFF\uDE30-\uDE43\uDE45-\uDE7F\uDEAB-\uDEB7\uDEB9-\uDEFF\uDF1B-\uDFFF]|\uD806[\uDC2C-\uDC9F\uDCE0-\uDCFE\uDD00-\uDD9F\uDDA8\uDDA9\uDDD1-\uDDE0\uDDE2\uDDE4-\uDDFF\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE4F\uDE51-\uDE5B\uDE8A-\uDE9C\uDE9E-\uDEBF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC2F-\uDC3F\uDC41-\uDC71\uDC90-\uDCFF\uDD07\uDD0A\uDD31-\uDD45\uDD47-\uDD5F\uDD66\uDD69\uDD8A-\uDD97\uDD99-\uDEDF\uDEF3-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC00-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD823-\uD82B\uD82D\uD82E\uD830-\uD834\uD836\uD837\uD839\uD83C-\uD83F\uD87B-\uD87D\uD87F-\uDBFF][\uDC00-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F-\uDECF\uDEEE-\uDF3F\uDF44-\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE80-\uDEFF\uDF4B-\uDF4F\uDF51-\uDF92\uDFA0-\uDFDF\uDFE2\uDFE4-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD822[\uDEF3-\uDFFF]|\uD82C[\uDD1F-\uDD4F\uDD53-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC-\uDFFF]|\uD838[\uDC00-\uDCFF\uDD2D-\uDD36\uDD3E-\uDD4D\uDD4F-\uDEBF\uDEEC-\uDFFF]|\uD83A[\uDCC5-\uDCFF\uDD44-\uDD4A\uDD4C-\uDFFF]|\uD83B[\uDC00-\uDDFF\uDE04-\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD869[\uDED7-\uDEFF]|\uD86D[\uDF35-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/gi
  return name.replace(regex, "")
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