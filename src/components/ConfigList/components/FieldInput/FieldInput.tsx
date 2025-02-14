import React from 'react';
import { FieldInputProps } from '../../types';
import './FieldInput.css';

export const FieldInput: React.FC<FieldInputProps> = ({
  paths,
  description,
  onChange,
  placeholder
}) => {
  return (
    <div className="field-input-container">
      <div className="field-row">
        <div className="field-column">
          <label>字段路径</label>
          <input
            value={paths}
            onChange={e => onChange(e.target.value, description)}
            placeholder={placeholder?.paths || "data.list.id, data.name"}
          />
        </div>
        <div className="field-column">
          <label>字段说明</label>
          <input
            value={description}
            onChange={e => onChange(paths, e.target.value)}
            placeholder={placeholder?.description || "用户ID, 用户名称"}
          />
        </div>
      </div>
      <div className="field-input-help">
        支持的格式: data.list.id, response.items[0].name
      </div>
    </div>
  );
};
