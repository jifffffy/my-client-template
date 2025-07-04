import { create } from "zustand";
import {
  addDays,
  addMonths,
  addWeeks,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import type { CalendarEvent } from "@/domain/entities/CalendarEvent";
import { devtools } from "zustand/middleware";

interface CalendarState {
  currentDate: Date;
  selectedDate: Date;
  selectedEvent: CalendarEvent | null;
  isFormOpen: boolean;
  isEditing: boolean;
  view: "month" | "week" | "day";
  currentWeek: Date; // 当前周的开始日期
  currentDay: Date; // 当前选中的天
  actions: {
    nextMonth: () => void;
    prevMonth: () => void;
    nextWeek: () => void;
    prevWeek: () => void;
    nextDay: () => void;
    prevDay: () => void;
    setSelectedDate: (date: Date) => void;
    setSelectedEvent: (event: CalendarEvent | null) => void;
    openForm: (isEditing?: boolean) => void;
    closeForm: () => void;
    setView: (view: "month" | "week" | "day") => void;
    setCurrentWeek: (date: Date) => void;
    setCurrentDay: (date: Date) => void;
  };
}

export const useCalendarStore = create<CalendarState>()(
  devtools((set) => ({
    currentDate: new Date(),
    selectedDate: new Date(),
    selectedEvent: null,
    isFormOpen: false,
    isEditing: false,
    view: "month",
    currentWeek: startOfWeek(new Date()), // 默认当前周的开始
    currentDay: new Date(), // 默认当天
    actions: {
      nextMonth: () =>
        set((state) => ({
          currentDate: addMonths(state.currentDate, 1),
        })),
      prevMonth: () =>
        set((state) => ({
          currentDate: subMonths(state.currentDate, 1),
        })),
      nextWeek: () =>
        set((state) => ({
          currentWeek: addWeeks(state.currentWeek, 1),
        })),
      prevWeek: () =>
        set((state) => ({
          currentWeek: subWeeks(state.currentWeek, 1),
        })),
      nextDay: () =>
        set((state) => ({
          currentDay: addDays(state.currentDay, 1),
          selectedDate: addDays(state.currentDay, 1),
        })),
      prevDay: () =>
        set((state) => ({
          currentDay: addDays(state.currentDay, -1),
          selectedDate: addDays(state.currentDay, -1),
        })),
      setSelectedDate: (date) =>
        set({
          selectedDate: date,
          currentDay: date,
        }),
      setSelectedEvent: (event) => set({ selectedEvent: event }),
      openForm: (isEditing = false) => set({ isFormOpen: true, isEditing }),
      closeForm: () => set({ isFormOpen: false, selectedEvent: null }),
      setView: (view) => set({ view }),
      setCurrentWeek: (date) => set({ currentWeek: startOfWeek(date) }),
      setCurrentDay: (date) =>
        set({
          currentDay: date,
          selectedDate: date,
        }),
    },
  }))
);

// 导出actions以便直接使用
export const useCalendarActions = () =>
  useCalendarStore((state) => state.actions);
