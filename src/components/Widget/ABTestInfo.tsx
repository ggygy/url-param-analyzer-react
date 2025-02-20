import React from 'react';

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
  if (!isVisible) return null;

  const getABTestData = (): ABTestData | null => {
    try {
      // @ts-ignore
      const nextData = window.__NEXT_DATA__?.props?.pageProps?.abTest;
      return nextData || null;
    } catch (error) {
      console.error('获取AB测试数据失败:', error);
      return null;
    }
  };

  const abTestData = getABTestData();

  return (
    <div className="widget-modal-overlay">
      <div className="widget-modal">
        <button className="widget-close" onClick={onClose}>&times;</button>
        <div className="widget-header">
          <h3 className="widget-title">AB Test 信息</h3>
        </div>
        <div className="widget-content" style={{ padding: '20px' }}>
          {abTestData ? (
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
          ) : (
            <div>未找到 AB Test 数据</div>
          )}
        </div>
      </div>
    </div>
  );
};
