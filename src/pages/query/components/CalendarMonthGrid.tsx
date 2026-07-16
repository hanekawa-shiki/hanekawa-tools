import { cn } from '@/lib/utils';
import {
  buildCalendarCells,
  getDayOfWeek,
  getDaysInMonth,
  getWeekdayNames,
} from './calendar-utils';
import { CalendarDayCell } from './CalendarDayCell';

interface MonthGridProps {
  year: number;
  month: number;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  weekStart: 0 | 6;
  holidaysLoaded: number;
}

export function CalendarMonthGrid({
  year,
  month,
  selectedDate,
  onSelectDate,
  weekStart,
  holidaysLoaded: _holidaysLoaded,
}: MonthGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const startDayOfWeek = getDayOfWeek(year, month, 1);
  const weekdayNames = getWeekdayNames(weekStart);

  const adjustedStart = weekStart === 6 ? (startDayOfWeek + 6) % 7 : startDayOfWeek;

  const cells = buildCalendarCells(year, month, daysInMonth, selectedDate);

  const totalCells = adjustedStart + daysInMonth;

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-7">
        {weekdayNames.map((name, i) => (
          <div
            key={name}
            className={cn(
              'text-center text-xs text-muted-foreground',
              i === 0 && weekStart === 6 && 'text-red-400',
              i === 6 && weekStart === 0 && 'text-red-400'
            )}
          >
            {name}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: totalCells }, (_, idx) => {
          if (idx < adjustedStart) {
            return <div key={`empty-${idx}`} className="min-h-13" />;
          }
          const cell = cells[idx - adjustedStart];
          return (
            <CalendarDayCell
              key={idx}
              cell={cell}
              year={year}
              month={month}
              onSelectDate={onSelectDate}
            />
          );
        })}
      </div>
    </div>
  );
}
