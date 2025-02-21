/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { fetchData } from '../../services/api';
import { MountManager } from '../MountManager/MountManager';
import './Widget.css';
import { ABTestInfo } from '../ABTestInfo/ABTestInfo';
import { getNFESData } from '../../utils/getNFESData';

interface WidgetProps {
  isVisible: boolean;
  onClose: () => void;
  onShowConfigs: () => void;
  onToggleResponsePanel: () => void;
  showResponsePanel: boolean;
  onShowPriceCompare: () => void;
  mountVisible: boolean;
  onToggleMount: () => void;
}

export const Widget: React.FC<WidgetProps> = ({
  isVisible,
  onClose,
  onShowConfigs,
  onToggleResponsePanel,
  showResponsePanel,
  onShowPriceCompare,
  mountVisible,
  onToggleMount,
}) => {
  const [url, setUrl] = useState('');
  const [params, setParams] = useState('');
  const [token, setToken] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST'>('POST');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState<any>(null);
  const [showABTest, setShowABTest] = useState(false);
  const [vid, setVid] = useState<string>('');
  
  useEffect(() => {
    const fetchNFESData = async () => {
      const data = await getNFESData();
      const ubtVid = data?.query?.envObj?.cookie?.UBT_VID || '';
      setVid(ubtVid);
    };
    
    fetchNFESData();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      let parsedParams = {};
      try {
        parsedParams = params ? JSON.parse(params) : {};
      } catch {
        setError('Invalid JSON params');
        return;
      }

      const { data, error: fetchError } = await fetchData(parsedParams, url, method, token);
      if (fetchError) {
        setError(fetchError);
      } else {
        setCurrentResponse(data);
        // 保存成功的请求到历史记录
        saveToHistory({
          url,
          method,
          params: parsedParams,
          token,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (record: any) => {
    chrome.storage.local.get(['requestHistory'], (result) => {
      const history = result.requestHistory || [];
      const newHistory = [record, ...history].slice(0, 50); // 只保留最近50条
      chrome.storage.local.set({ requestHistory: newHistory });
    });
  };

  const clearForm = () => {
    setUrl('');
    setParams('');
    setToken('');
    setMethod('POST');
    setError(null);
  };

  if (!isVisible) return null;

  return (
    <>
      <MountManager visible={mountVisible} />
      <div className="widget-overlay">
        <div className="widget-container">
          <button className="widget-close" onClick={onClose}>&times;</button>
          <div className="widget-header">
            <h3 className="widget-title">API 请求工具</h3>
            {vid && (
              <div className="widget-vid">
                <span className="widget-vid-label">VID:</span>
                <span className="widget-vid-value">{vid}</span>
              </div>
            )}
          </div>
          <div className="widget-actions">
            <button
              className="widget-button"
              onClick={() => setShowABTest(true)}
            >
              AB Test 信息
            </button>
            <button
              className="widget-button"
              onClick={onShowPriceCompare}
            >
              房价一致率比对
            </button>
            <button
              className={`widget-button ${showResponsePanel ? 'active' : ''}`}
              onClick={onToggleResponsePanel}
            >
              {showResponsePanel ? '隐藏响应面板' : '显示响应面板'}
            </button>
            <button className="widget-button" onClick={onShowConfigs}>
              配置列表
            </button>
            <button className="widget-button" onClick={clearForm}>
              清空表单
            </button>
            <button
              className={`widget-button ${mountVisible ? 'active' : ''}`}
              onClick={onToggleMount}
            >
              {mountVisible ? '取消挂载' : '挂载按钮'}
            </button>
          </div>

          <ABTestInfo
            isVisible={showABTest}
            onClose={() => setShowABTest(false)}
          />

          <div className="widget-input-group">
            <label>Method:</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as 'GET' | 'POST')}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
          </div>

          <div className="widget-input-group">
            <label>URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="输入API地址"
            />
          </div>

          <div className="widget-input-group">
            <label>Params {method === 'POST' ? '(JSON)' : '(Query String)'}:</label>
            <textarea
              value={params}
              onChange={(e) => setParams(e.target.value)}
              placeholder={method === 'POST' ? "输入JSON格式的参数" : "key1=value1&key2=value2"}
            />
          </div>

          <div className="widget-input-group">
            <label>Token:</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="输入认证token（可选）"
            />
          </div>

          <button
            className={`widget-submit ${loading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '请求中...' : '发送请求'}
          </button>

          {error && (
            <div className="widget-error">
              Error: {error}
            </div>
          )}

          {/* 添加响应数据显示部分 */}
          <div className="widget-response">
            <h4>响应数据</h4>
            <pre>
              {JSON.stringify(currentResponse, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
};
