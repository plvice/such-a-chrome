const persistenceTime = 120;
let files = [];

chrome.downloads.setShelfEnabled(false);

chrome.downloads.onCreated.addListener(response => {
  if (response.id && isPDF(response.mime)) {
    files.push({
      id: response.id,
      time: persistenceTime
    })
  }
})

chrome.downloads.onChanged.addListener(response => {
  const fileIndex = files.findIndex((item) => {
    return item.id === response.id;
  })

  if (fileIndex !== -1) {
    if (response.filename && response.filename.current) {
      files[fileIndex].path = response.filename.current;
    }

    if (response.state && response.state.current === 'complete') {
      files[fileIndex].completed = true;
    }
  }
})

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.path) {
    xhrGET(message.path, function (success) {
      console.log('success');
      console.log(btoa(unescape(encodeURIComponent(success))).substr(0, 100));
    },
      function (err) {
        console.log(err);
      })
  }
})

//state refresh
setInterval(() => {

  //can send only completed downloads.
  files = files.filter(item => {
    return item.completed;
  })

  //refresh persistence time and remove files that are out of the time limit
  if (files.length > 0) {
    files.forEach((file, index) => {
      file.time = file.time - 1;

      if (file.time <= 0) {
        chrome.downloads.removeFile(file.id, response => {
          console.log(`File with ID ${response.id} removed.`)
        })
        files.splice(index, 1);
      }
    })
  }

  sendFilesToView();
}, 1000)

function sendFilesToView() {
  chrome.tabs.getAllInWindow(tabs => {
    tabs.forEach(tab => {
      if (tab.id >= 0) {
        chrome.tabs.sendMessage(tab.id, files);
      }
    })
  })
}

function isPDF(mime) {
  return mime.indexOf('pdf') !== -1;
}

function xhrGET(url, onSuccess, onFailure) {
  onSuccess = onSuccess || function _onSuccess(data) { };
  onFailure = onFailure || function _onFailure() { };

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  // if (xhr.overrideMimeType) {
  //   xhr.overrideMimeType('text/plain; charset=utf-8');
  // }

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 || xhr.status === 0) {
        onSuccess(xhr.responseText);
      } else {
        onFailure();
      }
    }
  };
  xhr.onerror = onFailure;
  xhr.ontimeout = onFailure;
  try {
    xhr.send(null);
  } catch (e) {
    onFailure();
  }
}