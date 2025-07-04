import { useCalendarActions, useCalendarStore } from '@/application/stores/calendarStore';
import type { CalendarEvent } from '@/domain/entities/CalendarEvent';

const useCalendarHandlers = () => {
  const actions = useCalendarActions();
  const { view } = useCalendarStore();
  const handlePrevMonth = () => {
    actions.prevMonth();
  };
  
  const handleNextMonth = () => {
    actions.nextMonth();
  };
  
  const handlePrevWeek = () => {
    actions.prevWeek();
  };
  
  const handleNextWeek = () => {
    actions.nextWeek();
  };
  
  const handlePrevDay = () => {
    actions.prevDay();
  };
  
  const handleNextDay = () => {
    actions.nextDay();
  };
  
  const handleToday = () => {
    actions.setSelectedDate(new Date());
     // 根据当前视图重置导航
    if (view === 'week') {
      actions.setCurrentWeek(new Date());
    } else if (view === 'day') {
      actions.setCurrentDay(new Date());
    }
  };
  
  const handleSelectDate = (date: Date) => {
    actions.setSelectedDate(date);
    
    // 在日视图和周视图中更新当前日期
    if (view === 'day') {
      actions.setCurrentDay(date);
    } else if (view === 'week') {
      actions.setCurrentWeek(date);
    }
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
    handlePrevWeek,
    handleNextWeek,
    handlePrevDay,
    handleNextDay,
    handleToday,
    handleSelectDate,
    handleSelectEvent,
    handleCreateEvent,
  };
};

export default useCalendarHandlers;