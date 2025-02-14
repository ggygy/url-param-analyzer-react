import React, { useState, useEffect } from 'react';
import { ApiConfig } from '../../utils/contentScriptTool/types';
import { ConfigItem } from './components/ConfigItem/ConfigItem';
import { ConfigForm } from './components/ConfigForm/ConfigForm';
import './ConfigList.css';

interface ConfigListProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectConfig: (config: ApiConfig) => void;
  activeConfigIds: string[];
}

export const ConfigList: React.FC<ConfigListProps> = ({
  isVisible,
  onClose,
  onSelectConfig,
  activeConfigIds
}) => {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.sync.get(['apiConfigs'], (result) => {
      setConfigs(result.apiConfigs || []);
    });
  }, []);

  const handleSave = (updatedConfig: ApiConfig) => {
    const updatedConfigs = configs.map(c => 
      c.id === updatedConfig.id ? updatedConfig : c
    );
    chrome.storage.sync.set({ apiConfigs: updatedConfigs });
    setConfigs(updatedConfigs);
    setEditingId(null);
  };

  const handleAdd = (newConfig: ApiConfig) => {
    newConfig.id = Date.now().toString();
    const updatedConfigs = [...configs, newConfig];
    chrome.storage.sync.set({ apiConfigs: updatedConfigs });
    setConfigs(updatedConfigs);
  };

  if (!isVisible) return null;

  return (
    <div className="config-list-overlay">
      <div className="config-list-container">
        <div className="config-list-header">
          <h3 className="config-list-title">API 配置列表</h3>
          <button className="widget-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="config-list">
          {configs.map(config => (
            <ConfigItem
              key={config.id}
              config={config}
              isEditing={editingId === config.id}
              isActive={activeConfigIds.includes(config.id)}
              onEdit={() => setEditingId(config.id)}
              onDelete={() => {
                const updatedConfigs = configs.filter(c => c.id !== config.id);
                chrome.storage.sync.set({ apiConfigs: updatedConfigs });
                setConfigs(updatedConfigs);
              }}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
              onUse={() => onSelectConfig(config)}
            />
          ))}
        </div>

        <div className="add-config-section">
          <h4>添加新配置</h4>
          <ConfigForm
            onSubmit={handleAdd}
            submitText="添加配置"
          />
        </div>
      </div>
    </div>
  );
};
