// background.js
// Empty for now, but this is where you could add event listeners for background tasks.
chrome.commands.onCommand.addListener((command) => {
  if (command === "read-selected-text") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          let text = window.getSelection().toString();
          if (!text) {
            text = document.body.innerText;
          }

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1;
          utterance.pitch = 1;
          utterance.volume = 1;

          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            utterance.voice = voices.find(v => v.default) || voices[0];
          }

          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        }
      });
    });
  }
});
