import React from "react";
import { useCalendarStore } from "@/application/stores/calendarStore";
import CalendarView from "../views/CalendarView";
import { useEventsQuery } from "@/application/view-models/useCalendarVM";
import useCalendarHandlers from "../hooks/useCalendarHandlers";
import type { CalendarEvent } from "@/domain/entities/CalendarEvent";
import { isSameDay, isSameWeek } from "date-fns";

const CalendarContainer: React.FC = () => {
  const { currentDate, selectedDate, selectedEvent, isFormOpen, view } =
    useCalendarStore();
  const { data: events, isPending, error } = useEventsQuery();
  const handlers = useCalendarHandlers();

  // 获取选中日期的事件
  const getSelectedDateEvents = (): CalendarEvent[] => {
    if (!events) return [];

     // 根据视图类型返回不同范围的事件
    if (view === 'day') {
      return events.filter(event => {
        const eventDate = new Date(event.start);
        return isSameDay(eventDate, selectedDate);
      });
    }
    
    if (view === 'week') {
      return events.filter(event => {
        const eventDate = new Date(event.start);
        return isSameWeek(eventDate, selectedDate);
      });
    }

    // 默认月视图
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  return (
    <CalendarView
      currentDate={currentDate}
      events={getSelectedDateEvents()}
      isPending={isPending}
      error={error?.message}
      handlers={handlers}
      selectedEvent={selectedEvent}
      isFormOpen={isFormOpen}
    />
  );
};

export default CalendarContainer;
