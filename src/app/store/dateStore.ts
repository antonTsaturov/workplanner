import { makeAutoObservable } from 'mobx';

class DateStore {
  date = '';
  fcDate = '';
  fcApi = null;

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

  reset() {
    this.date = '';
  }
}

export const dateStore = new DateStore();
