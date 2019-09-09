import {getMostPriorityTranslation, getPriorityTranslationForEpisode} from '@/helpers/get-translation-priority';
import {SelectedTranslation} from '../../../types/UI';
// @ts-ignore


const ctx: Worker = self as any;

ctx.onmessage = async (
    {
        data: {episode, selectedTranslations},
    }: {
        data: { episode: anime365.Episode; selectedTranslations: SelectedTranslation[] };
    },
) => {
    if (!episode || !episode.translations || !episode.translations.length) {
        return ctx.postMessage({translation: undefined});
    }

    const history = new Map<number, SelectedTranslation>();

    selectedTranslations.forEach((translation) => {
        history.set(translation.id, translation);
    });

    const previousSelectedTranslation = history.get(episode.seriesId);

    // Если предыдущий перевод принадлежит текущей серии — его и возвращаем
    if (previousSelectedTranslation && previousSelectedTranslation.eId === episode.id) {
        const previousSelectedTranslationInEpisode = episode.translations.find(
            (t) => t.id === previousSelectedTranslation.id);
        if (previousSelectedTranslationInEpisode) {
            return ctx.postMessage({translation: previousSelectedTranslationInEpisode});
        }
    }

    const primaryTranslations = getPriorityTranslationForEpisode(history, episode);
    const primaryActiveTranslations = filterActiveTranslations(primaryTranslations);

    if (primaryActiveTranslations.length) {
        return ctx.postMessage({translation: getMostPriorityTranslation(primaryActiveTranslations)});
    }

    if (primaryTranslations.length) {
        return ctx.postMessage({translation: getMostPriorityTranslation(primaryTranslations)});
    }

    return ctx.postMessage({translation: getMostPriorityTranslation(episode.translations)});


};


function filterActiveTranslations(translations: anime365.Translation[]) {
    return translations.filter((t) => t.isActive);
}
