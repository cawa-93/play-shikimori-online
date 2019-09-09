export interface WatchingHistoryItem {
    id: shikimori.Anime['id'];
    episodes: shikimori.UserRate['episodes'];
    name: shikimori.Anime['russian'] | shikimori.Anime['name'];
    image: shikimori.Anime['image']['original'];
}


export interface SelectedTranslation {
    id: anime365.Translation['seriesId'];
    tId: anime365.Translation['id'];
    eId: anime365.Translation['episodeId'];
    type: anime365.Translation['type'];
    priority: anime365.Translation['priority'];
    author: anime365.Translation['authorsSummary'];
}
