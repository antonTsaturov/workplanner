import { makeAutoObservable } from 'mobx';

class DateStore {
  //date = '';
  fcDate = ''; //Current date of FullCalendar
  fcApi = null;
  duration = null; //Duration of all events of current view (during a week)

  constructor() {
    makeAutoObservable(this);
  }

  //setDate(dat) {
    //this.date = dat;
  //}
  
  setFcDate(dat) {
    this.fcDate = dat;
  }
  
  setFcApi(api) {
    this.fcApi = api;
  }
  
  setDuration(int) {
    this.duration = int;
  }

  //reset() {
    //this.date = '';
  //}
}

export const dateStore = new DateStore();
