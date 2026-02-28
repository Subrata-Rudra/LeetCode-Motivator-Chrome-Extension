(function () {
  const { fetch: originalFetch } = window;

  window.fetch = async (...args) => {
    const url = args[0];

    const response = await originalFetch(...args);

    if (url.includes("/check")) {
      const clone = response.clone();
      clone.json().then((data) => {
        if (Object.hasOwn(data, "status_msg")) {
          window.postMessage(
            {
              type: "LEETCODE_API_RESPONSE",
              payload: data,
            },
            "*",
          );
        }
      });
    }

    return response;
  };
})();
