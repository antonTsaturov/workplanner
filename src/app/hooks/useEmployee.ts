import { useState, useEffect, useCallback } from 'react';
import { handleFetch } from '../lib/fetch'


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

export function useEmployee() {
  const [employees, setEmployes] = useState<EmployeeInfo[]>([]);
  
  const fetchEmplData = async () => {
    handleFetch('staff', 'GET')
      .then(result => {
        setEmployes(result.data);
      });
  };

  useEffect(() => {
    fetchEmplData();
  }, []);
  
  //console.log(employees)
  const reloadEmplData = useCallback(() => {
    fetchEmplData();
  }, [])
  
  return { employees, reloadEmplData};
}
