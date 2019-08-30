import {local, sync} from '@/helpers/chrome-storage';
import {push} from '@/helpers/runtime-messages';

/**
 * Отслеживание установок и обновлений
 */
chrome.runtime.onInstalled.addListener(({reason}: chrome.runtime.InstalledDetails) => {
    // reason = ENUM "install", "update", "chrome_update", or "shared_module_update"

    if (reason === 'install') {
        // Сохраняем время установки расширения
        sync.set({
            installAt: Date.now(),
        });

        // Загружать сообщения из рассылки начиная с времени установки
        local.set({
            runtimeMessagesLastCheck: Date.now(),
        });
    }

    // Создаем сообщение об обновлении
    if (reason === 'update') {
        const manifest = chrome.runtime.getManifest();
        push({
            id: 'runtime-message-update',
            color: 'success',
            html: `${manifest.name} обновлен до версии <b>${manifest.version}</b><br><b><a class="white--text" href="https://github.com/cawa-93/play-shikimori-online/releases/tag/v${manifest.version}">Подробнее об изменениях →</a></b>`,
        });
    }

});
