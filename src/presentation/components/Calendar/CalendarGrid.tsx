import React from 'react';
import { useCalendarStore } from '@/application/stores/calendarStore';
import { getMonthDays, isCurrentMonth, isSameDate } from '@/infrastructure/utils/dateUtils';
import { format } from 'date-fns';
import EventItem from './EventItem';
import type { CalendarEvent } from '@/domain/entities/CalendarEvent';
import { useEventsQuery } from '@/application/view-models/useCalendarVM';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { cn } from '@/lib/utils';

const CalendarGrid: React.FC = () => {
  const { currentDate, selectedDate } = useCalendarStore();
  const { data: events, isPending } = useEventsQuery();
  
  const days = getMonthDays(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // 获取某一天的事件
  const getEventsForDay = (date: Date): CalendarEvent[] => {
    if (!events) return [];
    return events.filter(event => 
      isSameDate(new Date(event.start), date) ||
      (event.end && isSameDate(new Date(event.end), date)) ||
      (event.allDay && event.start <= date && event.end && date <= event.end)
    );
  };

  return (
    <div className="flex-1 bg-white rounded-lg border overflow-hidden">
      {/* 星期标题 */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期网格 */}
      <div className="grid grid-cols-7 auto-rows-[1fr]">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrent = isCurrentMonth(day, currentDate);
          const isSelected = isSameDate(day, selectedDate);
          
          return (
            <div 
              key={index}
              className={cn(
                'min-h-24 p-1 border border-gray-100 relative',
                !isCurrent && 'bg-gray-50 text-gray-400',
                isSelected && 'bg-blue-50'
              )}
            >
              <div className="flex justify-between">
                <span className={cn(
                  'w-7 h-7 flex items-center justify-center text-sm rounded-full',
                  isSelected ? 'bg-blue-500 text-white' : 'text-gray-900'
                )}>
                  {format(day, 'd')}
                </span>
                {isSameDate(day, new Date()) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
                )}
              </div>
              
              <div className="mt-1 overflow-y-auto max-h-20">
                {isPending ? (
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <>
                    {dayEvents.slice(0, 3).map((event) => (
                      <EventItem key={event.id} event={event} compact />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 mt-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;