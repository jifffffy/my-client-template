import React from "react";

import CalendarGrid from "@/presentation/components/Calendar/CalendarGrid";
import EventForm from "@/presentation/components/Calendar/EventForm";
import type { CalendarEvent } from "@/domain/entities/CalendarEvent";
import { Button } from "@/presentation/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { format } from "date-fns";
import CalendarHeader from "@/presentation/components/Calendar/CalenderHeader";
import {
  useCalendarActions,
  useCalendarStore,
} from "@/application/stores/calendarStore";
import WeekView from "@/presentation/components/Calendar/WeekView";
import DayView from "@/presentation/components/Calendar/DayView";

interface CalendarViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  isPending: boolean;
  error?: string | null;
  handlers: {
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    handlePrevWeek: () => void;
    handleNextWeek: () => void;
    handlePrevDay: () => void;
    handleNextDay: () => void;
    handleToday: () => void;
    handleSelectDate: (date: Date) => void;
    handleCreateEvent: () => void;
    handleSelectEvent: (event: CalendarEvent | null) => void;
  };
  selectedEvent: CalendarEvent | null;
  isFormOpen: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  events,
  isPending,
  error,
  handlers,
  selectedEvent,
  isFormOpen,
}) => {
  const { view } = useCalendarStore();
  const actions = useCalendarActions(); // 获取 store 操作
  const {
    handlePrevMonth,
    handleNextMonth,
    handlePrevWeek,
    handleNextWeek,
    handlePrevDay,
    handleNextDay,
    handleToday,
    handleSelectDate,
    handleCreateEvent,
    handleSelectEvent,
  } = handlers;

  // 对话框关闭处理函数
  const handleDialogClose = () => {
    actions.closeForm(); // 关闭表单
    handleSelectEvent(null); // 清除选中的事件
  };

  // 切换视图
  const handleViewChange = (newView: "month" | "week" | "day") => {
    actions.setView(newView);

    // 当切换到周视图时，设置当前周为选中日期所在周
    if (newView === "week") {
      actions.setCurrentWeek(currentDate);
    }

    // 当切换到日视图时，设置当前天为选中日期
    if (newView === "day") {
      actions.setCurrentDay(currentDate);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
        view={view}
        onViewChange={handleViewChange}
      />

      <div className="mt-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {view === 'month' && format(currentDate, 'MMMM yyyy')}
          {view === 'week' && `${format(currentDate, 'MMM d')} - ${format(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}`}
          {view === 'day' && format(currentDate, 'MMMM d, yyyy')}
        </h2>
        <Button onClick={handleCreateEvent}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}

      <div className="mt-4 flex-1 overflow-hidden">
        {isPending ? (
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 35 }).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {view === 'month' && <CalendarGrid />}
            {view === 'week' && <WeekView />}
            {view === 'day' && <DayView />}
          </>
        )}
      </div>

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          // 当对话框关闭时（open 变为 false）
          if (!open) {
            handleDialogClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>
          <EventForm />
        </DialogContent>
        <DialogDescription />
      </Dialog>
    </div>
  );
};

export default CalendarView;
