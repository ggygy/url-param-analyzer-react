import { useEffect, useState } from 'react';
import { getDiff } from '../utils/getDiff';
import './DiffHighlighter.css';

export type DiffType = 'added' | 'removed' | 'changed' | 'unchanged';

// 类型标签映射
// eslint-disable-next-line react-refresh/only-export-components
export enum typeLabels {
    added = '新增',
    removed = '删除',
    changed = '修改',
    unchanged = '未变'
};

interface DiffItem {
    key: string;
    type: DiffType;
    oldValue?: string;
    newValue?: string;
}

interface DiffHighlighterProps {
    url1?: string;
    url2?: string;
    filter?: DiffType[];
}

export const DiffHighlighter = ({ url1, url2, filter = [] }: DiffHighlighterProps) => {
    const [diffs, setDiffs] = useState<DiffItem[]>([]);

    useEffect(() => {
        if (url1 && url2) {
            setDiffs(getDiff(url1, url2));
        }
    }, [url1, url2]);

    const filteredDiffs = diffs.filter(diff => filter.includes(diff.type));

    return (
        <div className="diff-container">
            {filteredDiffs.map(({ key, type, oldValue, newValue }) => (
                <div key={key} className={`diff-item ${type}`}>
                    <div className="diff-header">
                        <span className="diff-icon">
                            {type === 'added' && '🟢'}
                            {type === 'removed' && '🔴'}
                            {type === 'changed' && '🟡'}
                            {type === 'unchanged' && '⚪'}
                        </span>
                        {key}
                        <span className="diff-type">{typeLabels[type]}</span>
                    </div>

                    {type === 'changed' && (
                        <div className="diff-values">
                            <div className="diff-old">
                                <span className="diff-arrow">←</span>
                                {oldValue}
                            </div>
                            <div className="diff-new">
                                {newValue}
                                <span className="diff-arrow">→</span>
                            </div>
                        </div>
                    )}

                    {type === 'added' && (
                        <div className="diff-added-value">
                            {newValue}
                        </div>
                    )}

                    {type === 'removed' && (
                        <div className="diff-removed-value">
                            {oldValue}
                        </div>
                    )}

                    {type === 'unchanged' && (
                        <div className="diff-unchanged-value">
                            {oldValue || newValue}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};