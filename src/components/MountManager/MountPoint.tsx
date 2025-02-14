import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface MountConfig {
  selector: string;
  content: React.ReactNode;
  style?: React.CSSProperties;
}

interface MountPointProps {
  configs: MountConfig[];
  fallbackToBody?: boolean;
  className?: string;
  defaultStyle?: React.CSSProperties;
}

export const MountPoint: React.FC<MountPointProps> = ({
  configs,
  fallbackToBody = true,
  className = 'url-param-analyzer',
  defaultStyle = {}
}) => {
  const [mountPoints, setMountPoints] = useState<Array<{
    element: HTMLElement;
    content: React.ReactNode;
  }>>([]);

  useEffect(() => {
    const createMountPoints = () => {
      const newMountPoints: Array<{
        element: HTMLElement;
        content: React.ReactNode;
      }> = [];

      configs.forEach((config, configIndex) => {
        const target = document.querySelector(config.selector);
        if (target || fallbackToBody) {
          const container = document.createElement('div');
          container.className = `${className}-${configIndex}`;
          Object.assign(
            container.style,
            defaultStyle,
            defaultStyle,
            config.style
          );

          if (!target && fallbackToBody) {
            // 如果找不到目标元素且允许回退到 body
            container.style.position = 'fixed';
            container.style.top = `${10 + configIndex * 60}px`; // 垂直堆叠
            container.style.right = '10px';
            document.body.insertBefore(container, document.body.firstChild);
          } else if (target) {
            target.parentNode?.insertBefore(container, target.nextSibling);
          }

          newMountPoints.push({
            element: container,
            content: config.content
          });
        }
      });

      setMountPoints(newMountPoints);
    };

    const init = () => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createMountPoints);
      } else {
        createMountPoints();
      }
    };

    init();

    return () => {
      mountPoints.forEach(({ element }) => {
        element.parentElement?.removeChild(element);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configs, fallbackToBody, className, defaultStyle]);

  return (
    <>
      {mountPoints.map(({ element, content }, index) => (
        ReactDOM.createPortal(
          <div key={`mount-${index}`}>
            {content}
          </div>,
          element
        )
      ))}
    </>
  );
};
