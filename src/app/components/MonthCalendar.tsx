'use client'

import React, { useState } from 'react';
import { DayPicker } from "react-day-picker";
import { ru } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { observer } from 'mobx-react';
import { dateStore } from '../store/dateStore';
import { useLocale, useTranslations } from 'next-intl';
import { format } from "date-fns";

const MonthCalendar = observer(() => {
  const [selected, setSelected] = useState<string>();
  
  const fcApi = dateStore.fcApi.current.getApi();
  
  const globalLocale = useLocale(); //String
  const locale = globalLocale === 'ru' ? ru : null; //Object
  
  return (
    <DayPicker
      locale={locale}
      formatters={{
        formatCaption: (date, options) => {
        const monthAndYear = format(date, "LLLL yyyy", options);
        return monthAndYear.charAt(0).toUpperCase() + monthAndYear.slice(1); //Captalize first letter of month
        },
      }}
      weekStartsOn={1}
      month={dateStore.fcDate}
      //If not do it - month will not be swithed after calendarApi.next or prev
      onMonthChange={(e)=>{
        console.log(e)
        dateStore.setFcDate()
      }} 
      mode="single"
      selected={selected}
      //showWeekNumber={true}
      showOutsideDays={true}
      onSelect={(date)=>{
        if (typeof date !== 'undefined') { //Prevent error if the same date was clicked twice
          setSelected(date)
          fcApi.gotoDate(date)
          dateStore.setFcDate(date) // set this date for rerender workload after click here
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
