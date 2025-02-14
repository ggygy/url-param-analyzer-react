/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchData } from '../../services/api';
import { ApiConfig, ResponseCache } from './types';

// 新增处理请求和缓存的函数
export const handleApiRequest = async (
    config: ApiConfig,
    responseCache: ResponseCache
): Promise<{
    data: any | null;
    cache: ResponseCache;
    error?: string;
}> => {
    try {
        // 检查缓存是否存在且未过期（5分钟内）
        const cached = responseCache[config.id];
        const now = Date.now();
        if (cached && now - cached.timestamp < 300000) {
            return {
                data: cached.data,
                cache: responseCache
            };
        }

        const { data, error } = await fetchData(
            config.params,
            config.url,
            config.method || 'POST',
            config.token
        );

        if (!error && data) {
            const newCache = {
                ...responseCache,
                [config.id]: {
                    data,
                    timestamp: now
                }
            };
            return { data, cache: newCache };
        }

        return { data: null, cache: responseCache, error };
    } catch (error) {
        console.error(`Failed to fetch data for config ${config.name}:`, error);
        return {
            data: null,
            cache: responseCache,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};