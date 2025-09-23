const voiceSelect = document.getElementById('voiceSelect');
const speedSlider = document.getElementById('speed');
const pitchSlider = document.getElementById('pitch');
const volumeSlider = document.getElementById('volume');

// Update slider value displays
speedSlider.addEventListener('input', (e) => {
  document.getElementById('speedValue').innerText = e.target.value;
});
pitchSlider.addEventListener('input', (e) => {
  document.getElementById('pitchValue').innerText = e.target.value;
});
volumeSlider.addEventListener('input', (e) => {
  document.getElementById('volumeValue').innerText = e.target.value;
});

// Populate available voices into dropdown
let availableVoices = [];

function populateVoiceList() {
  availableVoices = window.speechSynthesis.getVoices();

  // If voices are not loaded yet, try again shortly
  if (!availableVoices.length) {
    setTimeout(populateVoiceList, 100);
    return;
  }

  voiceSelect.innerHTML = '';
  availableVoices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' — DEFAULT' : ''}`;
    voiceSelect.appendChild(option);
  });
}

// Some browsers don't fire voiceschanged reliably
window.speechSynthesis.onvoiceschanged = populateVoiceList;
populateVoiceList();

// Read text aloud
document.getElementById('readText').addEventListener('click', () => {
  const speed = parseFloat(speedSlider.value);
  const pitch = parseFloat(pitchSlider.value);
  const volume = parseFloat(volumeSlider.value);
  const voiceIndex = parseInt(voiceSelect.value);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (rate, pitch, volume, voiceIndex) => {
        const voices = window.speechSynthesis.getVoices();
        let text = window.getSelection().toString();
        if (!text) {
          text = document.body.innerText;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        if (voices.length && voices[voiceIndex]) {
          utterance.voice = voices[voiceIndex];
        }

        window.speechSynthesis.cancel(); // stop any ongoing speech
        window.speechSynthesis.speak(utterance);
      },
      args: [speed, pitch, volume, voiceIndex]
    });
  });
});

// Stop speech
document.getElementById('stopSpeech').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        window.speechSynthesis.cancel();
      }
    });
  });
});

// Extract full text from page and display it
document.getElementById('extractText').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extractText" }, (response) => {
      if (response && response.text) {
        document.getElementById('extractedText').innerText = response.text;
      } else {
        document.getElementById('extractedText').innerText = 'No text found or content script not working.';
      }
    });
  });
});
