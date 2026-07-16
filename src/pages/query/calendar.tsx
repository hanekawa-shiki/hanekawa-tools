import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import lunisolar from 'lunisolar';
import zhCn from 'lunisolar/locale/zh-cn';
import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { fetchHolidays } from '@/data/holidays';
import { getWeekStart, setWeekStart } from './components/calendar-utils';
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

  useEffect(() => {
    void fetchHolidays(year).then(() => {
      setHolidaysLoaded((prev) => prev + 1);
    });
  }, [year]);

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

  const handleMonthSelect = useCallback(
    (date: Date) => {
      const newYear = date.getFullYear();
      const newMonth = date.getMonth();
      setYear(newYear);
      setMonth(newMonth);
      adjustSelectedDate(newYear, newMonth);
    },
    [adjustSelectedDate]
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

      <CalendarNav
        year={year}
        month={month}
        weekStart={weekStartState}
        onMonthSelect={handleMonthSelect}
        onWeekStartChange={handleWeekStartChange}
        onGoToday={handleGoToday}
      />

      <CalendarLegend />

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
          <CalendarDateDetail selectedDate={selectedDate} holidaysLoaded={holidaysLoaded} />
        </div>
      </div>
    </div>
  );
}
