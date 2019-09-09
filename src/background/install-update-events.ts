import {local, sync} from '@/helpers/chrome-storage';
import {push} from '@/helpers/runtime-messages';
import {versionCompare} from '@/helpers/version-compare';
// @ts-ignore
import storage from 'kv-storage-polyfill';
import {SelectedTranslation} from '../../types/UI';

/**
 * Отслеживание установок и обновлений
 */
chrome.runtime.onInstalled.addListener(async ({reason, previousVersion}: chrome.runtime.InstalledDetails) => {
    // reason = ENUM "install", "update", "chrome_update", or "shared_module_update"

    if (reason === 'install') {
        // Сохраняем время установки расширения
        await sync.set({
            installAt: Date.now(),
        });

        // Загружать сообщения из рассылки начиная с времени установки
        await local.set({
            runtimeMessagesLastCheck: Date.now(),
        });
    }

    // Создаем сообщение об обновлении
    if (reason === 'update') {
        const manifest = chrome.runtime.getManifest();
        await push({
            id: 'runtime-message-update',
            color: 'success',
            html: `${manifest.name} обновлен до версии <b>${manifest.version}</b><br><b><a class="white--text" href="https://github.com/cawa-93/play-shikimori-online/releases/tag/v${manifest.version}">Подробнее об изменениях →</a></b>`,
        });


        /**
         * Если предыдущая версия 1.1.1 или ниже — перенести историю выбранных переводов
         * из kv-storage в chrome.storage.sync
         */
        if (previousVersion && versionCompare(previousVersion, '1.1.1') <= 0) {
            const lastSelectedTranslations: Map<number, anime365.Translation>
                = await storage.get('lastSelectedTranslations');

            if (lastSelectedTranslations && lastSelectedTranslations.size > 0) {

                const newHistoryOfTranslations: SelectedTranslation[] = [];
                lastSelectedTranslations.forEach((translation) => {
                    newHistoryOfTranslations.push({
                        tId: translation.id,
                        id: translation.seriesId,
                        eId: translation.episodeId,
                        author: translation.authorsSummary,
                        type: translation.type,
                        priority: translation.priority,
                    });
                });

                /**
                 * Пытаемся сохранить массив значений в хранилище
                 * Если размер массива превышает квоту — удалить самую старую запись и повторить попытку
                 */
                while (newHistoryOfTranslations.length > 0) {
                    try {
                        await sync.set({selectedTranslations: newHistoryOfTranslations});
                        break;
                    } catch (error) {
                        if (error.message.indexOf('QUOTA_BYTES') !== -1) {
                            newHistoryOfTranslations.shift();
                        } else {
                            throw error;
                        }
                    }
                }

                await storage.delete('lastSelectedTranslations');
            }


        }
    }

});
