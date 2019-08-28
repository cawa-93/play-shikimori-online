import {loadRuntimeMessages} from '@/background/loadRuntimeMessages';
import {local} from '@/helpers';


export async function loadBroadcast() {
    let {runtimeMessagesLastCheck} = await local.get('runtimeMessagesLastCheck');

    // Сохраняем время запуска для ограничения следующей итерации
    await local.set({
        runtimeMessagesLastCheck: Date.now(),
    });

    if (!runtimeMessagesLastCheck || isNaN(runtimeMessagesLastCheck)) {
        runtimeMessagesLastCheck = Date.now();
        return [];
    }

    return loadRuntimeMessages(runtimeMessagesLastCheck, 'broadcast');
}


setInterval(loadBroadcast, /* каждые 15 минут */1000 * 60 * 15);
