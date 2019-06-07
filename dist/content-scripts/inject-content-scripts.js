function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}
const extensionId = (new URL(location.href)).searchParams.get('extension-id')
if (extensionId === chrome.runtime.id) {
  injectScript(chrome.runtime.getURL('content-scripts/anime365-player-events.js'), 'body');
}
