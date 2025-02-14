/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { ResponseCache } from '../../utils/contentScriptTool/types';
import './ResponsePanel.css';

interface ResponsePanelProps {
    responseCache: ResponseCache;
    isVisible: boolean;
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({
    responseCache,
    isVisible
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeConfigIds, setActiveConfigIds] = useState<string[]>([]);

    useEffect(() => {
        // 从存储中加载活动配置ID
        chrome.storage.sync.get(['activeConfigIds'], (result) => {
            setActiveConfigIds(result.activeConfigIds || []);
        });

        // 监听存储变化
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            if (changes.activeConfigIds) {
                setActiveConfigIds(changes.activeConfigIds.newValue || []);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, []);

    if (!isVisible) return null;

    const getNestedValue = (obj: any, path: string) => {
        try {
            // 处理数组索引的正则表达式
            const arrayIndexRegex = /\[(\d+)\]/g;

            // 将数组索引格式转换为点号格式
            const normalizedPath = String(path).replace(arrayIndexRegex, '.$1');

            // 分割路径
            const parts = normalizedPath.split('.');
            // 递归获取值
            return parts.reduce((acc, part) => {
                if (acc === null || acc === undefined) return acc;
                return acc[part];
            }, obj);
        } catch (error) {
            console.error('Error getting nested value:', error);
            return undefined;
        }
    };

    const activeConfigs = Object.entries(responseCache)
        .filter(([configId]) => activeConfigIds.includes(configId));

    if (activeConfigs.length === 0) {
        return (
            <div className="response-panel-container">
                <div className="response-panel-header">
                    <h3 className="response-panel-title">已配置接口响应</h3>
                    <button
                        className="response-panel-collapse-btn"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? '展开' : '收起'}
                    </button>
                </div>
                <div className={`response-panel-content ${isCollapsed ? 'collapsed' : ''}`}>
                    <div className="response-panel-empty">
                        请在配置列表中选择要显示的配置项
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="response-panel-container">
            <div className="response-panel-header">
                <h3 className="response-panel-title">已配置接口响应</h3>
                <button
                    className="response-panel-collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? '展开' : '收起'}
                </button>
            </div>
            <div className={`response-panel-content ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="response-panel-content-wrapper">
                    <div className="response-panel-content">
                        {activeConfigs.map(([configId, cacheItem]) => (
                            <div key={configId} className="config-response-section">
                                <div className="config-response-header">
                                    {cacheItem.configName}
                                </div>
                                {cacheItem.displayFields.map(field => {
                                    const value = getNestedValue(cacheItem.data, field.path);
                                    return (
                                        <div key={field.path} className="response-field">
                                            <div className="response-field-header">
                                                {/* <div className="response-field-label">{field.path}</div> */}
                                                {field.description && (
                                                    <div className="response-field-description">
                                                        {field.description}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="response-field-value">
                                                {JSON.stringify(value)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
