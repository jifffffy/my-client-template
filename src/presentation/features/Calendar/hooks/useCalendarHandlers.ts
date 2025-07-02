import { useCalendarActions } from '@/application/stores/calendarStore';
import type { CalendarEvent } from '@/domain/entities/CalendarEvent';

const useCalendarHandlers = () => {
  const actions = useCalendarActions();
  
  const handlePrevMonth = () => {
    actions.prevMonth();
  };
  
  const handleNextMonth = () => {
    actions.nextMonth();
  };
  
  const handleToday = () => {
    actions.setSelectedDate(new Date());
  };
  
  const handleSelectDate = (date: Date) => {
    actions.setSelectedDate(date);
  };
  
  const handleSelectEvent = (event: CalendarEvent | null) => {
    actions.setSelectedEvent(event);
  };
  
  const handleCreateEvent = () => {
    actions.setSelectedEvent(null);
    actions.openForm();
  };
  
  return {
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleSelectDate,
    handleSelectEvent,
    handleCreateEvent,
  };
};

export default useCalendarHandlers;