import React, { CSSProperties } from 'react';
import { MountPoint } from './MountPoint';

interface MountManagerProps {
  visible: boolean;
}

const mountConfigs = [
  {
    id: 'data-analyzer-button',
    selectors: ['.header-nav'],
    content: '一个数据分析器',
    style: {
      position: 'relative' as const,
      top: 0,
      right: 0,
      cursor: 'pointer'
    } as CSSProperties,
    defaultStyle: {
      backgroundColor: '#f5f5f5',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '8px 12px',
      borderRadius: '4px'
    } as CSSProperties
  },
  // 可以在这里添加更多的挂载配置
];

export const MountManager: React.FC<MountManagerProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <>
      {mountConfigs.map((config) => (
        <MountPoint
          key={config.id}
          configs={[
            {
              selector: config.selectors[0],
              content: config.content,
              style: config.style
            }
          ]}
          defaultStyle={config.defaultStyle}
          className={`mount-point-${config.id}`}
          fallbackToBody={true}
        />
      ))}
    </>
  );
};
