const STORAGE_ENABLED_KEY = 'param_storage_enabled';
const HOVER_ENABLED_KEY = 'param_hover_enabled';

interface ParamData {
    params: Array<{ key: string; value: string }>;
    editValues: Record<string, string>;
}

/**
 * 存储URL参数数据
 */
export const storage = {
    save(url: string, data: ParamData) {
        const key = `url_params_${url}`;
        localStorage.setItem(key, JSON.stringify(data));
    },

    load(url: string): ParamData | null {
        const key = `url_params_${url}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('url_params_')) {
                localStorage.removeItem(key);
            }
        });
    }
};

/**
 * 缓存设置项
 */
export const storageSettings = {
    getStorageEnabled(): boolean {
        return localStorage.getItem(STORAGE_ENABLED_KEY) === 'true';
    },

    setStorageEnabled(enabled: boolean): void {
        localStorage.setItem(STORAGE_ENABLED_KEY, String(enabled));
        if (!enabled) {
            // 清除所有localStorage中的参数数据
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('url_params_')) {
                    localStorage.removeItem(key);
                }
            });
        }
    },

    getHoverEnabled(): boolean {
        return localStorage.getItem(HOVER_ENABLED_KEY) === 'true';
    },

    setHoverEnabled(enabled: boolean): void {
        localStorage.setItem(HOVER_ENABLED_KEY, String(enabled));
    }
};