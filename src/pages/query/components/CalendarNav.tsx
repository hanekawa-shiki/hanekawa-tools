import { Button } from '@/components/ui/button';
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
        {/* 年份选择 */}
        <Select value={String(year)} onValueChange={onYearChange}>
          <SelectTrigger size="sm" className="w-full lg:w-27">
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

        {/* 月份选择 */}
        <Select value={String(month)} onValueChange={onMonthChange}>
          <SelectTrigger size="sm" className="w-full lg:w-20">
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
