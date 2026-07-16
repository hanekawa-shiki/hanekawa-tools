import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MonthPicker } from '@/components/ui/monthpicker';
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
  onMonthSelect: (date: Date) => void;
  onWeekStartChange: (val: string | null) => void;
  onGoToday: () => void;
}

export function CalendarNav({
  year,
  month,
  weekStart,
  onMonthSelect,
  onWeekStartChange,
  onGoToday,
}: CalendarNavProps) {
  const [open, setOpen] = useState(false);

  const displayLabel = `${year} 年 · ${MONTH_NAMES[month]}`;

  const handleMonthSelect = (date: Date) => {
    onMonthSelect(date);
    setOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center lg:justify-center">
        {/* 年月选择器（MonthPicker + Popover） */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button variant="outline" size="sm" className="w-full gap-1.5 font-medium lg:w-auto">
                {displayLabel}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
            <MonthPicker selectedMonth={new Date(year, month)} onMonthSelect={handleMonthSelect} />
          </PopoverContent>
        </Popover>

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
