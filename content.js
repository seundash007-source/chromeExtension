// content.js
let selectedText = "";

document.addEventListener('mouseup', () => {
    selectedText = window.getSelection().toString();
});

function extractText() {
    const bodyText = document.body.innerText;
    return bodyText;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractText") {
        const text = extractText();
        sendResponse({ text });
    }
});
