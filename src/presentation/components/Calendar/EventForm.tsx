import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { EventColor, NewCalendarEvent } from '@/domain/entities/CalendarEvent';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/presentation/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/presentation/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/presentation/components/ui/label';
import { useCalendarStore, useCalendarActions } from '@/application/stores/calendarStore';
import { useCreateEventMutation, useUpdateEventMutation } from '@/application/view-models/useCalendarVM';

const colorOptions: EventColor[] = ['blue', 'orange', 'violet', 'rose', 'emerald'];

const EventForm: React.FC = () => {
  const { selectedEvent, isEditing } = useCalendarStore();
  const { closeForm } = useCalendarActions();
  const createMutation = useCreateEventMutation();
  const updateMutation = useUpdateEventMutation();
  
  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors },
    setValue,
    watch
  } = useForm<NewCalendarEvent>({
    defaultValues: selectedEvent ? {
      ...selectedEvent,
      start: selectedEvent.start,
      end: selectedEvent.end || undefined,
    } : {
      title: '',
      start: new Date(),
      allDay: false,
      color: 'blue',
    }
  });

  const startDate = watch('start');
  const endDate = watch('end');
  const allDay = watch('allDay');

  const onSubmit = async (data: NewCalendarEvent) => {
    try {
      if (isEditing && selectedEvent) {
        await updateMutation.mutateAsync({ id: selectedEvent.id, event: data });
      } else {
        await createMutation.mutateAsync(data);
      }
      closeForm();
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Event title"
            {...register('title', { required: 'Title is required' })}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        
        <div>
          <Label>Date & Time</Label>
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="start"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            
            {!allDay && (
              <Controller
                name="start"
                control={control}
                render={({ field }) => (
                  <Input
                    type="time"
                    value={field.value ? format(field.value, 'HH:mm') : ''}
                    onChange={(e) => {
                      const time = e.target.value.split(':');
                      const newDate = new Date(field.value);
                      newDate.setHours(parseInt(time[0]), parseInt(time[1]));
                      field.onChange(newDate);
                    }}
                  />
                )}
              />
            )}
          </div>
          
          <div className="mt-2 flex items-center">
            <input
              id="allDay"
              type="checkbox"
              {...register('allDay')}
              className="mr-2"
            />
            <Label htmlFor="allDay">All day event</Label>
          </div>
        </div>
        
        {!allDay && (
          <div>
            <Label>End Time (optional)</Label>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="end"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              
              <Controller
                name="end"
                control={control}
                render={({ field }) => (
                  <Input
                    type="time"
                    value={field.value ? format(field.value, 'HH:mm') : ''}
                    onChange={(e) => {
                      if (!field.value) {
                        const newDate = new Date(startDate);
                        newDate.setHours(0, 0);
                        field.onChange(newDate);
                      } else {
                        const time = e.target.value.split(':');
                        const newDate = new Date(field.value);
                        newDate.setHours(parseInt(time[0]), parseInt(time[1]));
                        field.onChange(newDate);
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>
        )}
        
        <div>
          <Label>Color</Label>
          <div className="flex gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full bg-${color}-500 border-2 ${
                  watch('color') === color ? 'border-black' : 'border-transparent'
                }`}
                onClick={() => setValue('color', color)}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Event description"
            {...register('description')}
            rows={3}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeForm}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isLoading || updateMutation.isLoading}>
            {isEditing ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;