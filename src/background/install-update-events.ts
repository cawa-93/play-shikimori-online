import {local, sync} from '@/helpers/chrome-storage';

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
    // if (reason === 'update') {
    //     const version = chrome.runtime.getManifest().version.replace(/\./g, '-');
    //     loadRuntimeMessages(0, `update-${version}`, 1);
    // }

});
