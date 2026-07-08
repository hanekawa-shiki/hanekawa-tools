import dayjs from 'dayjs';
import lunisolar from 'lunisolar';
import { getHolidayInfo } from '@/data/holidays';

const WEEK_START_KEY = 'calendar_week_start';

export function getWeekStart(): 0 | 6 {
  try {
    const val = localStorage.getItem(WEEK_START_KEY);
    return val === '6' ? 6 : 0;
  } catch {
    return 0;
  }
}

export function setWeekStart(val: 0 | 6) {
  try {
    localStorage.setItem(WEEK_START_KEY, String(val));
  } catch {
    /* ignore */
  }
}

export function getDaysInMonth(year: number, month: number): number {
  return dayjs(new Date(year, month)).daysInMonth();
}

export function getDayOfWeek(year: number, month: number, day: number): number {
  return dayjs(new Date(year, month, day)).day();
}

export function getWeekOfYear(dateStr: string): number {
  return dayjs(dateStr).isoWeek();
}

export function getLunarDay(dateStr: string): string {
  const d = lunisolar(dateStr);
  const day = d.lunar.day;
  const monthName = d.format('lM');
  const dayName = d.format('lD');
  return day === 1 ? monthName : dayName;
}

export function getLunarFullInfo(dateStr: string) {
  const hms = dayjs().format('HH:mm:ss');
  const d = lunisolar(`${dateStr} ${hms}`);

  return {
    fullText: d.format('lM(lL)lD lH时'),
    sbFullText: d.format('cY年【cZ年】 cM月 cD日'),
    monthName: d.format('lM'),
    dayName: d.format('lD'),
    dayOfWeek: d.format('dddd'),
    solarTerm: d.solarTerm != null ? d.solarTerm.toString() : '',
  };
}

export function getWeekdayNames(weekStart: 0 | 6): string[] {
  const names = ['日', '一', '二', '三', '四', '五', '六'];
  if (weekStart === 6) {
    return [...names.slice(1), names[0]];
  }
  return names;
}

export function buildCalendarCells(
  year: number,
  month: number,
  daysInMonth: number,
  selectedDate: string | null
): CalendarCell[] {
  const result: CalendarCell[] = [];
  const now = new Date();

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = now.getFullYear() === year && now.getMonth() === month && now.getDate() === d;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const lunar = getLunarDay(dateStr);
    const solarTerm = lunisolar(dateStr).solarTerm?.toString() ?? '';
    const holidayInfo = getHolidayInfo(month, d, year);

    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isSelected = selectedDate === dateKey;

    const dayOfWeek = getDayOfWeek(year, month, d);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isWorkday = holidayInfo?.isWorkday === true;
    const isHoliday = holidayInfo !== undefined && !isWorkday;

    const showHolidayName =
      holidayInfo !== undefined &&
      !isWorkday &&
      (() => {
        if (d <= 1) {
          return true;
        }
        const prevHoliday = getHolidayInfo(month, d - 1, year);
        return prevHoliday?.name !== holidayInfo.name;
      })();

    result.push({
      day: d,
      lunar,
      solarTerm,
      holidayName: holidayInfo?.name ?? '',
      showHolidayName,
      isHoliday,
      isWeekend,
      isWorkday,
      isToday,
      isSelected,
    });
  }

  return result;
}

export const MONTH_NAMES = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
];
