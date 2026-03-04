// 1. Inject the script into the page
const s = document.createElement("script");
s.src = chrome.runtime.getURL("inject.js");
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

window.addEventListener(
  "message",
  (event) => {
    if (event.data.type === "LEETCODE_API_RESPONSE") {
      // console.log("Captured Data in Content Script:", event.data.payload);

      const data = event.data.payload;

      if (
        Object.hasOwn(data, "task_name") &&
        Object.hasOwn(data, "status_msg") &&
        (event.data.payload.status_msg === "Accepted" ||
          event.data.payload.status_msg === "Wrong Answer")
      ) {
        if (event.data.payload.status_msg === "Accepted") {
          playSuccessSound();
        } else if (event.data.payload.status_msg === "Wrong Answer") {
          playTryAgainSound();
        }
        chrome.runtime.sendMessage({
          action: "DATA_CAPTURED",
          data: event.data.payload,
        });
      }
    }
  },
  false,
);

function playSuccessSound() {
  if (!chrome.runtime?.id || !chrome.storage) {
    // console.warn("Context invalidated. Playing default sound.");
    const audio = new Audio(chrome.runtime.getURL("success.mp3"));
    audio.play().catch(() => {});
    return;
  }

  chrome.storage.local.get(["customAudio"], (result) => {
    // If the storage call fails because of a reload, just play the default
    if (chrome.runtime.lastError) {
      const audio = new Audio(chrome.runtime.getURL("success.mp3"));
      audio.play();
      return;
    }

    const audioSource =
      result.customAudio || chrome.runtime.getURL("success.mp3");
    const audio = new Audio(audioSource);
    audio.volume = 0.5;
    audio.play().catch((err) => console.error("Audio playback failed:", err));
  });
}

function playTryAgainSound() {
  const url = chrome.runtime.getURL("FAAAH.mp3");
  const audio = new Audio(url);
  audio.play();
}
