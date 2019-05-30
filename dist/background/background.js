chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.contentScriptQuery == 'fetchUrl') {

      console.log(request);

      fetch(request.url, request.options)
        .then(response => response.json())
        .then(response => sendResponse({ response }))
        .catch(error => sendResponse({ error }));

      return true;  // Will respond asynchronously.
    }
  }
);
