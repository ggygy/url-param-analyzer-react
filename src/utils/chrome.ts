export async function executeScriptInActivePage<T>(): Promise<T | null> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      type: 'EXECUTE_SCRIPT'
    }, (response) => {
      if (response.error) {
        console.error('执行脚本失败:', response.error);
        resolve(null);
      } else {
        resolve(response.data);
      }
    });
  });
}
