
function getHeaderFromHeaders(headers, headerName) {
  for (var i = 0; i < headers.length; ++i) {
    var header = headers[i];
    if (header.name.toLowerCase() === headerName) {
      return header;
    }
  }
}

function isPdfFile(details) {
  var header = getHeaderFromHeaders(details.responseHeaders, 'content-type');
  if (header) {
    var headerValue = header.value.toLowerCase().split(';', 1)[0].trim();
    if (headerValue === 'application/pdf') {
      return true;
    }
    if (headerValue === 'application/octet-stream') {
      if (details.url.toLowerCase().indexOf('.pdf') > 0) {
        return true;
      }
      var cdHeader =
        getHeaderFromHeaders(details.responseHeaders, 'content-disposition');
      if (cdHeader && /\.pdf(["']|$)/i.test(cdHeader.value)) {
        return true;
      }
    }
  }
}

chrome.webRequest.onCompleted.addListener(function (details) {
  if (details.method === 'GET') {
    if (!isPdfFile(details)) {
      console.log('not pdf!');
      return;
    } else {
      console.log('pdf! downloading...');
      console.log(details);

      xhrGET(details.url, function(data){
        console.log('file downloaded');
        console.log(data.substr(0,100));
      }, function() {
        console.log('nie udało się go pobrać :-(');
      })
    }
  }

  // if (details.method === 'POST') {
  //   if (!isPdfFile(details)) {
  //     console.log('to nie pdf. sorki');
  //     return;
  //   } else {
  //     console.log('to pdf! rozpoczynam pobieranie...');
  //     console.log(details);

  //     // xhrGET(details.url, function(data){
  //     //   console.log('pobrałem plik. Dla wiarygodności pozwól mi pokazać pierwsze 100 znaków :-0')
  //     //   console.log(data.substr(0,100));
  //     // }, function() {
  //     //   console.log('nie udało się go pobrać :-(');
  //     // })
  //   }
  // }
},
  {
    urls: [
      '<all_urls>',
      'file://*/*.pdf',
      'file://*/*.PDF'
    ],
    types: ['main_frame', 'sub_frame']
  },
  ['responseHeaders']);

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