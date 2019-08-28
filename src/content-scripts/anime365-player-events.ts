import '@/content-scripts/anime365-player-styles.css';
// @ts-ignore
import storage from 'kv-storage-polyfill';
import throttle from 'lodash.throttle';
import videojs from 'video.js';


(
    () => {
        try {
            const config = new URLSearchParams(location.hash.slice(1));

            // @ts-ignore
            const player = window.playerGlobal as videojs.Player & { concatenate: { activated: boolean } };
            if (!player) {
                const addUploadRequestForm = document.body.querySelector<HTMLFormElement>(
                    'form[action*="/translations/embedAddUploadRequest"]');

                if (addUploadRequestForm) {
                    addUploadRequestForm.submit();
                }

                return;
            }
            const seriesId = config.get('play-shikimori[seriesId]');
            const episodeId = config.get('play-shikimori[episodeId]');
            const nextEpisode = config.get('play-shikimori[nextEpisode]') === '1';
            const isAutoPlay = config.get('play-shikimori[isAutoPlay]') === '1';


            /**
             * Главная функция
             * Запускается один раз, при первом запуске видео после рекламы
             */
            function init() {
                if (!player || !player.concatenate || !player.concatenate.activated) {
                    return;
                }
                player.off('play', init);


                setCurrentTime();
                initSaveFullScreenState();
                let nextEpisodeButton: HTMLButtonElement | null;
                if (nextEpisode) {
                    nextEpisodeButton = createNextEpisodeButton();
                }

                /**
                 * Инициализирует отправку событий плеера к родительскому окну
                 */
                player.on(['play', 'pause', 'ended'], proxyEventToParent);

                const saveCurrentTimeThrottled = throttle(saveCurrentTime, 10000);
                const toggleNextEpisodeButtonThrottled = throttle(toggleNextEpisodeButton, 1000);

                player.on('timeupdate', () => {
                    if (!seriesId || !episodeId) {
                        return;
                    }

                    const currentTime = player.currentTime();
                    const duration = player.duration();

                    saveCurrentTimeThrottled({seriesId, episodeId, currentTime});
                    if (nextEpisode && nextEpisodeButton) {
                        toggleNextEpisodeButtonThrottled({currentTime, duration, nextEpisodeButton});
                    }
                });
            }


            player.on('play', init);


            function proxyEventToParent(event: WindowEventMap['play' | 'pause' | 'ended']) {
                const name = event.type;
                const currentTime = player.currentTime();
                const duration = player.duration();

                if (name === 'ended' && duration - currentTime >= 10) {
                    return;
                }

                const message = {
                    name,
                    currentTime,
                    duration,
                };
                window.parent.postMessage(message, '*');
            }


            /**
             * Создаёт кнопку переключения серии и инизиализурует обработчик собитий на ней
             */
            function createNextEpisodeButton() {
                const nextEpisodeButton = document.createElement('button');
                nextEpisodeButton.innerText = 'Следующая серия';
                nextEpisodeButton.classList.add('next-episode');
                nextEpisodeButton.hidden = true;
                const mainVideo = document.querySelector('#main-video');
                if (!mainVideo) {
                    return null;
                }
                mainVideo.appendChild(nextEpisodeButton);
                nextEpisodeButton.addEventListener('click', () => {
                    const message = {
                        name: 'mark-as-watched',
                        currentTime: player.currentTime(),
                        duration: player.duration(),
                    };
                    window.parent.postMessage(message, '*');
                });

                return nextEpisodeButton;
            }


            /**
             * Следим за временем и показываем/скрываем кнопку следующей серии
             */
            function toggleNextEpisodeButton({nextEpisodeButton, duration, currentTime}: {
                nextEpisodeButton: HTMLButtonElement,
                duration: number,
                currentTime: number,
            }) {

                if (!nextEpisodeButton || !duration || !currentTime) {
                    return;
                }

                const endingTime = duration > 600 ? 120 : duration * 0.1;
                if (player.isFullscreen() && duration - currentTime <= endingTime) {
                    nextEpisodeButton.style.display = 'block';
                } else {
                    nextEpisodeButton.style.display = 'none';
                }
            }


            /**
             * Загружаем сохранённое время и устанавливаем значение в плеере
             */
            async function setCurrentTime() {
                const savedTime = await storage.get(`play-${seriesId}-time`);
                if (!seriesId || !episodeId || !savedTime) {
                    return;
                }

                if (savedTime.episodeId === episodeId) {
                    player.currentTime(Math.max(0, savedTime.time));
                }
            }


            /**
             * Сохранение текущей временной метки
             */
            async function saveCurrentTime({seriesId, episodeId, currentTime}: {
                seriesId: string,
                episodeId: string,
                currentTime: number,
            }) {

                if (!seriesId || !episodeId || !currentTime) {
                    return;
                }

                const savedTime = {
                    episodeId,
                    time: currentTime,
                };
                storage.set(`play-${seriesId}-time`, savedTime);
            }


            function initSaveFullScreenState() {
                player.on('fullscreenchange', () => {
                    storage.set(`play-fullscreen-state`, player.isFullscreen());
                });
            }


            /**
             * Функция автоматически запускает воспроизведение, если нет рекламной вставки
             */
            async function autoPlay() {
                if (!player || !player.concatenate || !player.concatenate.activated) {
                    return;
                }

                if (await storage.get(`play-fullscreen-state`) === true) {
                    player.requestFullscreen();
                }
                player.play();
            }


            if (isAutoPlay) {
                autoPlay();
            }


        } catch (error) {
            window.parent.postMessage({
                name: 'error',
                error: `${error.message}\n\n${error.stack}`,
            }, '*');
        }
    }
)();
