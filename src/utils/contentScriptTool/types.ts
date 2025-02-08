/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DisplayField {
  path: string;
  description: string;
}

export interface ApiConfig {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST';
  params: Record<string, any>;
  token?: string;
  displayFields: DisplayField[];  // 修改为包含描述的字段
}

export interface CacheItem {
  data: any;
  timestamp: number;
  displayFields: DisplayField[];  // 添加显示字段到缓存中
  configName: string;      // 添加配置名称
  isActive?: boolean;  // 添加激活状态标识
}

export interface ResponseCache {
  [configId: string]: CacheItem;
}
