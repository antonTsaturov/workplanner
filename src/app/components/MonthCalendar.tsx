'use client'

import React, { useState } from 'react';
import { DayPicker } from "react-day-picker";
import { ru } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { observer } from 'mobx-react';
import { dateStore } from '../store/dateStore';
import { useLocale } from 'next-intl';
import { format } from "date-fns";
import  FullCalendar  from '@fullcalendar/react';
import { RefObject } from 'react';


const getFcApi = () => {
  try {
    if (dateStore.fcApi && 
        typeof dateStore.fcApi === 'object' && 
        'current' in dateStore.fcApi && 
        dateStore.fcApi.current) {
      return (dateStore.fcApi as RefObject<FullCalendar>).current.getApi();
    }
    return null;
  } catch (error) {
    console.error('Error getting fcApi:', error);
    return null;
  }
};


const MonthCalendar = observer(() => {
  const [selected, setSelected] = useState<Date>();
  
  const fcApi = getFcApi(); 
  
  const globalLocale = useLocale(); //String
  const locale = globalLocale === 'ru' ? ru : undefined; //Object
  
  return (
    <DayPicker
      //captionLayout="dropdown"
      startMonth={new Date(2020, 0)}
      endMonth={new Date(2030, 11)}
      navLayout="around"  
      locale={locale}
      formatters={{
        formatCaption: (date, options) => {
        const monthAndYear = format(date, "LLLL yyyy", options);
        return monthAndYear.charAt(0).toUpperCase() + monthAndYear.slice(1); //Captalize first letter of month
        },
      }}
      weekStartsOn={1}
      month={dateStore.fcDate}
      onMonthChange={(e)=>{
        dateStore.setFcDate(undefined)     // !!! If not do it - month will not be swithed
        //console.log(e)            
      }} 
      mode="single"
      selected={selected}
      //showWeekNumber={true}
      showOutsideDays={true}
      onSelect={(date: Date | undefined)=>{
        if (typeof date !== 'undefined') { //Prevent error if the same date was clicked twice
          //console.log(date)
          setSelected(date)
          fcApi?.gotoDate(date)
          dateStore.setFcDate(date) // set this date for rerender completness after click on date
        }
      }}
      numberOfMonths={1}
      disabled={{ dayOfWeek: [0, 6] }}
      required={false}
      //footer={
        //selected ? `Selected: ${selected}` : "Pick a day."
      //}
    />
  );
})

export default MonthCalendar;
