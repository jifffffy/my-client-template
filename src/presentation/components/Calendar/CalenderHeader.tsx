import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        
        <div className="flex gap-1 ml-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onPrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline"
            onClick={onToday}
          >
            Today
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline">Month</Button>
        <Button variant="outline">Week</Button>
        <Button variant="outline">Day</Button>
      </div>
    </div>
  );
};

export default CalendarHeader;