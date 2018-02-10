const persistenceTime = 120;
let files = [];

chrome.downloads.setShelfEnabled(false);

chrome.downloads.onCreated.addListener(response => {
  if (response.id && isPDF(response.mime)) {
    files.push({
      id: response.id,
      time: persistenceTime
    })

    chrome.tabs.getAllInWindow(tabs => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, files, function (response) {
          console.log(response);
        })
      })
    })
  }
})

chrome.downloads.onChanged.addListener(response => {
  console.log(response);
});

function isPDF(mime) {
  return mime.indexOf('pdf') !== -1;
}