import React from 'react';
import type { CalendarEvent } from '@/domain/entities/CalendarEvent';
import { cn } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';
import { useCalendarActions } from '@/application/stores/calendarStore';
import { Button } from '@/presentation/components/ui/button';

interface EventItemProps {
  event: CalendarEvent;
  compact?: boolean;
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 border-blue-500 text-blue-800',
  orange: 'bg-orange-100 border-orange-500 text-orange-800',
  violet: 'bg-violet-100 border-violet-500 text-violet-800',
  rose: 'bg-rose-100 border-rose-500 text-rose-800',
  emerald: 'bg-emerald-100 border-emerald-500 text-emerald-800',
};

const EventItem: React.FC<EventItemProps> = ({ event, compact = false }) => {
  const actions = useCalendarActions();
  const colorClass = colorMap[event.color || 'blue'];
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.setSelectedEvent(event);
    actions.openForm(true);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 实际应用中这里应该有确认对话框
    actions.setSelectedEvent(event);
  };

  return (
    <div 
      className={cn(
        'border-l-4 p-2 rounded-md mb-1 cursor-pointer hover:bg-opacity-80 transition-all',
        colorClass,
        compact ? 'text-xs' : 'text-sm'
      )}
      onClick={() => actions.setSelectedEvent(event)}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium truncate">{event.title}</div>
          {!compact && event.start && (
            <div className="text-xs mt-1">
              {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {event.end && ` - ${event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-white/20"
            onClick={handleEdit}
          >
            <Pencil size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-white/20"
            onClick={handleDelete}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventItem;