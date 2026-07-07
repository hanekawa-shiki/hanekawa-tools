export function CalendarLegend() {
  return (
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
  );
}
