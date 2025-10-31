import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/event';
import { handleGetEventInfo } from '../lib/fetch'


interface CalendarEvent {
  id: number;
  start: string;
  end: string;
}

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const fetchEvents = async () => {
    handleGetEventInfo()
      .then(result => {
        setEvents(result);
      });

  };

  useEffect(() => {
    fetchEvents();
  }, []);
  
  return { events };
}
