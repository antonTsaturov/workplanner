import { useState, useEffect, useCallback } from 'react';
import { handleGetEventInfo } from '../lib/fetch'


interface EmployeeInfo {
  emplData: {
    id: number,
    name: string,
    email: string,
    phone: string,
    dept: string,
    projects: string,
    position: string,
    status: string,
    location: string,
    hireDate: string,
  }
}

export function useEvents() {
  const [employes, setEmployes] = useState<EmployeeInfo[]>([]);
  
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
