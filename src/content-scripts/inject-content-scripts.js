
const extensionId = (new URL(location.href)).searchParams.get('extension-id')
if (extensionId === chrome.runtime.id) {
  window.addEventListener('load', () => {
    const s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', chrome.runtime.getURL('content-scripts/anime365-player-events.js'));
    document.body.appendChild(s);
  });
}

