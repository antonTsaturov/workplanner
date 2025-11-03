import React, { useState } from 'react';
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { observer } from 'mobx-react';
import { dateStore } from '../store/dateStore';

const MonthCalendar = observer(() => {
  const [selected, setSelected] = useState<string>();
  
  const fcApi = dateStore.fcApi.current.getApi();
  
  return (
    <DayPicker
      weekStartsOn={1}
      month={dateStore.fcDate}
      onMonthChange={()=>dateStore.setFcDate()} //If not do it - month will not be swithed after calendarApi.next or prev
      mode="single"
      selected={selected}
      //showWeekNumber={true}
      showOutsideDays={true}
      onSelect={(date)=>{
        if (typeof date !== 'undefined') { //Prevent error if the same date was clicked twice
          setSelected(date)
          fcApi.gotoDate(date)
        }
      }}
      numberOfMonths={1}
      disabled={{ dayOfWeek: [0, 6] }}
      //footer={
        //selected ? `Selected: ${selected}` : "Pick a day."
      //}
    />
  );
})

export default MonthCalendar;
