import {local} from '@/helpers/chrome-storage';

async function setBadgeMessageCount() {
    const {runtimeMessages} = await local.get('runtimeMessages');
    if (!runtimeMessages || !Array.isArray(runtimeMessages)) {
        return chrome.browserAction.setBadgeText({text: ``});
    }

    const count = runtimeMessages.filter((m) => m.important).length;
    const text = count ? `${count}` : '';
    return chrome.browserAction.setBadgeText({text});
}


setBadgeMessageCount();

chrome.storage.onChanged.addListener(({runtimeMessages}) => {
    if (runtimeMessages) {
        return setBadgeMessageCount();
    }
});
