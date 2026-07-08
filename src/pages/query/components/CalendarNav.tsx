import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MONTH_NAMES, WEEK_START_CONFIG } from './calendar-utils';

interface CalendarNavProps {
  year: number;
  month: number;
  weekStart: 0 | 6;
  currentYear: number;
  onYearChange: (val: string | null) => void;
  onMonthChange: (val: string | null) => void;
  onWeekStartChange: (val: string | null) => void;
  onGoToday: () => void;
}

function DateSelect({
  year,
  month,
  currentYear,
  onYearChange,
  onMonthChange,
}: {
  year: number;
  month: number;
  currentYear: number;
  onYearChange: (val: string | null) => void;
  onMonthChange: (val: string | null) => void;
}) {
  const [open, setOpen] = useState(false);

  const displayLabel = `${year} 年 · ${MONTH_NAMES[month]}`;

  const handleYearChange = (val: string | null) => {
    onYearChange(val);
    setOpen(false);
  };

  const handleMonthChange = (val: string | null) => {
    onMonthChange(val);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="w-full gap-1.5 font-medium lg:w-auto">
            {displayLabel}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-2" align="start" sideOffset={8}>
        <div className="flex items-center gap-2">
          {/* 年份选择 */}
          <Select value={String(year)} onValueChange={handleYearChange}>
            <SelectTrigger size="sm" className="w-26">
              <SelectValue placeholder="年">
                {(value: string) => (value !== null ? `${value} 年` : '年')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 41 }, (_, i) => currentYear - 20 + i).map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y} 年
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-xs text-muted-foreground/50">·</span>

          {/* 月份选择 */}
          <Select value={String(month)} onValueChange={handleMonthChange}>
            <SelectTrigger size="sm" className="w-18">
              <SelectValue placeholder="月">
                {(value: string) => (value !== null ? MONTH_NAMES[Number(value)] : '月')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((name, i) => (
                <SelectItem key={name} value={String(i)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function CalendarNav({
  year,
  month,
  weekStart,
  currentYear,
  onYearChange,
  onMonthChange,
  onWeekStartChange,
  onGoToday,
}: CalendarNavProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center lg:justify-center">
        {/* 年月选择器 */}
        <DateSelect
          year={year}
          month={month}
          currentYear={currentYear}
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
        />

        {/* 一周起始日选择 */}
        <Select
          items={WEEK_START_CONFIG}
          value={String(weekStart)}
          onValueChange={onWeekStartChange}
        >
          <SelectTrigger size="sm" className="w-full lg:w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WEEK_START_CONFIG.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onGoToday}>
          回到今天
        </Button>
      </div>
    </div>
  );
}
