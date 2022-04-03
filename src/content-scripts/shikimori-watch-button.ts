import {BackgroundRequestProvider} from '@/helpers/API/BackgroundRequestProvider';
import {sync} from '@/helpers/chrome-storage';
import {getMostPriorityTranslation, getPriorityTranslationForEpisode} from '@/helpers/get-translation-priority';
import {pluralize} from '@/helpers/pluralize';
import {SelectedTranslation} from '../../types/UI';

// Запуск главной функции
const mainObserver = new MutationObserver(main);
const observerConfig = {attributes: true, subtree: true, childList: true};
mainObserver.observe(document, observerConfig);
main();


async function main() {

    /** @type {HTMLDivElement} */
    const infoSection = document.body.querySelector<HTMLDivElement>('#animes_show .c-info-right');
    /** @type {HTMLAnchorElement} */
    
    let WatchOnlineButton = document
        .body
        .querySelector<HTMLAnchorElement>(`#play-shiki-online #watch-online-button`);

    let WatchOnlineButtonApp = document
        .body
        .querySelector<HTMLAnchorElement>(`#play-shiki-online-app #watch-online-button-app`);


    if (!infoSection || WatchOnlineButton || WatchOnlineButtonApp) {
        return;
    }

    WatchOnlineButton = createButton(infoSection);
    WatchOnlineButtonApp = createAppButton(infoSection);

    // Загрузка метаданных аниме
    const anime = getAnime();

    if (!anime || !anime.id) {
        WatchOnlineButton.textContent = 'Не удалось определить ID аниме';
        WatchOnlineButton.classList.remove('b-ajax');
        WatchOnlineButton.style.cursor = 'not-allowed';

        WatchOnlineButtonApp.textContent = 'Не удалось определить ID аниме';
        WatchOnlineButtonApp.classList.remove('b-ajax');
        WatchOnlineButtonApp.style.cursor = 'not-allowed';
        return;
    }

    const episodes = await getEpisodes(anime.id);

    if (episodes && episodes.length) 
    {
        const episodeInt = getEpisodeInt();

        if (!episodeInt) 
        {
            WatchOnlineButton.textContent = 'Начать просмотр';
            WatchOnlineButtonApp.textContent = 'Начать просмотр';

        } else {
            // Определяем максимальный номер серии. Он не всегда соответствует количеству серий
            // @ts-ignore
            const max = Math.min(anime.episodes, Math.max(...episodes.map((e) => parseFloat(e.episodeInt))));
            const from = max > 0 ? `из ${max}` : '';

            const watchedWord = pluralize(episodeInt, ['Просмотрена', 'Просмотрено', 'Просмотрено']);
            const episodeWords = (
                from
                ? ['серии', 'серий', 'серий']
                : ['серия', 'серии', 'серий']
            ) as [string, string, string];

            const episodeWord = pluralize(max > 0 ? max : episodeInt, episodeWords);

            WatchOnlineButton.textContent = `${watchedWord} ${episodeInt} ${from} ${episodeWord}`;
            WatchOnlineButtonApp.textContent = `${watchedWord} ${episodeInt} ${from} ${episodeWord}`;

        }

        const appURL = location.href.toString();
        const playerURL = new URL(chrome.runtime.getURL('player.html'));
        playerURL.hash = `/player/anime/${anime.id}`;
        if (episodeInt) {
            playerURL.hash += `/${episodeInt + 1}`;
        }
        
        WatchOnlineButtonApp.href = appURL.replace("https", "anime-lib");
        WatchOnlineButtonApp.classList.remove('b-ajax');
        WatchOnlineButtonApp.style.cursor = 'pointer';

        WatchOnlineButton.href = playerURL.toString();
        WatchOnlineButton.classList.remove('b-ajax');
        WatchOnlineButton.style.cursor = 'pointer';


        /**
         * Загрузка информации про перевод для следующей серии
         */

            // @ts-ignore
        const nextEpisode = episodes.find((e) => parseFloat(e.episodeInt) === episodeInt + 1);
        if (nextEpisode) {
            const promise = getPriorityTranslation(nextEpisode.id);
            const helpText = infoSection.querySelector('.help-text');
            const {translation} = await promise;
            if (translation && helpText) {
                let newHelpText = '';

                newHelpText += `${episodeInt + 1} серия `;

                switch (translation.type) {
                    case 'voiceRu':
                        newHelpText += 'Озвучка';
                        break;
                    case 'voiceEn':
                        newHelpText += 'Английская Озвучка';
                        break;
                    case 'subRu':
                        newHelpText += 'Русские Субтитры';
                        break;
                    case 'subEn':
                        newHelpText += 'Английские Субтитры';
                        break;
                    case 'subJa':
                        newHelpText += 'Японские Субтитры';
                        break;
                    case 'raw':
                        newHelpText += 'Оригинал';
                        break;
                    default:
                        newHelpText += 'Перевод';
                        break;
                }

                newHelpText += ` от ${translation.authorsSummary}`;
                helpText.textContent = newHelpText;
            }
        }


    } else {
        WatchOnlineButton.textContent = 'Пока нет серий';
        WatchOnlineButton.style.cursor = 'not-allowed';
        WatchOnlineButton.classList.remove('b-ajax');

        WatchOnlineButtonApp.textContent = 'Пока нет серий';
        WatchOnlineButtonApp.style.cursor = 'not-allowed';
        WatchOnlineButtonApp.classList.remove('b-ajax');
    }


}


/**
 *
 * @param {HTMLElement} infoSection
 * @returns {HTMLAnchorElement}
 */
function createButton(infoSection: HTMLElement): HTMLAnchorElement {
    // Создание кнопки для перехода к плееру
    const WatchButtonSection = document.createElement('section');
    
    WatchButtonSection.classList.add('block');
    WatchButtonSection.classList.add('watch-online-block');
    WatchButtonSection.id = 'play-shiki-online';
    WatchButtonSection.innerHTML = `
        <div class="subheadline m10">Веб-плеер</div>
        <a id="watch-online-button" class="b-link_button dark b-ajax" style="cursor: wait;user-select: none;">
            <!-- Неразрывный пробел--> <!-- /Неразрывный пробел-->
        </a>

        <small class="help-text" style="
            text-align: center;
            opacity: 0.8;
            display: block;
        "><!-- Неразрывный пробел--> <!-- /Неразрывный пробел--></small>
        <p style="color:#7b8084;text-align:center">
            <strong><a href="https://github.com/cawa-93/play-shikimori-online/wiki/FAQ">Обратная связь</a></strong>
        </p>
    `;

    const target =
        infoSection.querySelector('.block[itemprop="aggregateRating"] + .block')
        || infoSection.querySelector('.block[itemprop="aggregateRating"]');

    if (target) {
        target.after(WatchButtonSection);
    } else {
        infoSection.prepend(WatchButtonSection);
    }

    return WatchButtonSection.querySelector<HTMLAnchorElement>('a#watch-online-button') as HTMLAnchorElement;
}

function createAppButton(infoSection: HTMLElement): HTMLAnchorElement {
    // Создание кнопки для перехода к плееру
    const WatchButtonAppSection = document.createElement('section');
    
    WatchButtonAppSection.classList.add('block');
    WatchButtonAppSection.classList.add('watch-online-block-app');
    WatchButtonAppSection.id = 'play-shiki-online-app';
    WatchButtonAppSection.innerHTML = `
        <div class="subheadline m10">Приложение</div>
        <a id="watch-online-button-app" class="b-link_button dark b-ajax" style="cursor: wait;user-select: none;">
            <!-- Неразрывный пробел--> <!-- /Неразрывный пробел-->
        </a>
    `;

    const target =
        infoSection.querySelector('.block[itemprop="aggregateRating"] + .block')
        || infoSection.querySelector('.block[itemprop="aggregateRating"]');

    if (target) {
        target.after(WatchButtonAppSection);
    } else {
        infoSection.prepend(WatchButtonAppSection);
    }

    return WatchButtonAppSection.querySelector<HTMLAnchorElement>('a#watch-online-button-app') as HTMLAnchorElement;
}

function getAnime() {
    const Anime = document.querySelector<HTMLDivElement>('.b-user_rate[data-target_type="Anime"]');
    if (!Anime || !Anime.dataset || !Anime.dataset.entry) {
        return null;
    }

    try {
        return JSON.parse(Anime.dataset.entry);
    } catch {
        return null;
    }
}


async function getEpisodes(myAnimeListId: number) {
    try {
        const {data} = await BackgroundRequestProvider
            .fetch<anime365.api.SeriesCollection>(
                `https://smotret-anime.online/api/series/?myAnimeListId=${myAnimeListId}`,
                {
                    errorMessage: 'Невозможно проверить наличие серий',
                },
            );

        if (!data || !data[0] || !data[0].episodes) {
            return [];
        }

        return data[0].episodes;

    } catch (e) {
        console.error(e.message, {error: e.toJSON ? e.toJSON() : e});
        alert(`${e.message}. Подробности можно увидеть в консоли (F12)`);
        return [];
    }

}


function getEpisodeInt() {
    const episodeElement = document.querySelector('.b-user_rate[data-target_type="Anime"] .current-episodes');
    if (!episodeElement) {
        return 0;
    }

    const episodeItn = parseInt(episodeElement.textContent || '', 10);

    return isNaN(episodeItn) ? 0 : episodeItn;
}

async function getPriorityTranslation(episodeId: number): Promise<{ translation: anime365.Translation | null }> {
    const [
        {selectedTranslations},
        {data: episode},
    ] = await Promise.all([
        sync.get<{ selectedTranslations: SelectedTranslation[] }>({selectedTranslations: []}),
        BackgroundRequestProvider
            .fetch<anime365.api.EpisodeSelf>(
                `https://smotret-anime.online/api/episodes/${episodeId}`,
                {
                    errorMessage: 'Невозможно загрузить список переводов',
                },
            ),
    ]);

    if (!episode || !episode.translations || !episode.translations.length) {
        return {translation: null};
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
            return {translation: previousSelectedTranslationInEpisode};
        }
    }

    const primaryTranslations = getPriorityTranslationForEpisode(history, episode);
    const primaryActiveTranslations = filterActiveTranslations(primaryTranslations);

    if (primaryActiveTranslations.length) {
        return {translation: getMostPriorityTranslation(primaryActiveTranslations)};
    }

    if (primaryTranslations.length) {
        return {translation: getMostPriorityTranslation(primaryTranslations)};
    }

    return {translation: getMostPriorityTranslation(episode.translations)};
}

function filterActiveTranslations(translations: anime365.Translation[]) {
    return translations.filter((t) => t.isActive);
}
