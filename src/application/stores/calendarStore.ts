import { create } from "zustand";
import { addMonths, subMonths } from "date-fns";
import type { CalendarEvent } from "@/domain/entities/CalendarEvent";
import { devtools } from "zustand/middleware";

interface CalendarState {
  currentDate: Date;
  selectedDate: Date;
  selectedEvent: CalendarEvent | null;
  isFormOpen: boolean;
  isEditing: boolean;
  view: "month" | "week" | "day";

  actions: {
    nextMonth: () => void;
    prevMonth: () => void;
    setSelectedDate: (date: Date) => void;
    setSelectedEvent: (event: CalendarEvent | null) => void;
    openForm: (isEditing?: boolean) => void;
    closeForm: () => void;
    setView: (view: "month" | "week" | "day") => void;
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

    actions: {
      nextMonth: () =>
        set((state) => ({ currentDate: addMonths(state.currentDate, 1) })),
      prevMonth: () =>
        set((state) => ({ currentDate: subMonths(state.currentDate, 1) })),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedEvent: (event) => set({ selectedEvent: event }),
      openForm: (isEditing = false) => set({ isFormOpen: true, isEditing }),
      closeForm: () => set({ isFormOpen: false, selectedEvent: null }),
      setView: (view) => set({ view }),
    },
  }))
);

// 导出actions以便直接使用
export const useCalendarActions = () =>
  useCalendarStore((state) => state.actions);
