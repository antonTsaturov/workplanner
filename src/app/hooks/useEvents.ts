import { useState, useEffect, useCallback } from 'react';
import { handleGetEventInfo } from '../lib/fetch'


interface CalendarEvent {
  id: number;
  start: string;
  end: string;
  duration: number;
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
  
  //console.log(events)
  const reloadEvents = useCallback(() => {
    fetchEvents();
  }, [])
  
  return { events, reloadEvents};
}
