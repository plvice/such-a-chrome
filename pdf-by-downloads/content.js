
const container = document.createElement('div');
container.classList.add('heropdf');
document.body.appendChild(container);

const guid = 'c884efbe-1c7d-408c-ad42-85efa56cb78f';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request) {
        update(request);
    }
});

function update(data) {
    data.forEach(file => {
        if (file.id) {
            let element = document.querySelector(`[data-id="${guid}-${file.id}"]`);
            if (!element) {
                container.innerHTML += `<p class="${guid}" data-id="${guid}-${file.id}">${file.id}</p>`;
            }
        }
    })
}