import { ApiConfig, ResponseCache } from './types';
import { defaultConfigs } from '../../configs/defaultConfigs';
import { clearOldCache } from './cacheManager';

export class StorageManager {
  static async loadInitialState() {
    try {
      const syncResult = await chrome.storage.sync.get([
        'showResponsePanel',
        'apiConfigs',
        'activeConfigIds',
        'isFirstLoad'
      ]);

      const responseCache: ResponseCache = {};
      const configs = syncResult.apiConfigs || [];
      const configIds = configs.map((config: ApiConfig) => config.id);
      const cacheKeys = configIds.map((id: string) => `response_${id}`);
      
      const localResult = await chrome.storage.local.get(cacheKeys);
      
      // 合并缓存数据
      Object.keys(localResult).forEach(key => {
        const configId = key.replace('response_', '');
        responseCache[configId] = localResult[key];
      });

      // 首次加载时初始化默认配置
      if (!syncResult.isFirstLoad || !syncResult.apiConfigs || syncResult.apiConfigs.length === 0) {
        const initialConfigs = defaultConfigs;
        await chrome.storage.sync.set({
          apiConfigs: initialConfigs,
          isFirstLoad: true
        });
        syncResult.apiConfigs = initialConfigs;
      }

      const showResponsePanel = syncResult.showResponsePanel ?? true;
      const activeConfigIds = syncResult.activeConfigIds || [];

      // 同步 responseCache 中的 isActive 状态
      Object.keys(responseCache).forEach(configId => {
        if (responseCache[configId]) {
          responseCache[configId].isActive = activeConfigIds.includes(configId);
        }
      });

      return {
        showResponsePanel,
        configs: syncResult.apiConfigs,
        activeConfigIds,
        responseCache
      };
    } catch (error) {
      console.error('Failed to load storage data:', error);
      return {
        showResponsePanel: true,
        configs: [],
        activeConfigIds: [],
        responseCache: {}
      };
    }
  }

  static async updateResponseCache(config: ApiConfig, data: object, activeConfigIds: string[]) {
    const cacheData = {
      data,
      timestamp: Date.now(),
      displayFields: config.displayFields,
      configName: config.name,
      isActive: activeConfigIds.includes(config.id)
    };

    await clearOldCache();
    await chrome.storage.local.set({ [`response_${config.id}`]: cacheData });
    return cacheData;
  }

  static async setActiveConfigIds(activeConfigIds: string[]) {
    await chrome.storage.sync.set({ activeConfigIds });
  }

  static async setShowResponsePanel(showResponsePanel: boolean) {
    await chrome.storage.sync.set({ showResponsePanel });
  }
}
