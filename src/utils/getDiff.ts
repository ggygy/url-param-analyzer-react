// DiffHighlighter.tsx 中补充完整逻辑
type DiffType = 'added' | 'removed' | 'changed' | 'unchanged';

interface DiffItem {
  key: string;
  type: DiffType;
  oldValue?: string;
  newValue?: string;
}

const parseParams = (url: string): Record<string, string> => {
  try {
    const { searchParams } = new URL(url);
    return Object.fromEntries(
      Array.from(searchParams.entries()).map(([k, v]) => [k, decodeURIComponent(v)])
    );
  } catch {
    return {};
  }
};

export const getDiff = (url1: string, url2: string): DiffItem[] => {
  const params1 = parseParams(url1);
  const params2 = parseParams(url2);
  const allKeys = new Set([...Object.keys(params1), ...Object.keys(params2)]);

  return Array.from(allKeys).map((key): DiffItem => {
    const val1 = params1[key];
    const val2 = params2[key];

    if (!(key in params1)) {
      return {
        key,
        type: 'added',
        newValue: val2
      };
    }

    if (!(key in params2)) {
      return {
        key,
        type: 'removed',
        oldValue: val1
      };
    }

    if (val1 !== val2) {
      return {
        key,
        type: 'changed',
        oldValue: val1,
        newValue: val2
      };
    }

    return {
      key,
      type: 'unchanged',
      oldValue: val1,
      newValue: val2
    };
  });
};