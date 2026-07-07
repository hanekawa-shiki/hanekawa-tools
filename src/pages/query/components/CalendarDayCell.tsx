import type { CalendarCell } from '../calendar-utils';
import { cn } from '@/lib/utils';

interface CalendarDayCellProps {
  cell: CalendarCell;
  year: number;
  month: number;
  onSelectDate: (date: string) => void;
}

export function CalendarDayCell({ cell, year, month, onSelectDate }: CalendarDayCellProps) {
  // 标签文字和样式
  let tagText = '';
  let tagClass = '';

  if (cell.isWorkday) {
    tagText = '班';
    tagClass = 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300';
  } else if (cell.isHoliday) {
    tagText = '休';
    tagClass = 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
  } else if (cell.isWeekend) {
    tagText = '休';
    tagClass = 'bg-red-50 text-red-400 dark:bg-red-950 dark:text-red-400';
  }

  // 格子背景色
  let cellBg = '';
  if (!cell.isSelected) {
    if (cell.isHoliday) {
      cellBg = 'bg-red-100/60 dark:bg-red-900/30';
    } else if (cell.isWeekend && !cell.isWorkday) {
      cellBg = 'bg-red-50/60 dark:bg-red-950/20';
    }
  }

  const handleClick = () => {
    if (cell.day > 0) {
      onSelectDate(
        `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && cell.day > 0) {
      e.preventDefault();
      onSelectDate(
        `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
      );
    }
  };

  return (
    <div
      role="button"
      tabIndex={cell.day > 0 ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex min-h-13 cursor-pointer flex-col items-center justify-start p-0.5 text-center',
        'rounded border border-transparent hover:border-border',
        cellBg,
        cell.isSelected && 'bg-primary text-primary-foreground',
        !cell.isSelected && cell.isToday && 'border-primary bg-primary/5',
        cell.holidayName !== '' &&
          !cell.isHoliday &&
          !cell.isWorkday &&
          'text-red-500 dark:text-red-400',
        !cell.isSelected &&
          !cell.isHoliday &&
          cell.solarTerm !== '' &&
          'text-green-600 dark:text-green-400',
        cell.isSelected && 'text-primary-foreground'
      )}
    >
      {/* 左上角：休/班标签 */}
      {tagText !== '' && (
        <span
          className={cn(
            'absolute top-0 left-0 flex size-3.5 items-center justify-center rounded-tl rounded-br text-[7px] leading-none font-bold',
            tagClass,
            cell.isSelected && 'bg-primary-foreground text-primary'
          )}
        >
          {tagText}
        </span>
      )}

      {/* 日期数字 */}
      <span
        className={cn(
          'mt-1 text-sm',
          !cell.isSelected && cell.isToday && 'font-bold text-primary',
          cell.isSelected && 'font-bold text-primary-foreground',
          !cell.isSelected &&
            cell.holidayName !== '' &&
            !cell.isHoliday &&
            !cell.isWorkday &&
            'font-bold text-red-500 dark:text-red-400'
        )}
      >
        {cell.day}
      </span>

      {/* 底部文字：假日名 > 节气 > 农历 */}
      {cell.showHolidayName ? (
        <span
          className={cn(
            'text-[10px] leading-tight',
            cell.isSelected ? 'text-primary-foreground' : 'text-red-500 dark:text-red-400'
          )}
        >
          {cell.holidayName}
        </span>
      ) : cell.solarTerm !== '' ? (
        <span
          className={cn(
            'text-[10px] leading-tight',
            cell.isSelected ? 'text-primary-foreground' : 'text-green-600 dark:text-green-400'
          )}
        >
          {cell.solarTerm}
        </span>
      ) : (
        <span
          className={cn(
            'text-[10px] leading-tight',
            cell.isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
          )}
        >
          {cell.lunar}
        </span>
      )}
    </div>
  );
}
