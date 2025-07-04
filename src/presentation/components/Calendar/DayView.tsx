import React from 'react';
import { format } from 'date-fns';
import { useCalendarStore } from '@/application/stores/calendarStore';
import type { CalendarEvent } from '@/domain/entities/CalendarEvent';
import { useEventsQuery } from '@/application/view-models/useCalendarVM';
import EventItem from './EventItem';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarActions } from '@/application/stores/calendarStore';

const DayView: React.FC = () => {
  const { currentDay, view } = useCalendarStore();
  const actions = useCalendarActions();
  const { data: events, isPending } = useEventsQuery();
  
  // 获取当天的事件
  const getEventsForDay = (): CalendarEvent[] => {
    if (!events) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === currentDay.getDate() &&
        eventDate.getMonth() === currentDay.getMonth() &&
        eventDate.getFullYear() === currentDay.getFullYear()
      );
    });
  };

  // 导航到前一天
  const handlePrevDay = () => {
    actions.prevDay();
  };

  // 导航到后一天
  const handleNextDay = () => {
    actions.nextDay();
  };

  // 导航到今天
  const handleToday = () => {
    actions.setCurrentDay(new Date());
  };

  return (
    <div className="flex flex-col h-full">
      {/* 日导航栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">
            {format(currentDay, 'MMMM d, yyyy')}
          </h2>
          <div className="flex gap-1">
            <button 
              onClick={handlePrevDay}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Previous day"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={handleToday}
              className="px-2 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
            >
              Today
            </button>
            <button 
              onClick={handleNextDay}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Next day"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* 日视图网格 */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 min-w-[600px]">
          {/* 时间轴 */}
          <div className="border-r">
            {Array.from({ length: 24 }).map((_, hour) => (
              <div key={hour} className="h-16 border-t flex">
                <div className="w-16 text-right pr-2 text-xs text-gray-500 border-r">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                <div className="flex-1 relative">
                  {/* 事件将渲染在这里 */}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 渲染当天的事件 */}
        {/* <div className="absolute inset-0 pl-16 pointer-events-none mt-4">
          {!isPending && getEventsForDay().map((event, eventIndex) => {
            const startHour = new Date(event.start).getHours();
            const startMinutes = new Date(event.start).getMinutes();
            const endHour = event.end ? new Date(event.end).getHours() : startHour + 1;
            const endMinutes = event.end ? new Date(event.end).getMinutes() : 0;
            
            const top = startHour * 64 + (startMinutes / 60) * 64;
            const height = (endHour - startHour + (endMinutes - startMinutes) / 60) * 64;
            
            return (
              <div
                key={eventIndex}
                className={cn(
                  "absolute left-1 right-1 rounded p-2 text-sm pointer-events-auto",
                  event.color === 'blue' && 'bg-blue-100 border-l-4 border-blue-500',
                  event.color === 'orange' && 'bg-orange-100 border-l-4 border-orange-500',
                  event.color === 'violet' && 'bg-violet-100 border-l-4 border-violet-500',
                  event.color === 'rose' && 'bg-rose-100 border-l-4 border-rose-500',
                  event.color === 'emerald' && 'bg-emerald-100 border-l-4 border-emerald-500',
                )}
                style={{ 
                  top: `${top}px`, 
                  height: `${height}px` 
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  actions.setSelectedEvent(event);
                  actions.openForm(true);
                }}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-gray-600 text-xs">
                  {format(new Date(event.start), 'h:mm a')}
                  {event.end && ` - ${format(new Date(event.end), 'h:mm a')}`}
                </div>
                {event.location && (
                  <div className="text-gray-500 text-xs mt-1">
                    {event.location}
                  </div>
                )}
              </div>
            );
          })}
        </div> */}
      </div>
      
      {/* 事件列表视图 */}
      <div className="mt-4 border-t pt-4">
        <h3 className="font-medium mb-2">Events for {format(currentDay, 'MMMM d, yyyy')}</h3>
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            {getEventsForDay().length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No events scheduled for this day
              </div>
            ) : (
              getEventsForDay().map((event, index) => (
                <EventItem 
                  key={index} 
                  event={event} 
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayView;