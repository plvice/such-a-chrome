const guid = 'c884efbe-1c7d-408c-ad42-85efa56cb78f';
const container = document.createElement('div');
const persistence = 120;

container.classList.add(`${guid}-container`);
document.body.appendChild(container);


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request) {
        update(request);
    }
});

function update(files) {
    let html = '';
    files.forEach(file => {
        if (file.id) {
            html += 
            `<div class="${guid}-file" data-id="${guid}-${file.id}">
                <div class="${guid}-filename">${file.id}</div>
                <div class="${guid}-filepersistence">
                    <span class="${guid}-sidebar" style="width: ${file.time/persistence*100}%;">
                        ${file.time}
                    </span>
                </div>
            </div>`;
        }
    })
    container.innerHTML = html;
}