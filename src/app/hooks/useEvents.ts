import { useState, useEffect, useCallback } from 'react';
import { handleGetEventInfo, handleFetch } from '../lib/fetch'
import { useSession } from '../components/Providers';


interface CalendarEvent {
  id: number;
  author: string;
  start: string;
  end: string;
  comments: string;
  created_at: string;
  dept: string;
  duration: string;
  project: string;
  subtitle: string;
  title: string;
}

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  const { session, isLoading, refreshSession } = useSession();
    
  const fetchEvents = async () => {
    
    if (!isLoading) {
      const userEmail = session.user.email
      handleFetch('event', 'GET', userEmail)
        .then(result => {
          setEvents(result.data);
        });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [isLoading]);
  
  const reloadEvents = useCallback(() => {
    console.log('reload events')
    fetchEvents();
  }, [])
  
  return { events, reloadEvents};
}
