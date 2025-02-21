/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import './ABTestInfo.css';
import { getABTestData } from '../../scripts/getABTestData';

interface ABTestItem {
  experimentName: string;
  result: string;
  sectionId: string;
}

interface ABTestInfoProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ABTestInfo: React.FC<ABTestInfoProps> = ({ isVisible, onClose }) => {
  const [abTestData, setABTestData] = useState<ABTestItem[]>([]);
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
      const data = await getABTestData();
      setABTestData(data);
    } catch (err) {
      setError('获取 AB 测试数据失败');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchABTestUrl = async (experimentName: string) => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'fetchABTest',
        experimentName
      });
      
      if (response.success) {
        const data = response?.data?.data?.[0] as any ?? {};
        window.open(`http://abtesting.ctripcorp.com/#/index-detail?id=${data.idOfExp}&expId=${data.expId}`);
      } else {
        setError(response.error || '获取实验详情失败');
      }
    } catch (err) {
      setError('获取实验详情失败');
      console.error(err);
    }
  }

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = abTestData[index];
    return (
      <div style={style}>
        {renderABTestItem(item)}
      </div>
    );
  };

  const renderABTestItem = (item: ABTestItem) => {
    return (
      <div 
        className="ABTestInfo-item" 
        onClick={() => fetchABTestUrl(item.experimentName)}
      >
        <ul className="ABTestInfo-item-list">
          <li>
            <span className="ABTestInfo-label">实验名称：</span>
            <span className="ABTestInfo-value">{item.experimentName}</span>
          </li>
          <li>
            <span className="ABTestInfo-label">实验结果：</span>
            <span className="ABTestInfo-value">{item.result}</span>
          </li>
          <li>
            <span className="ABTestInfo-label">区段 ID：</span>
            <span className="ABTestInfo-value">{item.sectionId}</span>
          </li>
        </ul>
      </div>
    );
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
          ) : abTestData.length === 0 ? (
            <div>未找到 AB Test 数据</div>
          ) : (
            <FixedSizeList
              height={400}
              width="100%"
              itemCount={abTestData.length}
              itemSize={120}
            >
              {Row}
            </FixedSizeList>
          )}
        </div>
      </div>
    </div>
  );
};
