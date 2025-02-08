/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import './ConfigList.css';
import { ApiConfig, DisplayField } from '../../utils/contentScriptTool/types';

interface ConfigListProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectConfig: (config: ApiConfig) => void;
  activeConfigIds: string[]; // 添加新的 prop
}

export const ConfigList: React.FC<ConfigListProps> = ({ 
  isVisible, 
  onClose, 
  onSelectConfig,
  activeConfigIds 
}) => {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [newConfig, setNewConfig] = useState<Partial<ApiConfig>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingConfig, setEditingConfig] = useState<ApiConfig | null>(null);  // 新增编辑状态

  useEffect(() => {
    // 从 chrome.storage 加载配置
    chrome.storage.sync.get(['apiConfigs'], (result) => {
      setConfigs(result.apiConfigs || []);
    });
  }, []);

  const validateDisplayFields = (fields: DisplayField[]) => {
    return fields.filter(field => {
      const isValid = /^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+|\[\d+\])*$/.test(field.path);
      if (!isValid && field.path.trim() !== '') {
        console.warn(`Invalid field path: ${field.path}`);
      }
      return isValid;
    });
  };

  const handleAddConfig = () => {
    if (!newConfig.name || !newConfig.url) return;
    
    const validFields = validateDisplayFields(
      newConfig.displayFields?.filter(field => field.path) || []
    );

    if (validFields.length === 0) {
      alert('请至少添加一个有效的显示字段路径');
      return;
    }
    
    const config: ApiConfig = {
      id: Date.now().toString(),
      name: newConfig.name,
      url: newConfig.url,
      method: newConfig.method || 'POST',  // 设置默认值
      params: newConfig.params || {},
      token: newConfig.token,
      displayFields: validFields
    };

    const updatedConfigs = [...configs, config];
    chrome.storage.sync.set({ apiConfigs: updatedConfigs });
    setConfigs(updatedConfigs);
    setNewConfig({});
  };

  const handleSave = () => {
    if (!editingConfig) return;
    
    const validFields = validateDisplayFields(
      editingConfig.displayFields.filter(field => field.path)
    );

    if (validFields.length === 0) {
      alert('请至少添加一个有效的显示字段路径');
      return;
    }

    const updatedConfig = {
      ...editingConfig,
      displayFields: validFields
    };
    
    const updatedConfigs = configs.map(c => 
      c.id === updatedConfig.id ? updatedConfig : c
    );
    chrome.storage.sync.set({ apiConfigs: updatedConfigs });
    setConfigs(updatedConfigs);
    setEditingId(null);
    setEditingConfig(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingConfig(null);
  };

  const startEditing = (config: ApiConfig) => {
    setEditingId(config.id);
    setEditingConfig({...config});  // 创建配置的副本
  };

  const handleDeleteConfig = (id: string) => {
    const updatedConfigs = configs.filter(c => c.id !== id);
    chrome.storage.sync.set({ apiConfigs: updatedConfigs });
    setConfigs(updatedConfigs);
  };

  const handleFieldsChange = (value: string, description: string, isEditing: boolean = false) => {
    const fields = value.split(',')
      .map(f => f.trim())
      .filter(f => f !== '')
      .map(path => ({ path, description }));
    
    if (isEditing && editingConfig) {
      setEditingConfig(prev => 
        prev ? {
          ...prev,
          displayFields: fields
        } : prev
      );
    } else {
      setNewConfig({
        ...newConfig,
        displayFields: fields
      });
    }
  };

  const handleUseConfig = (config: ApiConfig) => {
    onSelectConfig(config);  // 触发父组件的请求和更新操作
  };

  if (!isVisible) return null;

  return (
    <div className="config-list-overlay">
      <div className="config-list-container">
        <div className="config-list-header">
          <h3 className="config-list-title">API 配置列表</h3>
          <div className="config-list-subtitle">
            包含示例配置，可编辑或添加新配置
          </div>
          <button className="widget-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="config-list">
          {configs.map(config => (
            <div 
              key={config.id} 
              className={`config-item ${activeConfigIds.includes(config.id) ? 'config-item-selected' : ''}`}
            >
              {editingId === config.id ? (
                <div className="config-edit-form">
                  <input
                    value={editingConfig?.name || ''}
                    onChange={e => setEditingConfig(prev => 
                      prev ? {...prev, name: e.target.value} : prev
                    )}
                    placeholder="配置名称"
                  />
                  <select
                    value={editingConfig?.method || 'POST'}
                    onChange={e => setEditingConfig(prev => 
                      prev ? {...prev, method: e.target.value as 'GET' | 'POST'} : prev
                    )}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                  <input
                    value={editingConfig?.url || ''}
                    onChange={e => setEditingConfig(prev => 
                      prev ? {...prev, url: e.target.value} : prev
                    )}
                    placeholder="API URL"
                  />
                  <textarea
                    value={JSON.stringify(editingConfig?.params || {}, null, 2)}
                    onChange={e => {
                      try {
                        const params = JSON.parse(e.target.value);
                        setEditingConfig(prev => 
                          prev ? {...prev, params} : prev
                        );
                      } catch {
                        console.log('Invalid JSON');
                      }
                    }}
                    placeholder="参数 (JSON格式)"
                  />
                  <input
                    value={editingConfig?.token || ''}
                    onChange={e => setEditingConfig(prev => 
                      prev ? {...prev, token: e.target.value} : prev
                    )}
                    placeholder="Token (可选)"
                  />
                  <div className="field-input-container">
                    <div className="field-row">
                      <div className="field-column">
                        <label>字段路径</label>
                        <input
                          value={editingConfig?.displayFields.map(f => f.path).join(',')}
                          onChange={e => handleFieldsChange(e.target.value, editingConfig?.displayFields[0]?.description || '', true)}
                          placeholder="data.list.id, data.name"
                        />
                      </div>
                      <div className="field-column">
                        <label>字段说明</label>
                        <input
                          value={editingConfig?.displayFields[0]?.description || ''}
                          onChange={e => handleFieldsChange(
                            editingConfig?.displayFields.map(f => f.path).join(',') || '',
                            e.target.value,
                            true
                          )}
                          placeholder="例如：用户ID, 用户名称"
                        />
                      </div>
                    </div>
                    <div className="field-input-help">
                      支持的格式: data.list.id, response.items[0].name
                    </div>
                  </div>
                  <div className="config-actions">
                    <button onClick={handleSave}>保存</button>
                    <button onClick={handleCancel}>取消</button>
                  </div>
                </div>
              ) : (
                <>
                  <h4>{config.name}</h4>
                  <div className="config-method">{config.method}</div>
                  <div className="config-url">{config.url}</div>
                  <div className="config-fields">
                    字段配置: 
                    {config.displayFields.map((field, index) => (
                      <span key={field.path} className="field-tag">
                        <span className="field-tag-path">{field.path}</span>
                        {field.description && (
                          <span className="field-tag-description">({field.description})</span>
                        )}
                        {index < config.displayFields.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                  <div className="config-actions">
                    <button onClick={() => startEditing(config)}>编辑</button>
                    <button onClick={() => handleDeleteConfig(config.id)}>删除</button>
                    <button 
                      className={activeConfigIds.includes(config.id) ? 'config-button-active' : ''}
                      onClick={() => handleUseConfig(config)}
                    >
                      {activeConfigIds.includes(config.id) ? '取消' : '使用'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="add-config-form">
          <h4>添加新配置</h4>
          <input
            placeholder="配置名称"
            value={newConfig.name || ''}
            onChange={e => setNewConfig({...newConfig, name: e.target.value})}
          />
          <select
            value={newConfig.method || 'POST'}
            onChange={e => setNewConfig({...newConfig, method: e.target.value as 'GET' | 'POST'})}
            className="method-select"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
          <input
            placeholder="API URL"
            value={newConfig.url || ''}
            onChange={e => setNewConfig({...newConfig, url: e.target.value})}
          />
          <textarea
            placeholder="参数 (JSON格式)"
            value={JSON.stringify(newConfig.params || {}, null, 2)}
            onChange={e => {
              try {
                const params = JSON.parse(e.target.value);
                setNewConfig({...newConfig, params});
              } catch {
                console.log('Invalid JSON');
              }
            }}
          />
          <input
            placeholder="Token (可选)"
            value={newConfig.token || ''}
            onChange={e => setNewConfig({...newConfig, token: e.target.value})}
          />
          <div className="field-input-container">
            <div className="field-row">
              <div className="field-column">
                <label>字段路径</label>
                <input
                  placeholder="例如：data.list.id, data.name"
                  value={newConfig.displayFields?.map(f => f.path).join(',') || ''}
                  onChange={e => handleFieldsChange(e.target.value, '')}
                />
              </div>
              <div className="field-column">
                <label>字段说明</label>
                <input
                  placeholder="例如：用户ID, 用户名称"
                  value={newConfig.displayFields?.[0]?.description || ''}
                  onChange={e => handleFieldsChange(
                    newConfig.displayFields?.map(f => f.path).join(',') || '',
                    e.target.value
                  )}
                />
              </div>
            </div>
            <div className="field-input-help">
              字段路径支持格式: data.list.id, data.items[0].name
            </div>
          </div>
          <button onClick={handleAddConfig}>添加配置</button>
        </div>
      </div>
    </div>
  );
};
