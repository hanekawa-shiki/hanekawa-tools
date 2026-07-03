/**
 * 法定节假日数据
 * 数据来源：https://github.com/NateScarlet/holiday-cn
 * 每年需要按官方公告更新
 */

export interface Holiday {
  /** 节日名称 */
  name: string;
  /** 节日日期（MM-DD 格式） */
  date: string;
  /** 是否为调休工作日 */
  isWorkday?: boolean;
}

// 2024年法定节假日
const holidays2024: Holiday[] = [
  { name: '元旦', date: '01-01' },
  { name: '春节', date: '02-04', isWorkday: true },
  { name: '春节', date: '02-10' },
  { name: '春节', date: '02-11' },
  { name: '春节', date: '02-12' },
  { name: '春节', date: '02-13' },
  { name: '春节', date: '02-14' },
  { name: '春节', date: '02-15' },
  { name: '春节', date: '02-16' },
  { name: '春节', date: '02-17' },
  { name: '春节', date: '02-18', isWorkday: true },
  { name: '清明节', date: '04-04' },
  { name: '清明节', date: '04-05' },
  { name: '清明节', date: '04-06' },
  { name: '清明节', date: '04-07', isWorkday: true },
  { name: '劳动节', date: '04-28', isWorkday: true },
  { name: '劳动节', date: '05-01' },
  { name: '劳动节', date: '05-02' },
  { name: '劳动节', date: '05-03' },
  { name: '劳动节', date: '05-04' },
  { name: '劳动节', date: '05-05' },
  { name: '劳动节', date: '05-11', isWorkday: true },
  { name: '端午节', date: '06-10' },
  { name: '中秋节', date: '09-14', isWorkday: true },
  { name: '中秋节', date: '09-15' },
  { name: '中秋节', date: '09-16' },
  { name: '中秋节', date: '09-17' },
  { name: '国庆节', date: '09-29', isWorkday: true },
  { name: '国庆节', date: '10-01' },
  { name: '国庆节', date: '10-02' },
  { name: '国庆节', date: '10-03' },
  { name: '国庆节', date: '10-04' },
  { name: '国庆节', date: '10-05' },
  { name: '国庆节', date: '10-06' },
  { name: '国庆节', date: '10-07' },
  { name: '国庆节', date: '10-12', isWorkday: true },
];

// 2025年法定节假日
const holidays2025: Holiday[] = [
  { name: '元旦', date: '01-01' },
  { name: '春节', date: '01-26', isWorkday: true },
  { name: '春节', date: '01-28' },
  { name: '春节', date: '01-29' },
  { name: '春节', date: '01-30' },
  { name: '春节', date: '01-31' },
  { name: '春节', date: '02-01' },
  { name: '春节', date: '02-02' },
  { name: '春节', date: '02-03' },
  { name: '春节', date: '02-04' },
  { name: '春节', date: '02-08', isWorkday: true },
  { name: '清明节', date: '04-04' },
  { name: '清明节', date: '04-05' },
  { name: '清明节', date: '04-06' },
  { name: '劳动节', date: '04-27', isWorkday: true },
  { name: '劳动节', date: '05-01' },
  { name: '劳动节', date: '05-02' },
  { name: '劳动节', date: '05-03' },
  { name: '劳动节', date: '05-04' },
  { name: '劳动节', date: '05-05' },
  { name: '端午节', date: '05-31' },
  { name: '端午节', date: '06-01' },
  { name: '端午节', date: '06-02' },
  { name: '国庆节、中秋节', date: '09-28', isWorkday: true },
  { name: '国庆节、中秋节', date: '10-01' },
  { name: '国庆节、中秋节', date: '10-02' },
  { name: '国庆节、中秋节', date: '10-03' },
  { name: '国庆节、中秋节', date: '10-04' },
  { name: '国庆节、中秋节', date: '10-05' },
  { name: '国庆节、中秋节', date: '10-06' },
  { name: '国庆节、中秋节', date: '10-07' },
  { name: '国庆节、中秋节', date: '10-08' },
  { name: '国庆节、中秋节', date: '10-11', isWorkday: true },
];

// 2026年法定节假日
const holidays2026: Holiday[] = [
  { name: '元旦', date: '01-01' },
  { name: '元旦', date: '01-02' },
  { name: '元旦', date: '01-03' },
  { name: '元旦', date: '01-04', isWorkday: true },
  { name: '春节', date: '02-14', isWorkday: true },
  { name: '春节', date: '02-15' },
  { name: '春节', date: '02-16' },
  { name: '春节', date: '02-17' },
  { name: '春节', date: '02-18' },
  { name: '春节', date: '02-19' },
  { name: '春节', date: '02-20' },
  { name: '春节', date: '02-21' },
  { name: '春节', date: '02-22' },
  { name: '春节', date: '02-23' },
  { name: '春节', date: '02-28', isWorkday: true },
  { name: '清明节', date: '04-04' },
  { name: '清明节', date: '04-05' },
  { name: '清明节', date: '04-06' },
  { name: '劳动节', date: '05-01' },
  { name: '劳动节', date: '05-02' },
  { name: '劳动节', date: '05-03' },
  { name: '劳动节', date: '05-04' },
  { name: '劳动节', date: '05-05' },
  { name: '劳动节', date: '05-09', isWorkday: true },
  { name: '端午节', date: '06-19' },
  { name: '端午节', date: '06-20' },
  { name: '端午节', date: '06-21' },
  { name: '国庆节', date: '09-20', isWorkday: true },
  { name: '中秋节', date: '09-25' },
  { name: '中秋节', date: '09-26' },
  { name: '中秋节', date: '09-27' },
  { name: '国庆节', date: '10-01' },
  { name: '国庆节', date: '10-02' },
  { name: '国庆节', date: '10-03' },
  { name: '国庆节', date: '10-04' },
  { name: '国庆节', date: '10-05' },
  { name: '国庆节', date: '10-06' },
  { name: '国庆节', date: '10-07' },
  { name: '国庆节', date: '10-10', isWorkday: true },
];

const holidaysByYear: Record<number, Holiday[]> = {
  2024: holidays2024,
  2025: holidays2025,
  2026: holidays2026,
};

/**
 * 获取指定日期的完整节假日信息
 * @returns Holiday 对象或 undefined
 */
export function getHolidayInfo(month: number, day: number, year: number): Holiday | undefined {
  const holidays = holidaysByYear[year] ?? [];
  const md = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return holidays.find((h) => h.date === md);
}
