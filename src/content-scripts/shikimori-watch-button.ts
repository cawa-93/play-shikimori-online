import {BackgroundRequestProvider} from '@/helpers/API/BackgroundRequestProvider';
import {pluralize} from '@/helpers/pluralize';

// Запуск главной функции
const mainObserver = new MutationObserver(main);
const observerConfig = {attributes: true, subtree: true, childList: true};
mainObserver.observe(document, observerConfig);
main();


async function main() {

    /** @type {HTMLDivElement} */
    const infoSection = document.body.querySelector<HTMLDivElement>('#animes_show .c-info-right');
    /** @type {HTMLAnchorElement} */
    let WatchOnlineButton = document.body.querySelector<HTMLAnchorElement>('#watch-online-button');

    if (!infoSection || WatchOnlineButton) {
        return;
    }

    WatchOnlineButton = createButton(infoSection);

    // Загрузка метаданных аниме
    const anime = getAnime();

    if (!anime || !anime.id) {
        WatchOnlineButton.textContent = 'Не удалось определить ID аниме';
        WatchOnlineButton.classList.remove('b-ajax');
        WatchOnlineButton.style.cursor = 'not-allowed';
        return;
    }

    const episodes = await getEpisodes(anime.id);

    if (episodes && episodes.length) {
        const episodeInt = getEpisodeInt();
        if (!episodeInt) {
            WatchOnlineButton.textContent = 'Начать просмотр';
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
        }

        const playerURL = new URL(chrome.runtime.getURL('player.html'));
        playerURL.hash = `/player/anime/${anime.id}`;
        if (episodeInt) {
            playerURL.hash += `/${episodeInt + 1}`;
        }

        WatchOnlineButton.href = playerURL.toString();
        WatchOnlineButton.style.cursor = 'pointer';
    } else {
        WatchOnlineButton.textContent = 'Пока нет серий';
        WatchOnlineButton.style.cursor = 'not-allowed';
    }

    WatchOnlineButton.classList.remove('b-ajax');

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
    WatchButtonSection.innerHTML = `
        <div class="subheadline m10">Онлайн просмотр</div>
        <a id="watch-online-button" class="b-link_button dark b-ajax" style="cursor: wait;user-select: none;">
            <!-- Неразрывный пробел--> <!-- /Неразрывный пробел-->
        </a>
        <p style="color:#7b8084;text-align:center">
            <strong><a href="${chrome.runtime.getManifest().homepage_url}">Обратная связь</a></strong>
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
                `https://smotret-anime-365.ru/api/series/?myAnimeListId=${myAnimeListId}`,
                {
                    errorMessage: 'Невозможно проверить наличие серий',
                },
            );

        if (!data || !data[0] || !data[0].episodes) {
            return [];
        }

        return data[0].episodes;

    } catch (e) {
        console.error(e);
        alert(e.message);
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
