chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.contentScriptQuery == 'fetchUrl') {
      const url = request.url;


      fetch(request.url, request.options)
        .then(response => response.json())
        .then(response => sendResponse({ response }))
        .catch(error => { });

      return true;  // Will respond asynchronously.
    }
  }
);
