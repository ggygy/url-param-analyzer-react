/* eslint-disable @typescript-eslint/no-explicit-any */
import { Widget } from '../components/Widget/Widget';
import { ConfigList } from '../components/ConfigList/ConfigList';
import { ResponsePanel } from '../components/ResponsePanel/ResponsePanel';
import { createRoot } from 'react-dom/client';
import { handleApiRequest } from '../utils/contentScriptTool/handleApiRequest';
import { createFloatingButton } from '../utils/contentScriptTool/createFloatingButton';
import { ResponseCache } from '../utils/contentScriptTool/types';
import { clearOldCache } from '../utils/contentScriptTool/cacheManager';
import { StorageManager } from '../utils/contentScriptTool/storageManager';
import { PriceCompareWidget } from '../components/PriceCompareWidget/PriceCompareWidget';
import { MountManager } from '../components/MountManager/MountManager';

// 创建弹层容器
const createModalContainer = () => {
  const container = document.createElement('div');
  container.id = 'api-data-widget';
  document.body.appendChild(container);
  return container;
};

const init = async () => {
  // 等待页面完全加载
  if (document.readyState !== 'complete') {
    window.addEventListener('load', init);
    return;
  }

  // 确保在页面完全加载后等待一小段时间，让其他动态内容加载
  await new Promise(resolve => setTimeout(resolve, 500));

  const button = createFloatingButton();
  const container = createModalContainer();
  const root = createRoot(container);
  
  let isVisible = false;
  let showConfigList = false;
  let showResponsePanel = true;  // 默认显示
  let responseCache: ResponseCache = {};
  let activeConfigIds: string[] = [];  // 新增：存储活动配置ID
  let showPriceCompare = false;
  let mountVisible = true; // 默认为 true

  // 加载初始状态
  const { mountVisible: storedMountVisible } = await chrome.storage.local.get('mountVisible');
  if (storedMountVisible !== undefined) {
    mountVisible = storedMountVisible;
  }

  const toggleMount = async () => {
    mountVisible = !mountVisible;
    await chrome.storage.local.set({ mountVisible });
    renderApp();
  };

  const toggleConfigActive = async (configId: string) => {
    const index = activeConfigIds.indexOf(configId);
    if (index === -1) {
      activeConfigIds.push(configId);
    } else {
      activeConfigIds.splice(index, 1);
    }
    
    await StorageManager.setActiveConfigIds(activeConfigIds);
    
    if (responseCache[configId]) {
      responseCache[configId].isActive = activeConfigIds.includes(configId);
      await clearOldCache();
      await chrome.storage.local.set({ [`response_${configId}`]: responseCache[configId] });
    }
  };

  // 加载初始状态
  const initialState = await StorageManager.loadInitialState();
  showResponsePanel = initialState.showResponsePanel;
  activeConfigIds = initialState.activeConfigIds;
  responseCache = initialState.responseCache;

  // 执行所有配置的请求
  for (const config of initialState.configs) {
    const { data, error } = await handleApiRequest(config, responseCache);
    if (!error && data) {
      responseCache[config.id] = await StorageManager.updateResponseCache(
        config,
        data,
        activeConfigIds
      );
    }
  }

  const renderApp = () => {
    root.render(
      <>
        <MountManager visible={mountVisible} />
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
            StorageManager.setShowResponsePanel(showResponsePanel);
            renderApp();
          }}
          showResponsePanel={showResponsePanel}
          onShowPriceCompare={() => {
            showPriceCompare = true;
            renderApp();
          }}
          mountVisible={mountVisible}
          onToggleMount={toggleMount}
        />
        <PriceCompareWidget
          isVisible={showPriceCompare}
          onClose={() => {
            showPriceCompare = false;
            renderApp();
          }}
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

  // 初始渲染
  renderApp();

  // 添加按钮点击事件
  button.addEventListener('click', () => {
    isVisible = !isVisible;
    renderApp();
  });
};

// 移除之前的初始化代码，使用新的初始化方式
init();

export {};