import { useState, useEffect, useCallback } from 'react';
import { handleFetch } from '../lib/fetch'
import { useSession } from '../components/Providers';


interface CalendarEvent {
  length: string;
  id: string;
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

interface useEventsProps {
  props?: string; //'all' || null
}

export function useEvents({props}:useEventsProps = {}) {

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  const { session, isLoading, refreshSession } = useSession();
    
  const fetchEvents = async () => {
    
    if (!isLoading) {
      try {
        const userEmail = props === 'all' ? null : session.user.email;
        handleFetch('event', 'GET', userEmail)
        .then(result => {
          console.log(`${result.data.rows.length} events loaded.`)
          setEvents(result.data.rows);
        });
      } catch (error) {
        console.log(error)
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [isLoading]);
  
  const reloadEvents = useCallback(() => {
    fetchEvents();
  })
    
  return { events, reloadEvents };
}
