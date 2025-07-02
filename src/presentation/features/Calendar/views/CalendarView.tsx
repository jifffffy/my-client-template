import React from 'react';

import CalendarGrid from '@/presentation/components/Calendar/CalendarGrid';
import EventForm from '@/presentation/components/Calendar/EventForm';
import type { CalendarEvent } from '@/domain/entities/CalendarEvent';
import { Button } from '@/presentation/components/ui/button';
import { PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { format } from 'date-fns';
import CalendarHeader from '@/presentation/components/Calendar/CalenderHeader';

interface CalendarViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  isLoading: boolean;
  error?: string | null;
  handlers: {
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    handleToday: () => void;
    handleSelectDate: (date: Date) => void;
    handleCreateEvent: () => void;
  };
  selectedEvent: CalendarEvent | null;
  isFormOpen: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  events,
  isLoading,
  error,
  handlers,
  selectedEvent,
  isFormOpen,
}) => {
  const {
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleSelectDate,
    handleCreateEvent,
  } = handlers;

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />
      
      <div className="mt-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
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
        {isLoading ? (
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 35 }).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : (
          <CalendarGrid />
        )}
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={isFormOpen ? () => handleSelectDate(currentDate) : undefined}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </DialogHeader>
          <EventForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;