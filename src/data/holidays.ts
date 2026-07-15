import { fetchHolidayApi } from '@/api';

const cache = new Map<number, Holiday[]>();

const pending = new Map<number, Promise<Holiday[]>>();

function transformDays(days: HolidayData[]): Holiday[] {
  return days.map((d) => ({
    name: d.name,
    date: d.date.slice(5), // YYYY-MM-DD → MM-DD
    isWorkday: d.isOffDay === false ? true : undefined,
  }));
}

export async function fetchHolidays(year: number): Promise<Holiday[]> {
  const cached = cache.get(year);
  if (cached !== undefined) {
    return cached;
  }

  const existing = pending.get(year);
  if (existing !== undefined) {
    return existing;
  }

  const promise = fetchHolidayApi({ data: { year } })
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

export function getHolidayInfo(month: number, day: number, year: number): Holiday | undefined {
  const holidays = cache.get(year);
  if (holidays === undefined) {
    return undefined;
  }
  const md = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return holidays.find((h) => h.date === md);
}
