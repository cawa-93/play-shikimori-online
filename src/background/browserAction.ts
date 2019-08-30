chrome.browserAction.onClicked.addListener(() => { // Fired when User Clicks ICON
    const url = chrome.runtime.getURL('player.html#/history');
    chrome.tabs.create({url, active: true});
});
