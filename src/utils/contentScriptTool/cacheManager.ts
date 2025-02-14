const MAX_CACHE_ITEMS = 20; // 最大缓存数量

export const clearOldCache = async () => {
  // 获取所有缓存的keys
  const allItems = await chrome.storage.local.get(null);
  const cacheKeys = Object.keys(allItems).filter(key => key.startsWith('response_'));
  
  if (cacheKeys.length <= MAX_CACHE_ITEMS) {
    return;
  }

  // 获取所有缓存项及其时间戳
  const cacheItems = cacheKeys.map(key => ({
    key,
    timestamp: allItems[key].timestamp || 0
  }));

  // 按时间戳排序，保留最新的
  cacheItems.sort((a, b) => b.timestamp - a.timestamp);
  
  // 获取需要删除的keys
  const keysToRemove = cacheItems
    .slice(MAX_CACHE_ITEMS)
    .map(item => item.key);

  // 删除旧缓存
  await chrome.storage.local.remove(keysToRemove);
};
