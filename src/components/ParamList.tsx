import { useEffect, useState } from 'react';
import { ClipboardDocumentIcon, PencilIcon, CheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import './ParamList.css';

interface Param {
  key: string;
  value: string;
}

interface ParamListProps {
  url?: string;
  onChange?: (params: Param[]) => void;
}

const parseParams = (url: string): Param[] => {
  try {
    const { searchParams } = new URL(url);
    return Array.from(searchParams.entries()).map(([key, value]) => ({
      key,
      value: decodeURIComponent(value)
    }));
  } catch {
    return [];
  }
};

export const ParamList = ({ url, onChange }: ParamListProps) => {
  const [params, setParams] = useState<Param[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [newParam, setNewParam] = useState<Param>({ key: '', value: '' });

  useEffect(() => {
    if (url) {
      const parsed = parseParams(url);
      setParams(parsed);
      // 初始化编辑值
      setEditValues(Object.fromEntries(parsed.map(p => [p.key, p.value])));
    }
  }, [url]);

  const handleCopyAll = async () => {
    const text = params.map(p => `${p.key}=${p.value}`).join('&');
    try {
      await navigator.clipboard.writeText(text);
      alert('已复制所有参数');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // 提交修改
      const newParams = params.map(p => ({
        ...p,
        value: editValues[p.key] || p.value
      }));
      setParams(newParams);
      onChange?.(newParams);
    }
    setIsEditing(!isEditing);
  };

  const handleValueChange = (key: string, value: string) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
  };

  const handleAddParam = () => {
    console.log('newParam:', newParam);
    
    if (newParam.key && newParam.value) {
      const newParams = [...params, newParam];
      setParams(newParams);
      onChange?.(newParams);
      handleValueChange(newParam.key, newParam.value);
      setNewParam({ key: '', value: '' });
    }
  };

  const handleDeleteParam = (key: string) => {
    const newParams = params.filter(p => p.key !== key);
    setParams(newParams);
    onChange?.(newParams);
  };

  return (
    <>
      <div className="global-controls">
        <button
          onClick={handleEditToggle}
          className={`control-button ${isEditing ? 'save' : 'edit'}`}
        >
          {isEditing ? (
            <>
              <CheckIcon className="icon" />
              保存修改
            </>
          ) : (
            <>
              <PencilIcon className="icon" />
              编辑参数
            </>
          )}
        </button>
        <button
          onClick={handleCopyAll}
          className="control-button copy"
        >
          <ClipboardDocumentIcon className="icon" />
          复制全部
        </button>
      </div>

      <div className="param-list">
        {params.map(({ key }) => (
          <div key={key} className="param-item">
            <div className="param-key">{key}:&nbsp;</div>
            <div className="param-value">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editValues[key] || ''}
                    onChange={(e) => handleValueChange(key, e.target.value)}
                    className="edit-input"
                  />
                  <button onClick={() => handleDeleteParam(key)} className="param-button danger">
                    <TrashIcon className="param-icon" />
                  </button>
                </>
              ) : (
                <span>{editValues[key]}</span>
              )}
            </div>
          </div>
        ))}

        {isEditing && (
          <div className="add-param">
            <input
              type="text"
              placeholder="键"
              value={newParam.key}
              onChange={(e) => setNewParam({ ...newParam, key: e.target.value })}
              className="edit-input"
            />
            <input
              type="text"
              placeholder="值"
              value={newParam.value}
              onChange={(e) => setNewParam({ ...newParam, value: e.target.value })}
              className="edit-input"
            />
            <button onClick={handleAddParam} className="param-button success">
              <PlusIcon className="param-icon" />
            </button>
          </div>
        )}

      </div>
    </>
  );
};
