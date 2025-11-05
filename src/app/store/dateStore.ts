import { makeAutoObservable } from 'mobx';

class DateStore {
  date = '';
  fcDate = '';
  fcApi = null;
  duration = null;

  constructor() {
    makeAutoObservable(this);
  }

  setDate(dat) {
    this.date = dat;
  }
  
  setFcDate(dat) {
    this.fcDate = dat;
  }
  
  setFcApi(api) {
    this.fcApi = api;
  }
  
  setDuration(int) {
    this.duration = int;
  }

  reset() {
    this.date = '';
  }
}

export const dateStore = new DateStore();
