const persistenceTime = 120;
let files = [];

chrome.downloads.setShelfEnabled(false);

chrome.downloads.onCreated.addListener(response => {
  if (response.id && isPDF(response.mime)) {
    files.push({
      id: response.id,
      time: persistenceTime
    })

    sendFilesToView();
  }
})

//refresh persistence time
setInterval(() => {
  if (files.length > 0) {
    files.forEach((file, index) => {
      file.time = file.time - 1;

      if (file.time <= 0) {
        chrome.downloads.removeFile(file.id, function (response) {
          console.log(`File with ID ${response.id} removed.`)
        });
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

// chrome.downloads.onChanged.addListener(response => {
//   console.log(response);
// });