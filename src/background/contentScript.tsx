/* eslint-disable @typescript-eslint/no-explicit-any */
import { Widget } from '../components/Widget/Widget';
import { ConfigList } from '../components/ConfigList/ConfigList';
import { ResponsePanel } from '../components/ResponsePanel/ResponsePanel';
import { createRoot } from 'react-dom/client';
import { handleApiRequest } from '../utils/contentScriptTool/handleApiRequest';
import { createFloatingButton } from '../utils/contentScriptTool/createFloatingButton';
import { ResponseCache } from '../utils/contentScriptTool/types';
import { defaultConfigs } from '../configs/defaultConfigs';

// 创建弹层容器
const createModalContainer = () => {
  const container = document.createElement('div');
  container.id = 'api-data-widget';
  document.body.appendChild(container);
  return container;
};

const init = async () => {
  const button = createFloatingButton();
  const container = createModalContainer();
  const root = createRoot(container);
  
  let isVisible = false;
  let showConfigList = false;
  let showResponsePanel = true;  // 默认显示
  let responseCache: ResponseCache = {};
  let activeConfigIds: string[] = [];  // 新增：存储活动配置ID

  const toggleConfigActive = async (configId: string) => {
    const index = activeConfigIds.indexOf(configId);
    if (index === -1) {
      activeConfigIds.push(configId);
    } else {
      activeConfigIds.splice(index, 1);
    }
    
    // 保存活动状态到storage
    await chrome.storage.sync.set({ activeConfigIds });
    
    if (responseCache[configId]) {
      responseCache[configId].isActive = activeConfigIds.includes(configId);
      await chrome.storage.sync.set({ responseCache });
    }
  };

  const renderApp = () => {
    root.render(
      <>
        <Widget 
          isVisible={isVisible}
          onClose={() => {
            isVisible = false;
            renderApp();
          }}
          onShowConfigs={() => {
            showConfigList = true;
            renderApp();
          }}
          onToggleResponsePanel={() => {
            showResponsePanel = !showResponsePanel;
            chrome.storage.sync.set({ showResponsePanel });
            renderApp();
          }}
          showResponsePanel={showResponsePanel}
        />
        <ConfigList
          isVisible={showConfigList}
          onClose={() => {
            showConfigList = false;
            renderApp();
          }}
          onSelectConfig={async (config) => {
            const { data, cache, error } = await handleApiRequest(config, responseCache);
            if (!error && data) {
              responseCache = cache;
              await toggleConfigActive(config.id);
            }
            renderApp();
          }}
          activeConfigIds={activeConfigIds}
        />
        <ResponsePanel
          isVisible={showResponsePanel}
          responseCache={responseCache}
        />
      </>
    );
  };

  // 从 storage 加载设置和缓存
  try {
    const result = await chrome.storage.sync.get([
      'showResponsePanel', 
      'apiConfigs', 
      'responseCache',
      'activeConfigIds',  // 新增：加载活动配置ID
      'isFirstLoad'  // 添加首次加载标志
    ]);

    // 首次加载时初始化默认配置
    if (!result.isFirstLoad || !result.apiConfigs || result.apiConfigs.length === 0) {
      const initialConfigs = defaultConfigs;
      await chrome.storage.sync.set({ 
        apiConfigs: initialConfigs,
        isFirstLoad: true 
      });
      result.apiConfigs = initialConfigs;
    }

    showResponsePanel = result.showResponsePanel ?? true;  // 如果未设置则默认为 true
    responseCache = result.responseCache || {};
    activeConfigIds = result.activeConfigIds || [];  // 新增：初始化活动配置ID
    
    // 同步responseCache中的isActive状态
    Object.keys(responseCache).forEach(configId => {
      if (responseCache[configId]) {
        responseCache[configId].isActive = activeConfigIds.includes(configId);
      }
    });
    
    // 执行所有配置的请求
    const configs = result.apiConfigs || [];
    for (const config of configs) {
      const { data, error } = await handleApiRequest(config, responseCache);
      if (!error && data) {
        responseCache[config.id] = {
          data,
          timestamp: Date.now(),
          displayFields: config.displayFields,
          configName: config.name
        };
      }
    }

    await chrome.storage.sync.set({ responseCache });
    renderApp();  // 渲染所有配置的响应
  } catch (error) {
    console.error('Failed to load storage data:', error);
  }

  // 初始渲染
  renderApp();

  // 添加按钮点击事件
  button.addEventListener('click', () => {
    isVisible = !isVisible;
    renderApp();
  });
};

// 等待DOM加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export {};