import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/application/services/eventService";
import type {
  CalendarEvent,
  NewCalendarEvent,
} from "@/domain/entities/CalendarEvent";

export const useEventsQuery = () => {
  return useQuery<CalendarEvent[], Error>({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
};

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<CalendarEvent, Error, NewCalendarEvent>({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    CalendarEvent,
    Error,
    { id: string; event: Partial<CalendarEvent> }
  >({
    mutationFn: ({ id, event }) => updateEvent(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
