import request from '@/lib/request';

export function createApi<TResponse = unknown>(config: ApiRequestConfig) {
  return async (options?: ApiRequestOptions): Promise<TResponse> => {
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
