import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import lunisolar from 'lunisolar';
import { useCallback, useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getHolidayInfo } from '@/data/holidays';
import { cn } from '@/lib/utils';

dayjs.extend(isoWeek);

// ==================== localStorage 工具 ====================

const WEEK_START_KEY = 'calendar_week_start';

function getWeekStart(): 0 | 6 {
  try {
    const val = localStorage.getItem(WEEK_START_KEY);
    return val === '6' ? 6 : 0;
  } catch {
    return 0;
  }
}

function setWeekStart(val: 0 | 6) {
  try {
    localStorage.setItem(WEEK_START_KEY, String(val));
  } catch {
    /* ignore */
  }
}

// ==================== 工具函数 ====================

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getDayOfWeek(year: number, month: number, day: number): number {
  return new Date(year, month, day).getDay();
}

/** 获取当前日期是一年中的第几周（ISO 8601） */
function getWeekOfYear(dateStr: string): number {
  return dayjs(dateStr).isoWeek();
}

function getLunarDay(dateStr: string): string {
  const d = lunisolar(dateStr);
  const day = d.lunar.day;
  const monthName = d.format('lM');
  const dayName = d.format('lD');
  return day === 1 ? monthName : dayName;
}

function getLunarFullInfo(dateStr: string) {
  const d = lunisolar(dateStr);
  return {
    fullText: d.format('lY年lMlD'),
    monthName: d.format('lM'),
    dayName: d.format('lD'),
    yearGanZhi: d.format('lY年'),
    yearShengXiao: d.format('lZ'),
    dayOfWeek: d.format('lW'),
    isLeapMonth: d.lunar.leapMonth !== 0,
    solarTerm: d.solarTerm != null ? d.solarTerm.toString() : '',
  };
}

const MONTH_NAMES = [
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

function getWeekdayNames(weekStart: 0 | 6): string[] {
  const names = ['日', '一', '二', '三', '四', '五', '六'];
  if (weekStart === 6) {
    return [...names.slice(1), names[0]];
  }
  return names;
}

interface CalendarCell {
  day: number;
  lunar: string;
  solarTerm: string;
  holidayName: string;
  isHoliday: boolean;
  isWeekend: boolean;
  isWorkday: boolean;
  isToday: boolean;
  isSelected: boolean;
}

// ==================== 单月日历网格 ====================

function SingleMonthGrid({
  year,
  month,
  selectedDate,
  onSelectDate,
  weekStart,
}: {
  year: number;
  month: number;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  weekStart: 0 | 6;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const startDayOfWeek = getDayOfWeek(year, month, 1);
  const WEEKDAY_NAMES = getWeekdayNames(weekStart);

  // 调整起始日偏移：如果 weekStart=6（周一），则周一=0, 周日=6
  const adjustedStart = weekStart === 6 ? (startDayOfWeek + 6) % 7 : startDayOfWeek;

  const cells = useMemo<CalendarCell[]>(() => {
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

      result.push({
        day: d,
        lunar,
        solarTerm,
        holidayName: holidayInfo?.name ?? '',
        isHoliday,
        isWeekend,
        isWorkday,
        isToday,
        isSelected,
      });
    }

    return result;
  }, [year, month, daysInMonth, selectedDate]);

  const totalCells = adjustedStart + daysInMonth;

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-7">
        {WEEKDAY_NAMES.map((name, i) => (
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

          // 确定标签文字和样式
          let tagText = '';
          let tagClass = '';

          if (cell.isWorkday) {
            // 调休上班：灰色
            tagText = '班';
            tagClass = 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300';
          } else if (cell.isHoliday) {
            // 法定节假日：深红色
            tagText = '休';
            tagClass = 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
          } else if (cell.isWeekend) {
            // 普通周末：淡红色
            tagText = '休';
            tagClass = 'bg-red-50 text-red-400 dark:bg-red-950 dark:text-red-400';
          }

          // 格子背景色：法定节假日 > 周末（排除调休上班）
          let cellBg = '';
          if (!cell.isSelected) {
            if (cell.isHoliday) {
              cellBg = 'bg-red-100/60 dark:bg-red-900/30';
            } else if (cell.isWeekend && !cell.isWorkday) {
              cellBg = 'bg-red-50/60 dark:bg-red-950/20';
            }
          }

          return (
            <div
              key={idx}
              role="button"
              tabIndex={cell.day > 0 ? 0 : undefined}
              onClick={() =>
                cell.day > 0 &&
                onSelectDate(
                  `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
                )
              }
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && cell.day > 0) {
                  e.preventDefault();
                  onSelectDate(
                    `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
                  );
                }
              }}
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
              {cell.holidayName !== '' && !cell.isWorkday ? (
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
                    cell.isSelected
                      ? 'text-primary-foreground'
                      : 'text-green-600 dark:text-green-400'
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
        })}
      </div>
    </div>
  );
}

// ==================== 右侧日期详情面板 ====================

function DateDetailPanel({ selectedDate }: { selectedDate: string | null }) {
  if (selectedDate === null) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        请在日历中选择一个日期
      </div>
    );
  }

  const date = dayjs(selectedDate);

  const lunar = getLunarFullInfo(selectedDate);
  const holidayInfo = getHolidayInfo(date.month(), date.date(), date.year());
  const solarTerm = lunar.solarTerm;
  const weekNum = getWeekOfYear(selectedDate);

  const dayOfWeek = date.day();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isWorkday = holidayInfo?.isWorkday === true;
  const isHoliday = holidayInfo !== undefined && !isWorkday;
  const isRestDay = isHoliday || (isWeekend && !isWorkday);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 公历日期 */}
      <div className="flex items-center gap-3">
        <span className={cn('text-3xl font-bold', isRestDay && 'text-red-500 dark:text-red-400')}>
          {date.date()}
        </span>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            {date.year()}年{date.month() + 1}月
          </span>
        </div>
      </div>

      {/* 第几周 */}
      <div className="rounded-lg bg-muted/50 p-3">
        <div className="mb-1 text-xs font-medium text-muted-foreground">周数</div>
        <div className="text-sm font-medium">
          当前为
          {date.year()}
          的第
          {weekNum}周
        </div>
      </div>

      {/* 农历信息 */}
      <div className="rounded-lg bg-muted/50 p-3">
        <div className="mb-1 text-xs font-medium text-muted-foreground">农历</div>
        <div className="text-sm font-medium">{lunar.fullText}</div>
        {lunar.isLeapMonth && <div className="text-xs text-muted-foreground">闰月</div>}
      </div>

      {/* 天干地支 */}
      <div className="rounded-lg bg-muted/50 p-3">
        <div className="mb-1 text-xs font-medium text-muted-foreground">天干地支</div>
        <div className="text-sm">
          {lunar.yearGanZhi} <span className="text-muted-foreground">{lunar.yearShengXiao}</span>
        </div>
      </div>

      {/* 节气 */}
      {solarTerm !== '' && (
        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
          <div className="mb-1 text-xs font-medium text-green-700 dark:text-green-400">节气</div>
          <div className="text-sm font-medium text-green-700 dark:text-green-400">{solarTerm}</div>
        </div>
      )}

      {/* 法定节假日 */}
      {holidayInfo !== undefined && holidayInfo.isWorkday !== true && (
        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
          <div className="mb-1 text-xs font-medium text-red-600 dark:text-red-400">节假日</div>
          <div className="text-sm font-medium text-red-600 dark:text-red-400">
            {holidayInfo.name}
          </div>
        </div>
      )}

      {/* 调休上班 */}
      {holidayInfo?.isWorkday === true && (
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
          <div className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">调休上班</div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {holidayInfo.name}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 主页面 ====================

export default function CalendarPage() {
  const now = dayjs();
  const [year, setYear] = useState(now.year());
  const [month, setMonth] = useState(now.month());
  const [selectedDate, setSelectedDate] = useState<string | null>(() => now.format('YYYY-MM-DD'));
  const [weekStartState, setWeekStartState] = useState<0 | 6>(getWeekStart);

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
    (val: string) => {
      const newYear = Number(val);
      setYear(newYear);
      adjustSelectedDate(newYear, month);
    },
    [month, adjustSelectedDate]
  );

  const handleMonthChange = useCallback(
    (val: string) => {
      const newMonth = Number(val);
      setMonth(newMonth);
      adjustSelectedDate(year, newMonth);
    },
    [year, adjustSelectedDate]
  );

  const handleWeekStartChange = useCallback((val: string) => {
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
      {/* 导航栏：年月控制 + 一周起始日设置（移动端 2×2 网格，桌面端横向排列，滚动时固定） */}
      <div className="sticky top-0 z-10 -mx-4 -mt-4 bg-background px-4 pt-4 pb-2 backdrop-blur-sm lg:mx-0 lg:mt-0 lg:px-0 lg:py-4">
        <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center lg:justify-center">
          {/* 年份选择 */}
          <Select value={String(year)} onValueChange={handleYearChange}>
            <SelectTrigger size="sm" className="w-full lg:w-27">
              <SelectValue placeholder="年" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 41 }, (_, i) => now.year() - 20 + i).map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y} 年
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 月份选择 */}
          <Select value={String(month)} onValueChange={handleMonthChange}>
            <SelectTrigger size="sm" className="w-full lg:w-20">
              <SelectValue placeholder="月" />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((name, i) => (
                <SelectItem key={name} value={String(i)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            type="button"
            onClick={handleGoToday}
            className="rounded-md border bg-background px-3 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            回到今天
          </button>

          {/* 一周起始日选择 */}
          <Select value={String(weekStartState)} onValueChange={handleWeekStartChange}>
            <SelectTrigger size="sm" className="w-full lg:w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">每周从周日开始</SelectItem>
              <SelectItem value="6">每周从周一开始</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-red-100 text-center text-[8px]/3 font-bold text-red-700 dark:bg-red-900 dark:text-red-300">
            休
          </span>
          法定节假日
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-red-50 text-center text-[8px]/3 font-bold text-red-400 dark:bg-red-950 dark:text-red-400">
            休
          </span>
          周末
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-gray-200 text-center text-[8px]/3 font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
            班
          </span>
          调休上班
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400" />
          节气
        </span>
      </div>

      {/* 双栏布局：移动端垂直堆叠，lg+ 水平排列 */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* 左侧：月历 */}
        <div className="flex-1 rounded-lg border bg-card p-4">
          <SingleMonthGrid
            year={year}
            month={month}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            weekStart={weekStartState}
          />
        </div>

        {/* 右侧：选中日期详情 */}
        <div className="rounded-lg border bg-card lg:w-72 lg:shrink-0">
          <DateDetailPanel selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}
