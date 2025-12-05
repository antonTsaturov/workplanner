import { useState, useEffect, useCallback } from 'react';
import { handleFetch } from '../lib/fetch'


// interface EmployeeInfo {
//   // phone: any;
//   // dept: any;
//   // projects: any;
//   // status: string;
//   // id: number;
//   // email: any;
//   // name: any;
//   emplData: {
//     id: number,
//     name: string,
//     email: string,
//     phone: string,
//     dept: string,
//     projects: string,
//     position: string,
//     status: string,
//     location: string,
//     hireDate: string,
//   }
// }

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  dept: string | null;
  projects: string | null;
  position: string | null;
  status: string | null;
  location: string | null;
  hireDate: string | null;
}


//export function useEmployee() {
export const useEmployee = (): {
  employees: Employee[]; // Make sure it returns Employee[]
  reloadEmplData: () => void;
  // ... other return values
} => {
  //const [employees, setEmployes] = useState<EmployeeInfo['emplData']>();
  const [employees, setEmployes] = useState<Employee[]>([]);
  
  const fetchEmplData = async () => {
    handleFetch('staff', 'GET', null)
      .then(result => {
        console.log(result.data.rows)
        setEmployes(result.data.rows);
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
