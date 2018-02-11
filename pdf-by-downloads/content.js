const guid = 'c884efbe-1c7d-408c-ad42-85efa56cb78f';
const extensionId = 'oiljhhljfdjngigfghkiloeedgjkmddl';
const container = document.createElement('div');
const persistence = 120;
let files = [];

container.classList.add(`${guid}-container`);
document.body.appendChild(container);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request) {
        update(request);
    }
});

function update(request) {
    let html = '';
    files = request;

    files.forEach(file => {
        if (file.id) {
            html += 
            `<div class="${guid}-file" data-id="${file.id}" draggable="true">
                <div class="${guid}-filename">${file.id} <button type="button" data-button="${file.id}">Wyślij</button></div>
                <div class="${guid}-filepersistence">
                    <span class="${guid}-sidebar" style="width: ${file.time/persistence*100}%;">
                        ${file.time}
                    </span>
                </div>
            </div>`;
        }
    })
    container.innerHTML = html;
    bindEvents();
}

function bindEvents() {
    let items = document.querySelectorAll(`[data-button]`);

    items.forEach(item => {
        item.onclick = function() {
            let id = item.getAttribute('data-button');
            let file = files.filter((item) => {
                return item.id.toString() === id;
            })

            console.log(`clicked file id ${id}`);
            
            chrome.runtime.sendMessage(extensionId, { path: file[0].path }, 
                function responseCallback(response) {
                    console.log(response);
                })
        }
    })
}