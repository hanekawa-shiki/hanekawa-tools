import dayjs from 'dayjs';
import { getHolidayInfo } from '@/data/holidays';
import { cn } from '@/lib/utils';
import { getLunarFullInfo, getWeekOfYear } from '../calendar-utils';

interface DateDetailPanelProps {
  selectedDate: string | null;
}

export function CalendarDateDetail({ selectedDate }: DateDetailPanelProps) {
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

      {/* 农历信息 */}
      <div className="rounded-lg bg-muted/50 p-3">
        <div className="mb-1 text-xs font-medium text-muted-foreground">农历</div>
        <div className="text-sm font-medium">{lunar.fullText}</div>
        <div className="text-sm font-medium">{lunar.sbFullText}</div>
      </div>

      {/* 第几周 */}
      <div className="rounded-lg bg-muted/50 p-3">
        <div className="mb-1 text-xs font-medium text-muted-foreground">周数</div>
        <div className="text-sm font-medium">
          当前为{date.year()}年的第{weekNum}周
        </div>
      </div>

      {/* 法定节假日 */}
      {holidayInfo !== undefined && holidayInfo.isWorkday !== true && (
        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
          <div className="mb-1 text-xs font-medium text-red-400 dark:text-red-400">节假日</div>
          <div className="text-sm font-medium text-red-600 dark:text-red-400">
            {holidayInfo.name}
          </div>
        </div>
      )}

      {/* 节气 */}
      {solarTerm !== '' && (
        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
          <div className="mb-1 text-xs font-medium text-green-600 dark:text-green-400">节气</div>
          <div className="text-sm font-medium text-green-700 dark:text-green-400">{solarTerm}</div>
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
