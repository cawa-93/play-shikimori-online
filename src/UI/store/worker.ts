import {getMostPriorityTranslation, getPriorityTranslationForEpisode} from '@/helpers/get-translation-priority';
// @ts-ignore
import storage from 'kv-storage-polyfill';


const ctx: Worker = self as any;

ctx.onmessage = async ({data: {episode}}) => {
    let history = await storage.get('lastSelectedTranslations');

    if (!history) {
        history = new Map();
        await storage.set('lastSelectedTranslations', history);
    }

    if (!episode || !episode.translations || !episode.translations.length) {
        // @ts-ignore
        return postMessage({translation: undefined});
    }

    const previousUserTranslation = history.get(episode.seriesId);

    // Если предыдущий перевод принадлежит текущей серии — его и возвращаем
    if (previousUserTranslation && previousUserTranslation.episodeId === episode.id) {
        // @ts-ignore
        return postMessage({translation: previousUserTranslation});
    }

    const primaryTranslations = getPriorityTranslationForEpisode(history, episode);
    const primaryActiveTranslations = filterActiveTranslations(primaryTranslations);

    if (primaryActiveTranslations.length) {
        // @ts-ignore
        return postMessage({translation: getMostPriorityTranslation(primaryActiveTranslations)});
    }

    if (primaryTranslations.length) {
        // @ts-ignore
        return postMessage({translation: getMostPriorityTranslation(primaryTranslations)});
    }

    // @ts-ignore
    return postMessage({translation: getMostPriorityTranslation(episode.translations)});


};


function filterActiveTranslations(translations: anime365.Translation[]) {
    return translations.filter((t) => t.isActive);
}
