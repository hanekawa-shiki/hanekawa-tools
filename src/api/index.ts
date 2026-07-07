/**
 * API 接口列表
 * 集中管理所有接口的请求方式、URL、请求头等配置
 * 新增接口只需在此文件中添加即可
 */

import { createApi } from './request';

// ==================== 接口响应类型 ====================

/** 单条假期数据 */
export interface ApiHolidayDay {
  name: string;
  date: string;
  isOffDay: boolean;
}

/** 节假日接口响应结构 */
export interface ApiResponse {
  year: number;
  days: ApiHolidayDay[];
}

/** 节假日接口请求参数 */
export interface FetchHolidaysParams {
  year: number;
}

// ==================== 接口定义 ====================

/** 获取指定年份的法定节假日 */
export const fetchHolidaysApi = createApi<ApiResponse>({
  method: 'POST',
  url: '/holidays/year',
});
