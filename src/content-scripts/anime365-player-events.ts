import '@/content-scripts/anime365-player-styles.css';
// @ts-ignore
import storage from 'kv-storage-polyfill';
import throttle from 'lodash.throttle';
import videojs from 'video.js';


declare const playerGlobal: (videojs.Player & { publicReady: boolean }) | undefined;
declare const site: {
    isPremiumUser?: boolean,
} | undefined;


(() => {
    const params = new URLSearchParams(location.hash.slice(1));

    const SERIES_ID = params.get('play-shikimori[seriesId]');
    const EPISODE_ID = params.get('play-shikimori[episodeId]');
    const NEXT_EPISODE = params.get('play-shikimori[nextEpisode]') === '1';
    const IS_AUTO_PLAY = params.get('play-shikimori[isAutoPlay]') === '1';
    const IS_FULL_SCREEN = params.get('play-shikimori[fullScreen]') === '1';

    const savedTimePromise: Promise<{ episodeId: string, time: number } | undefined>
        = storage.get(`play-${SERIES_ID}-time`);

    async function main(player: videojs.Player) {

        // Перематываем видео
        restoreCurrentTime(player)
            .then(() => {
                // Если нет рекламы — запускаем видео
                if (IS_AUTO_PLAY && site && site.isPremiumUser) {
                    player.play();
                }
            });

        // Инициализируем полноэкранный режим
        if (IS_FULL_SCREEN) {
            player.requestFullscreen();
        }

        // Проксируем события родителю
        proxyEventToParent(player, ['public-play', 'public-pause', 'public-ended']);

        // Начинаем сохранять прогресс просмотра
        if (SERIES_ID && EPISODE_ID) {
            saveCurrentTime(player);
        }


        // Создаём кнопку следующей серии
        if (NEXT_EPISODE) {
            createNextEpisodeButton(player);
        }


    }


    /**
     * Создаёт кнопку для переключения серии,
     * и подписывается на сотытия
     * click — для отправки события родителю
     * timeupdate — для изменения прозрачности
     */
    function createNextEpisodeButton(player: videojs.Player) {
        // Обязательно нужно добавлять кнопку в контейнер #main-video
        // Иначе она будет невидимой в полноэкранном режиме
        const mainVideo = document.querySelector('#main-video');
        if (!mainVideo) {
            return null;
        }

        /**
         * Создание кнопки
         */
        const nextEpisodeButton = document.createElement('button');
        nextEpisodeButton.innerText = 'Следующая серия';
        nextEpisodeButton.classList.add('next-episode');
        mainVideo.appendChild(nextEpisodeButton);


        /**
         * По клику отправляем событие родителю для переключения сериии
         */
        nextEpisodeButton.addEventListener('click', () => {
            window.parent.postMessage('mark-as-watched', '*');
        });


        /**
         * Отслеживаем прогресс просмотра и показываем/скрываем кнопку
         */
        const onTimeUpdateThrottled = throttle(() => {
            const currentTime = player.currentTime();
            const duration = player.duration();

            const endingTime = duration > 600 ? 120 : duration * 0.1;
            if (player.isFullscreen() && duration - currentTime <= endingTime) {
                if (!nextEpisodeButton.classList.contains('show')) {
                    nextEpisodeButton.classList.add('show');
                }
            } else {
                if (nextEpisodeButton.classList.contains('show')) {
                    nextEpisodeButton.classList.remove('show');
                }
            }
        }, 1000);


        player.on('timeupdate', onTimeUpdateThrottled);

        return nextEpisodeButton;
    }


    /**
     * Перематывает видео до последнего сохраненного момента
     * @param player
     */
    async function restoreCurrentTime(player: videojs.Player) {
        const savedTime = await savedTimePromise;
        if (!savedTime) {
            return;
        }

        if (savedTime.episodeId === EPISODE_ID) {
            player.currentTime(Math.max(0, savedTime.time));
        }
    }


    /**
     * Подписывается на переданный список событий и проксирует их родителю
     * @param player
     * @param events Список событий
     */
    function proxyEventToParent(player: videojs.Player, events: string[]) {
        player.on(events, (event) => {
            const message = event.type;
            window.parent.postMessage(message, '*');
        });
    }


    /**
     * Подписывается на событие timeupdate и сохраняет в памяти currentTime
     * @param player
     */
    function saveCurrentTime(player: videojs.Player) {
        const saveTimeThrottled = throttle(() => {
            return storage.set(`play-${SERIES_ID}-time`, {
                episodeId: EPISODE_ID,
                time: player.currentTime(),
            });
        }, 10000);

        player.on('timeupdate', saveTimeThrottled);
    }


    /**
     * Проверяем наличие playerGlobal и запускаем главную функцию
     */
    if (playerGlobal) {
        if (playerGlobal.publicReady) {
            main(playerGlobal);
        } else {
            playerGlobal.one('public-ready', () => main(playerGlobal));
        }
    } else {
        const addUploadRequestForm = document.body.querySelector<HTMLFormElement>(
            'form[action*="/translations/embedAddUploadRequest"]');

        if (addUploadRequestForm) {
            addUploadRequestForm.submit();
        }
    }

})();
