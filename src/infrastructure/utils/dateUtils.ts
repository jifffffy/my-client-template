import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfDay,
  endOfDay,
  isSameWeek,
} from "date-fns";

// 获取一周的日期
export const getWeekDays = (startDate: Date): Date[] => {
  const start = startOfWeek(startDate);
  const end = endOfWeek(startDate);
  return eachDayOfInterval({ start, end });
};

// 获取一天的日期范围
export const getDayRange = (date: Date) => {
  return {
    start: startOfDay(date),
    end: endOfDay(date),
  };
};

// 检查是否同一周
export const isSameWeekDate = (date1: Date, date2: Date): boolean => {
  return isSameWeek(date1, date2);
};

// 获取月份的所有日期
export const getMonthDays = (date: Date): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: startDate, end: endDate });
};

// 检查日期是否在当前月份
export const isCurrentMonth = (date: Date, currentDate: Date): boolean => {
  return isSameMonth(date, currentDate);
};

// 检查是否同一天
export const isSameDate = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

// 检查是否是今天
export const isTodayDate = (date: Date): boolean => {
  return isToday(date);
};

// 格式化日期
export const formatDate = (
  date: Date,
  formatStr: string = "yyyy-MM-dd"
): string => {
  return format(date, formatStr);
};

// 获取月份名称
export const getMonthName = (date: Date): string => {
  return format(date, "MMMM");
};

// 获取年份
export const getYear = (date: Date): string => {
  return format(date, "yyyy");
};
