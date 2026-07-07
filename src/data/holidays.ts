/**
 * 法定节假日数据
 * 数据来源：https://holiday-cn-worker.angelbeast.workers.dev/api/holidays/year
 * 数据原始格式：https://github.com/NateScarlet/holiday-cn
 */

import type { ApiHolidayDay } from '@/api';
import { fetchHolidaysApi } from '@/api';

export interface Holiday {
  /** 节日名称 */
  name: string;
  /** 节日日期（MM-DD 格式） */
  date: string;
  /** 是否为调休工作日 */
  isWorkday?: boolean;
}

/** 内存缓存：year → Holiday[] */
const cache = new Map<number, Holiday[]>();

/** 正在请求中的年份 Promise（防止重复请求） */
const pending = new Map<number, Promise<Holiday[]>>();

/** 将接口数据转为内部格式 */
function transformDays(days: ApiHolidayDay[]): Holiday[] {
  return days.map((d) => ({
    name: d.name,
    date: d.date.slice(5), // YYYY-MM-DD → MM-DD
    isWorkday: d.isOffDay === false ? true : undefined,
  }));
}

/**
 * 从接口获取指定年份的节假日数据（带缓存）
 */
export async function fetchHolidays(year: number): Promise<Holiday[]> {
  const cached = cache.get(year);
  if (cached !== undefined) {
    return cached;
  }

  const existing = pending.get(year);
  if (existing !== undefined) {
    return existing;
  }

  const promise = fetchHolidaysApi({ data: { year } })
    .then((res) => {
      const holidays = transformDays(res.days);
      cache.set(year, holidays);
      pending.delete(year);
      return holidays;
    })
    .catch((err: unknown) => {
      pending.delete(year);
      console.error(`Failed to fetch holidays for year ${year}:`, err);
      return [] as Holiday[];
    });

  pending.set(year, promise);
  return promise;
}

/**
 * 获取指定日期的完整节假日信息（从缓存读取）
 */
export function getHolidayInfo(month: number, day: number, year: number): Holiday | undefined {
  const holidays = cache.get(year);
  if (holidays === undefined) {
    return undefined;
  }
  const md = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return holidays.find((h) => h.date === md);
}
