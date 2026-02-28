document.addEventListener("DOMContentLoaded", async () => {
  const displayArea = document.getElementById("displayArea");

  chrome.runtime.sendMessage({ action: "GET_LATEST_DATA" }, (data) => {
    if (data) {
      const status_msg = data.status_msg || null;
      const total_correct = data.total_correct || 0;
      const total_testcases = data.total_testcases || 0;

      displayArea.innerHTML = `
                ${
                  status_msg === "Wrong Answer"
                    ? `<p style="color: #ce0d0d"><strong style="color: black">Status:</strong> ${status_msg}</p>
                    <p style="color: #1b50d5; font-style: italic;">
            Failures are nothing but steps towards success, so don't give up, 
            try to analyze where your code is failing.
           </p>`
                    : `<p style="color: #07a71a"><strong style="color: black">Status:</strong> ${status_msg}</p>
                    <p style="color: #d547e8; font-style: italic;">
            You are winning. You are one step closer to your dream role in your dream company!
           </p>`
                }
                <p><strong>Passed Testcases:</strong> ${total_correct}</p>
                <p><strong>Total Testcases:</strong> ${total_testcases}</p>
            `;
    } else {
      displayArea.innerText = "No submission data found yet. Submit a problem!";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const audioUpload = document.getElementById("audioUpload");
  const resetAudio = document.getElementById("resetAudio");

  audioUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 3) {
      alert(
        "Audio file's size is too big. Please select an audio file under 3 MB",
      );
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Audio = e.target.result;
      // Save the Base64 string to storage
      chrome.storage.local.set({ customAudio: base64Audio }, () => {
        alert("Custom sound saved!");
      });
    };
    reader.readAsDataURL(file); // Converts file to Base64 string
  });

  resetAudio.addEventListener("click", () => {
    chrome.storage.local.remove("customAudio", () => {
      alert("Reset to default sound.");
    });
  });
});
