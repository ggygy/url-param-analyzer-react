import { useState, useEffect } from 'react';

type TabInfo = {
  url?: string;
  id?: number;
};

export const useChromeTabs = () => {
  const [currentTab, setCurrentTab] = useState<TabInfo>({});

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      setCurrentTab({
        url: tab.url,
        id: tab.id
      });
    });
  }, []);

  return { currentTab };
};