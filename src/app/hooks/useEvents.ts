import { useState, useEffect, useCallback, cache } from 'react';
import { handleFetch } from '../lib/fetch'
import { useSession } from '../components/Providers';


interface CalendarEvent {
  name: string;
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

interface UseEventsReturn {
  events: CalendarEvent[];
  reloadEvents: () => void;
}

export function useEvents({ props }: useEventsProps = {}): UseEventsReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { session, isLoading } = useSession();
  
  // Fetch events when dependencies change
  useEffect(() => {
    const fetchEvents = cache (async () => {
      if (isLoading) {
        return;
      }
      
      try {
        const userEmail = props === 'all' ? undefined : session?.user?.email;
        const result = await handleFetch('event', 'GET', userEmail as string);
        
        if (result?.data?.rows) {
          console.log(`${result.data.rows.length} events loaded.`);
          setEvents(result.data.rows);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    });
    
    fetchEvents();
  }, [isLoading, session, props]); // All dependencies here
  
  // Create a reload function
  const reloadEvents = useCallback(() => {
    // Re-fetch with current dependencies
    const fetchEvents = cache( async () => {
      if (isLoading) {
        return;
      }
      try {
        const userEmail = props === 'all' ? undefined : session?.user?.email;
        const result = await handleFetch('event', 'GET', userEmail as string);
        
        if (result?.data?.rows) {
          console.log(`${result.data.rows.length} events loaded.`);
          setEvents(result.data.rows);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    });
    
    fetchEvents();
  }, [isLoading, session, props]);
    
  return { events, reloadEvents };
}