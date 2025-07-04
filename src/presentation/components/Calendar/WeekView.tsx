import React from "react";
import { format, isSameDay } from "date-fns";
import { useCalendarStore } from "@/application/stores/calendarStore";
import { getWeekDays } from "@/infrastructure/utils/dateUtils";
import type { CalendarEvent } from "@/domain/entities/CalendarEvent";
import { useEventsQuery } from "@/application/view-models/useCalendarVM";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendarActions } from "@/application/stores/calendarStore";

const WeekView: React.FC = () => {
  const { currentWeek, view } = useCalendarStore();
  const actions = useCalendarActions();
  const { data: events, isPending } = useEventsQuery();

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // 获取某一天的事件
  const getEventsForDay = (date: Date): CalendarEvent[] => {
    if (!events) return [];

    return events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = event.end ? new Date(event.end) : eventStart;

      return (
        (eventStart <= date && date <= eventEnd) || isSameDay(eventStart, date)
      );
    });
  };

  // 导航到上一周
  const handlePrevWeek = () => {
    actions.prevWeek();
  };

  // 导航到下一周
  const handleNextWeek = () => {
    actions.nextWeek();
  };

  // 导航到今天
  const handleToday = () => {
    actions.setCurrentWeek(new Date());
  };

  // 选择日期
  const handleSelectDate = (date: Date) => {
    actions.setSelectedDate(date);
    actions.setCurrentDay(date);
    if (view === "day") {
      actions.setView("day");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 周导航栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">
            {format(currentWeek, "MMMM yyyy")}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={handlePrevWeek}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Previous week"
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
              onClick={handleNextWeek}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Next week"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 周视图网格 */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 min-w-[800px]">
          {/* 时间轴列 */}
          <div className="border-r"></div>

          {/* 日期列 */}
          {weekDays.map((day, index) => (
            <div key={index} className="text-center p-2 border-b">
              <div className="text-sm font-medium text-gray-500">
                {dayNames[index]}
              </div>
              <div
                className={cn(
                  "w-8 h-8 mx-auto flex items-center justify-center rounded-full",
                  isSameDay(day, new Date())
                    ? "bg-blue-500 text-white"
                    : "text-gray-900"
                )}
                onClick={() => handleSelectDate(day)}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* 时间网格 */}
        <div className="grid grid-cols-8 min-w-[800px]">
          {/* 时间轴 */}
          <div className="border-r">
            {Array.from({ length: 24 }).map((_, hour) => (
              <div
                key={hour}
                className="h-16 border-t text-right pr-2 text-xs text-gray-500"
              >
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* 每天的时间槽 */}
          {weekDays.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className="relative border-r"
              onClick={() => handleSelectDate(day)}
            >
              {Array.from({ length: 24 }).map((_, hour) => (
                <div
                  key={hour}
                  className="h-16 border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  {/* 事件将渲染在这里 */}
                </div>
              ))}

              {/* 渲染当天的事件 */}
              <div className="absolute inset-0 pointer-events-none">
                {!isPending &&
                  getEventsForDay(day).map((event, eventIndex) => {
                    const startHour = new Date(event.start).getHours();
                    const startMinutes = new Date(event.start).getMinutes();
                    const endHour = event.end
                      ? new Date(event.end).getHours()
                      : startHour + 1;
                    const endMinutes = event.end
                      ? new Date(event.end).getMinutes()
                      : 0;

                    const top = startHour * 64 + (startMinutes / 60) * 64;
                    const height =
                      (endHour - startHour + (endMinutes - startMinutes) / 60) *
                      64;

                    return (
                      <div
                        key={eventIndex}
                        className={cn(
                          "absolute left-1 right-1 rounded p-1 text-xs pointer-events-auto",
                          event.color === "blue" &&
                            "bg-blue-100 border-l-4 border-blue-500",
                          event.color === "orange" &&
                            "bg-orange-100 border-l-4 border-orange-500",
                          event.color === "violet" &&
                            "bg-violet-100 border-l-4 border-violet-500",
                          event.color === "rose" &&
                            "bg-rose-100 border-l-4 border-rose-500",
                          event.color === "emerald" &&
                            "bg-emerald-100 border-l-4 border-emerald-500"
                        )}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.setSelectedEvent(event);
                          actions.openForm(true);
                        }}
                      >
                        <div className="font-medium truncate">
                          {event.title}
                        </div>
                        <div className="text-gray-600">
                          {format(new Date(event.start), "h:mm a")}
                          {event.end &&
                            ` - ${format(new Date(event.end), "h:mm a")}`}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isPending && (
        <div className="mt-4">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mb-2" />
          <Skeleton className="h-6 w-4/5" />
        </div>
      )}
    </div>
  );
};

export default WeekView;
