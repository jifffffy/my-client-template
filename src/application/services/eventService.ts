import apiClient from "@/infrastructure/api/apiClient";
import type {
  CalendarEvent,
  NewCalendarEvent,
} from "@/domain/entities/CalendarEvent";

// 获取所有事件
export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const response = await apiClient.get("/events");
    return response.data.map((event: any) => ({
      ...event,
      start: new Date(event.start),
      end: event.end ? new Date(event.end) : undefined,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  } 
};

// 创建新事件
export const createEvent = async (
  event: NewCalendarEvent
): Promise<CalendarEvent> => {
  const response = await apiClient.post("/events", {
    ...event,
    start: event.start.toISOString(),
    end: event.end ? event.end.toISOString() : null,
  });
  return {
    ...response.data,
    start: new Date(response.data.start),
    end: response.data.end ? new Date(response.data.end) : undefined,
  };
};

// 更新事件
export const updateEvent = async (
  id: string,
  event: Partial<CalendarEvent>
): Promise<CalendarEvent> => {
  const response = await apiClient.put(`/events/${id}`, {
    ...event,
    start: event.start ? event.start.toISOString() : undefined,
    end: event.end ? event.end.toISOString() : null,
  });
  return {
    ...response.data,
    start: new Date(response.data.start),
    end: response.data.end ? new Date(response.data.end) : undefined,
  };
};

// 删除事件
export const deleteEvent = async (id: string): Promise<void> => {
  await apiClient.delete(`/events/${id}`);
};
