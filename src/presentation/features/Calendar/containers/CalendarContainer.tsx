import React from "react";
import { useCalendarStore } from "@/application/stores/calendarStore";
import CalendarView from "../views/CalendarView";
import { useEventsQuery } from "@/application/view-models/useCalendarVM";
import useCalendarHandlers from "../hooks/useCalendarHandlers";
import type { CalendarEvent } from "@/domain/entities/CalendarEvent";

const CalendarContainer: React.FC = () => {
  const { currentDate, selectedDate, selectedEvent, isFormOpen } =
    useCalendarStore();
  const { data: events, isLoading, error } = useEventsQuery();
  const handlers = useCalendarHandlers();

  // 获取选中日期的事件
  const getSelectedDateEvents = (): CalendarEvent[] => {
    if (!events) return [];

    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  return (
    <CalendarView
      currentDate={currentDate}
      events={getSelectedDateEvents()}
      isLoading={isLoading}
      error={error?.message}
      handlers={handlers}
      selectedEvent={selectedEvent}
      isFormOpen={isFormOpen}
    />
  );
};

export default CalendarContainer;
