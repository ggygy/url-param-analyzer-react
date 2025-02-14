import React from 'react';
import { ConfigItemProps } from '../../types';
import { ConfigForm } from '../ConfigForm/ConfigForm';
import './ConfigItem.css';

export const ConfigItem: React.FC<ConfigItemProps> = ({
  config,
  isEditing,
  isActive,
  onEdit,
  onDelete,
  onSave,
  onUse
}) => {
  if (isEditing) {
    return <ConfigForm 
      initialData={config} 
      onSubmit={onSave}
      submitText="保存"
    />;
  }

  return (
    <div className={`config-item ${isActive ? 'config-item-selected' : ''}`}>
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
        <button onClick={onEdit}>编辑</button>
        <button onClick={onDelete}>删除</button>
        <button 
          className={isActive ? 'config-button-active' : ''}
          onClick={onUse}
        >
          {isActive ? '取消' : '使用'}
        </button>
      </div>
    </div>
  );
};
