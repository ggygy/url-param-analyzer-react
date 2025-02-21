/* eslint-disable @typescript-eslint/no-explicit-any */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getNFESData') {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab?.id || -1 },
      func: () => {
        try {
          // 方法1: 直接从 window 对象获取
          if ((window as any).__NFES_DATA__) {
            return (window as any).__NFES_DATA__;
          }

          // 方法2: 通过查找 script 标签
          const scripts = document.querySelectorAll('script');
          for (const script of scripts) {
            const content = script.textContent || '';
            if (content.includes('__NFES_DATA__')) {
              const match = content.match(/window\.__NFES_DATA__\s*=\s*({[\s\S]*?});/);
              if (match && match[1]) {
                return JSON.parse(match[1]);
              }
            }
          }
          return null;
        } catch (error) {
          console.error('获取 NFES_DATA 失败:', error);
          return null;
        }
      }
    }).then(results => {
      if (results && results[0]) {
        sendResponse({ success: true, data: results[0].result });
      } else {
        sendResponse({ success: false, error: '获取数据失败' });
      }
    });
    return true;
  }
});
