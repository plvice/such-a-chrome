
var requestData = {

};

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
  // console.log(details);
  // if (!isPdfFile(details)) {
    // console.log('not pdf!');
    // return;
  // } else {
    // console.log('onCompleted');
    // console.log('pdf! downloading...');
    // console.log(details);
  // }

  if(details.initiator.indexOf('chrome') === -1) {
  //   if (details.method === 'GET') {
  //     console.log('using GET');
  //     xhrGET(details.url, function (data) {
  //       console.log('data:');
  //       console.log(data.substr(0, 100));
  //     }, function () {
  //       console.error('pdf download failure');
  //     })
  //   }

    var dataToPost = requestData[details.requestId];

    if (dataToPost && details.method === 'POST') {
      console.log('using POST');
      xhrPOST(dataToPost, details.url, function (data) {
        console.log('data:');
        console.log(data.substr(0, 100));
      }, function () {
        console.error('pdf download failure');
      })
    } else {
      console.log('Nie znaleziono danych dla podanego requestId');
    }
  }


},
  {
    urls: [
      '<all_urls>',
      'file://*/*.pdf',
      'file://*/*.PDF'
    ],
  },
  ['responseHeaders']);

// chrome.webRequest.onResponseStarted.addListener(function (details) {
//   console.log('onResponseStarted');
//   console.log(details);
// },
//   {
//     urls: ['<all_urls>'],
//   },
//   ['responseHeaders']);

// chrome.webRequest.onHeadersReceived.addListener(function (details) {
//   console.log('onHeadersReceived');
//   console.log(details);
// },
//   {
//     urls: ['<all_urls>'],
//   },
//   ['blocking', 'responseHeaders']);


// chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
//   console.log('onBeforeSendHeaders');
//   console.log(details);
// },
// {
//   urls: ['<all_urls>']
// },
// ['requestHeaders','blocking']);

// chrome.webRequest.onSendHeaders.addListener(function(details){
//   console.log('onSendHeaders');
//   console.log(details);
// },
// {
//   urls: ['<all_urls>']
// },
// ['requestHeaders']);

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  console.log('onBeforeRequest');
  console.log(details);
  requestData[details.requestId.toString()] = details.requestBody;
},
{
  urls: ['<all_urls>']
},
['requestBody', 'blocking']);


function xhrPOST(data, url, onSuccess, onFailure) {
  onSuccess = onSuccess || function _onSuccess(data) { };
  onFailure = onFailure || function _onFailure() { };

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');

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
    xhr.send(data);
  } catch (e) {
    onFailure();
  }
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