import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import lunisolar from 'lunisolar';
import zhCn from 'lunisolar/locale/zh-cn';
import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { fetchHolidays } from '@/data/holidays';
import { getWeekStart, setWeekStart } from './calendar-utils';
import { CalendarDateDetail } from './components/CalendarDateDetail';
import { CalendarLegend } from './components/CalendarLegend';
import { CalendarMonthGrid } from './components/CalendarMonthGrid';
import { CalendarNav } from './components/CalendarNav';

lunisolar.locale(zhCn);

dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function CalendarPage() {
  const now = dayjs();
  const [year, setYear] = useState(now.year());
  const [month, setMonth] = useState(now.month());
  const [selectedDate, setSelectedDate] = useState<string | null>(() => now.format('YYYY-MM-DD'));
  const [weekStartState, setWeekStartState] = useState<0 | 6>(getWeekStart);
  const [holidaysLoaded, setHolidaysLoaded] = useState<number>(0);

  // 获取节假日数据（组件挂载和年份切换时）
  useEffect(() => {
    void fetchHolidays(year).then(() => {
      setHolidaysLoaded((prev) => prev + 1);
    });
  }, [year]);

  /** 切换年/月后，保持选中日期的「日」不变；若目标月不存在该日则取月末 */
  const adjustSelectedDate = useCallback(
    (newYear: number, newMonth: number) => {
      if (selectedDate === null) {
        return;
      }
      const parsed = dayjs(selectedDate);
      const targetDay = parsed.date();
      const lastDay = new Date(newYear, newMonth + 1, 0).getDate();
      const day = Math.min(targetDay, lastDay);
      const newDate = `${newYear}-${String(newMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedDate(newDate);
    },
    [selectedDate]
  );

  const handleYearChange = useCallback(
    (val: string | null) => {
      if (val == null) {
        return;
      }
      const newYear = Number(val);
      setYear(newYear);
      adjustSelectedDate(newYear, month);
    },
    [month, adjustSelectedDate]
  );

  const handleMonthChange = useCallback(
    (val: string | null) => {
      if (val == null) {
        return;
      }
      const newMonth = Number(val);
      setMonth(newMonth);
      adjustSelectedDate(year, newMonth);
    },
    [year, adjustSelectedDate]
  );

  const handleWeekStartChange = useCallback((val: string | null) => {
    if (val == null) {
      return;
    }
    const v = Number(val) as 0 | 6;
    setWeekStartState(v);
    setWeekStart(v);
  }, []);

  const handleGoToday = () => {
    setYear(now.year());
    setMonth(now.month());
    setSelectedDate(now.format('YYYY-MM-DD'));
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader />

      {/* 导航栏 */}
      <CalendarNav
        year={year}
        month={month}
        weekStart={weekStartState}
        currentYear={now.year()}
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
        onWeekStartChange={handleWeekStartChange}
        onGoToday={handleGoToday}
      />

      {/* 图例 */}
      <CalendarLegend />

      {/* 双栏布局 */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 rounded-lg border bg-card p-4">
          <CalendarMonthGrid
            year={year}
            month={month}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            weekStart={weekStartState}
            holidaysLoaded={holidaysLoaded}
          />
        </div>
        <div className="rounded-lg border bg-card lg:w-72 lg:shrink-0">
          <CalendarDateDetail selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
