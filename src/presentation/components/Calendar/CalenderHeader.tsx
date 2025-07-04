import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  view: "month" | "week" | "day";
  onViewChange: (view: "month" | "week" | "day") => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onPrevWeek,
  onNextWeek,
  onPrevDay,
  onNextDay,
  onToday,
  view,
  onViewChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">
          {format(
            currentDate,
            view === "month"
              ? "MMMM yyyy"
              : view === "week"
              ? "MMMM yyyy"
              : "MMMM d, yyyy"
          )}
        </h1>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={
              view === "month"
                ? onPrevMonth
                : view === "week"
                ? onPrevWeek
                : onPrevDay
            }
            aria-label={
              view === "month"
                ? "Previous month"
                : view === "week"
                ? "Previous week"
                : "Previous day"
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={onToday}>
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={
              view === "month"
                ? onNextMonth
                : view === "week"
                ? onNextWeek
                : onNextDay
            }
            aria-label={
              view === "month"
                ? "Next month"
                : view === "week"
                ? "Next week"
                : "Next day"
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={view === "month" ? "default" : "outline"}
          onClick={() => onViewChange("month")}
        >
          Month
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          onClick={() => onViewChange("week")}
        >
          Week
        </Button>
        <Button
          variant={view === "day" ? "default" : "outline"}
          onClick={() => onViewChange("day")}
        >
          Day
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
