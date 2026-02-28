let latestData = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "DATA_CAPTURED") {
    latestData = message.data;
  }
  if (message.action === "GET_LATEST_DATA") {
    sendResponse(latestData);
  }
});
