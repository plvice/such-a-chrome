let currentId = null;

window.addEventListener("load", function () {
  chrome.tabs.query(
    {
      currentWindow: true, 
      active : true
    },
    function(tabArray){
      currentId = tabArray[0].id;
      logId();
      onTabInit();
    }
  )
});

chrome.tabs.onSelectionChanged.addListener(function (tabId) {
  currentId = tabId;
  logId();
  onTabInit();
});

function logId() {
  console.log(`Current tab id: ${currentId}`);
}

function onTabInit() {
  chrome.debugger.attach({
    tabId: currentId
  }, '1.0', function() {
    chrome.debugger.sendCommand({ tabId: currentId }, "Network.enable");
    chrome.debugger.onEvent.addListener(onEvent);
  });
}

function onEvent(debuggeeId, message, params) {

    if (currentId != debuggeeId.tabId) {
        return;
    }

  // if (message == "Network.responseReceived") {
  //   chrome.debugger.sendCommand({
  //     tabId: debuggeeId.tabId
  //   }, "Network.getResponseBody", {
  //       "requestId": params.requestId
  //     }, function (response) {
  //       if (response) {
  //         console.log('mam responsa');
  //         console.log(response);
  //       } else {
  //         console.log('no response');
  //       }
  //     });
  // }

  if (message == "Network.loadingFinished") {
    chrome.debugger.sendCommand({
      tabId: debuggeeId.tabId
    }, "Network.getResponseBody", {
        "requestId": params.requestId
      }, function (response) {
        if (response) {
          if (response.base64Encoded === true) {
            console.log(atob(response.body).substr(0, 100));
          } else {
            console.log(response);
          }
        }
      });
  }
}