/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
    interface Window {
        __CACHED_NFES_DATA__?: any;
    }
}

export const getNFESData = async (): Promise<any> => {
    try {
        const response = await chrome.runtime.sendMessage({
            type: 'getNFESData'
        });

        if (response.success) {
            // 缓存到 window 对象
            window.__CACHED_NFES_DATA__ = response.data;
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('获取 NFES_DATA 失败:', error);
        return null;
    }
};