/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ConfigFormProps, ConfigFormData } from '../../types';
import { FieldInput } from '../FieldInput/FieldInput';
import './ConfigForm.css';

export const ConfigForm: React.FC<ConfigFormProps> = ({
  initialData = {},
  onSubmit,
  submitText
}) => {
  const [formData, setFormData] = useState<ConfigFormData>(initialData);

  const handleFieldsChange = (paths: string, description: string) => {
    const fields = paths.split(',')
      .map(f => f.trim())
      .filter(f => f !== '')
      .map(path => ({ path, description }));

    setFormData(prev => ({
      ...prev,
      displayFields: fields
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.url) return;
    onSubmit(formData as any);
  };

  return (
    <div className="config-form">
      <input
        placeholder="配置名称"
        value={formData.name || ''}
        onChange={e => setFormData({...formData, name: e.target.value})}
      />
      <select
        value={formData.method || 'POST'}
        onChange={e => setFormData({...formData, method: e.target.value as 'GET' | 'POST'})}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
      </select>
      <input
        placeholder="API URL"
        value={formData.url || ''}
        onChange={e => setFormData({...formData, url: e.target.value})}
      />
      <textarea
        placeholder="参数 (JSON格式)"
        value={JSON.stringify(formData.params || {}, null, 2)}
        onChange={e => {
          try {
            const params = JSON.parse(e.target.value);
            setFormData({...formData, params});
          } catch {
            console.log('Invalid JSON');
          }
        }}
      />
      <input
        placeholder="Token (可选)"
        value={formData.token || ''}
        onChange={e => setFormData({...formData, token: e.target.value})}
      />
      <FieldInput
        paths={formData.displayFields?.map(f => f.path).join(',') || ''}
        description={formData.displayFields?.[0]?.description || ''}
        onChange={handleFieldsChange}
      />
      <button onClick={handleSubmit}>{submitText}</button>
    </div>
  );
};
