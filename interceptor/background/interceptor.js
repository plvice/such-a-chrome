
// const guid = 'be5dd21e-c7e4-4633-bb8e-e022bc84d0e7';
// const con = document.createElement('div');
// con.classList.add(guid);
// document.body.appendChild(con);
// con.innerText += `<p>${data.url}</p>`;

chrome.webRequest.onBeforeRequest.addListener(beforeInterceptor, {
    urls: ['<all_urls>']
});

chrome.webRequest.onCompleted.addListener(completedInterceptor, {
    urls: ['<all_urls>']
});

function beforeInterceptor(data) {
    console.log('onBeforeRequest');
    console.log(data);
}

function completedInterceptor(data) {
    console.log('onCompleted');
    console.log(data);
}
