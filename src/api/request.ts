/**
 * 通用 API 请求封装
 * 供 api/index.ts 中的接口定义调用
 */

import request from '@/lib/request';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiConfig {
  /** 请求方法 */
  method: HttpMethod;
  /** 请求路径（相对于 baseURL） */
  url: string;
  /** 请求头（可选） */
  headers?: Record<string, string>;
}

export interface RequestOptions {
  /** 请求体数据 */
  data?: unknown;
  /** URL 查询参数 */
  params?: Record<string, unknown>;
  /** 请求头 */
  headers?: Record<string, string>;
}

/**
 * 根据 ApiConfig 生成请求函数
 * 返回的函数接收可选参数，返回 Promise
 */
export function createApi<TResponse = unknown>(config: ApiConfig) {
  return async (options?: RequestOptions): Promise<TResponse> => {
    return request
      .request<TResponse>({
        method: config.method,
        url: config.url,
        data: options?.data,
        params: options?.params,
        headers: {
          ...config.headers,
          ...options?.headers,
        },
      })
      .then((res) => res.data);
  };
}
