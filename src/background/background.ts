chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXECUTE_SCRIPT') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs[0]?.id) {
        sendResponse({ error: 'No active tab found' });
        return;
      }

      try {
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: new Function(`return (${message.payload})()`)
        });

        sendResponse({ data: result.result });
      } catch (error) {
        sendResponse({ error: error.message });
      }
    });

    return true; // 表示会异步发送响应
  }
});
