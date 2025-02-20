export async function executeScriptInActivePage<T>(func: () => T): Promise<T | null> {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'EXECUTE_SCRIPT',
      payload: func.toString()
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data;
  } catch (error) {
    console.error('Failed to execute script:', error);
    return null;
  }
}
