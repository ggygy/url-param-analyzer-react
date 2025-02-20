/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { executeScriptInActivePage } from '../../utils/chrome';
import { getABTestDataFromPage } from '../../scripts/getABTestData';
import './ABTestInfo.css';

interface ABTestData {
  showAdvantagePositionInfoAB?: {
    expCode: string;
    description: string;
    result: {
      expCode: string;
      version: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

interface ABTestInfoProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ABTestInfo: React.FC<ABTestInfoProps> = ({ isVisible, onClose }) => {
  const [abTestData, setABTestData] = useState<ABTestData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      fetchABTestData();
    }
  }, [isVisible]);

  const fetchABTestData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await executeScriptInActivePage(getABTestDataFromPage);
      setABTestData(data);
    } catch (err) {
      setError('获取 AB 测试数据失败');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="ABTestInfo-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ABTestInfo-modal">
        <button className="ABTestInfo-close" onClick={onClose} aria-label="关闭">&times;</button>
        <div className="ABTestInfo-header">
          <h3 className="ABTestInfo-title">AB Test 信息</h3>
        </div>
        <div className="ABTestInfo-content">
          {isLoading ? (
            <div className="ABTestInfo-loading">加载中...</div>
          ) : error ? (
            <div className="ABTestInfo-error">{error}</div>
          ) : !abTestData ? (
            <div>未找到 AB Test 数据</div>
          ) : (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <strong>实验代码：</strong> 
                {abTestData.showAdvantagePositionInfoAB?.result.expCode}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>版本：</strong> 
                {abTestData.showAdvantagePositionInfoAB?.result.version}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>描述：</strong> 
                {abTestData.showAdvantagePositionInfoAB?.description}
              </div>
              <div style={{ marginTop: '20px' }}>
                <strong>完整数据：</strong>
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  overflow: 'auto' 
                }}>
                  {JSON.stringify(abTestData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
