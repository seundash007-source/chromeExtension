document.getElementById('readText').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const speed = parseFloat(document.getElementById('speed').value);
    const pitch = parseFloat(document.getElementById('pitch').value);
    const volume = parseFloat(document.getElementById('volume').value);

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (rate, pitch, volume) => {
        let text = window.getSelection().toString();
        if (!text) {
          text = document.body.innerText;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        window.speechSynthesis.cancel(); // stop any existing speech
        window.speechSynthesis.speak(utterance);
      },
      args: [speed, pitch, volume]
    });
  });
});
