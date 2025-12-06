import { makeAutoObservable } from 'mobx';
import  FullCalendar  from '@fullcalendar/react';
import { RefObject } from 'react';

class DateStore {
  //date = '';
  fcDate: Date | undefined = undefined; //Current date of FullCalendar
  fcApi: RefObject<FullCalendar> | undefined = undefined; // Fullcalendar API
  duration: number | undefined = undefined; //Duration of all events of current view (during a week)

  constructor() {
    makeAutoObservable(this);
  }
  
  setFcDate(dat: Date | undefined) {
    this.fcDate = dat;
  }
  
  setFcApi(api: RefObject<FullCalendar>) {
    this.fcApi = api;
  }
  
  setDuration(int: number) {
    this.duration = int;
  }
}

export const dateStore = new DateStore();
