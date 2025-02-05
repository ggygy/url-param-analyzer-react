import { useState } from 'react';
import { useChromeTabs } from './hooks/useChromeTabs';
import { ParamList } from './components/ParamList/ParamList';
import { DiffHighlighter, DiffType } from './components/DiffHighlighter/DiffHighlighter';
import './App.css';
import Header from './components/Header/Header';

const App = () => {
  const { currentTab } = useChromeTabs();
  const [compareUrl, setCompareUrl] = useState('');
  const [filter, setFilter] = useState<DiffType[]>(['changed', 'added', 'removed', 'unchanged']);

  return (
    <div className="url-analyzer-container">
      <Header />
      <section className="params-section">
        <div className="section-title">
          <span className="title-icon">🔍</span>
          当前URL参数
        </div>
        <div className="params-container">
          <ParamList url={currentTab.url} />
        </div>
      </section>

      <section className="params-section">
        <div className="section-title">
          <span className="title-icon">⚖️</span>
          URL参数比较
        </div>

        <div className="comparison-controls">
          <div className="input-group">
            <input
              type="text"
              value={compareUrl}
              onChange={(e) => setCompareUrl(e.target.value)}
              placeholder="输入对比URL"
              className="url-input"
            />
          </div>

          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filter.includes('changed')}
                onChange={(e) => setFilter(prev => e.target.checked ? [...prev, 'changed'] : prev.filter(f => f !== 'changed'))}
              />
              修改
            </label>
            <label>
              <input
                type="checkbox"
                checked={filter.includes('added')}
                onChange={(e) => setFilter(prev => e.target.checked ? [...prev, 'added'] : prev.filter(f => f !== 'added'))}
              />
              新增
            </label>
            <label>
              <input
                type="checkbox"
                checked={filter.includes('removed')}
                onChange={(e) => setFilter(prev => e.target.checked ? [...prev, 'removed'] : prev.filter(f => f !== 'removed'))}
              />
              删除
            </label>
            <label>
              <input
                type="checkbox"
                checked={filter.includes('unchanged')}
                onChange={(e) => setFilter(prev => e.target.checked ? [...prev, 'unchanged'] : prev.filter(f => f !== 'unchanged'))}
              />
              未变
            </label>
          </div>

          {compareUrl && currentTab?.url && (
            <div className="diff-results">
              <DiffHighlighter
                url1={currentTab.url}
                url2={compareUrl}
                filter={filter}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default App;