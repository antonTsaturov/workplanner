'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react';
//import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/Calendar.css'

import Modal  from './Modal'
import EventForm  from './EventForm';
import Dialog from './Dialog';
import SidePanel from './SidePanel';


import NotificationContainer from './NotificationContainer';
import useNotification from '../hooks/useNotification';

import { handleSubmitEventInfo, handleDeleteEvent, handleGetEventInfo } from '../lib/fetch'
import { useEvents } from '../hooks/useEvents';
import { useModal } from '../hooks/useModal';

import { storage } from '../utils/localStorage';
import { tasks, subtasks } from '../lib/tasks';
import { useSession } from './Providers';
import { observer } from 'mobx-react';
import { dateStore } from '../store/dateStore';

const MILLISEC_IN_HOUR = 3600000;


//###############################################################################
const Calendar = observer(() => {
  const { notifications, addNotification, removeNotification, clearAll } = useNotification();
  
  const showNotification = (type, style = 'default') => {
    const messages = {
      success: 'Completed.',
      error: 'Something went wrong. Please try again.',
      warning: 'Fill the required fields *',
      info: 'Event deleted.'
    };

    addNotification(messages[type], { type, style});
    //console.log('Current notifications:', notifications); 
  };  
  
  const { session } = useSession();
  const { events, reloadEvents } = useEvents();
  const { isModalOpen, open, close} = useModal();
  
  const user = session?.user;

  const [isEventUpdated, setIsEventUpdated] = useState(false);
  
  const [selectedPeriodInfo, setSelectedPeriodInfo] = useState({});
  const [selected, setSelected] = useState<boolean>(false);
  const [clickInfo, setClickInfo] = useState();

  function handleEventClick(info) {
    console.log(info.event)
    setClickInfo(info.event);
    setIsEventUpdated(false);
    open();
    
    setSelectedPeriodInfo({
      id: info.event.id,
      start: info.event.start,
      end: info.event.end,
      length: ((info.event.end - info.event.start) / MILLISEC_IN_HOUR),
      title: info.event.title,
      subtitle: info.event.extendedProps.subtitle,
      project: info.event.extendedProps.project,
      comments: info.event.extendedProps.comments,
    })
  }
  
  const handleNewEvent = (e) => {
    setSelected(true)
    setIsEventUpdated(false);
    open() //open modal
    setSelectedPeriodInfo({
      start: e.startStr.slice(0,-6).toString(),
      end: e.endStr.slice(0,-6).toString()
    });
  };
  
  const handleModal = (subaction) => {
    close() // close modal
    selected ? selected.view.calendar.unselect() : null; //unselect current slots after close modal
    setSelected(false) 
    subaction === 'eventDelete' && clickInfo.remove()
    setClickInfo(null) //Remove info about clicked event
    !subaction && setTimeout(()=> { 
      reloadEvents()
      console.log('handleModal: events reloaded')
    }, 900) //Reload all events after new event added only
  }
  
  const handleNotify = (status) => {
    showNotification(status)
  }
  
  const handleEventUpdate = (eventDropInfo) => {
    setIsEventUpdated(true);
    open();
    
    setSelectedPeriodInfo({
      id: eventDropInfo.event.id,
      start: eventDropInfo.event.start,
      end: eventDropInfo.event.end,
      length: ((eventDropInfo.event.end - eventDropInfo.event.start) / MILLISEC_IN_HOUR),
      title: eventDropInfo.event.title,
      subtitle: eventDropInfo.event.extendedProps.subtitle,
      project: eventDropInfo.event.extendedProps.project,
      comments: eventDropInfo.event.extendedProps.comments,
    })
  }
  
  //console.log(session)
  //if (!session) {
    //return <div>Загрузка...</div>;
  //}
  
  const calendarRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const panelVisibility = () => {
    if (!isVisible) {
      setIsVisible(true)
      dateStore.setFcApi(calendarRef) //Month calendar will change view in FullCalendar
    } else {
      setIsVisible(false)
      calendarRerender()
      
    }
  }
  
  const getEventsDuration = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      const currentViewStart = calendarApi.view.activeStart
      const currentViewEnd = calendarApi.view.activeEnd
      
      const eventsVisibleDuration = events.map(item => {
        if (currentViewStart < new Date(item.start) && new Date(item.end) < currentViewEnd) {
          return parseInt(item.length);
        } else {
          return null;
        }
      }).reduce((acc, num) => {return acc + num}, 0);

      dateStore.setDuration(eventsVisibleDuration)
      
    } else {
      console.log('Calendar API not available')
    }
  }
  
  const [curDate, setCurDate] = useState('')
  
  useEffect (()=> {
    getEventsDuration()
  }, [events, curDate, dateStore.fcDate])
  
  
  const calendarRerender = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setTimeout(()=>{calendarApi.updateSize()},400)
    }
  };
      
  return (
    <div
      className='demo-app'
      style={{display: 'flex', flexDirection:'row', width: '-webkit-fill-available'}}
    >
    
      <SidePanel
        isVisible={isVisible}
      />

      <div className='demo-app-main'style={{width: '100%' }}>
        <FullCalendar
          views={{
            timeGrid:{
              titleFormat:{ year: 'numeric', month: 'long', day: 'numeric' }
            }
          }}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          customButtons={{
            myCustomButton: {
              text: `${isVisible ? 'Hide panel' : 'Show panel'}`,
              click: function() {
                panelVisibility()
              }
            },
            customNext: {
              text: '>',
              click: function() {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.next()
                dateStore.setFcDate(calendarApi.currentData.currentDate)
                setCurDate(calendarApi.currentData.currentDate)
                //dateStore.setDuration(getEventsDuration())
              }
            },
            customPrev: {
              text: '<',
              click: function() {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.prev()
                dateStore.setFcDate(calendarApi.currentData.currentDate)
                setCurDate(calendarApi.currentData.currentDate)
                //dateStore.setDuration(getEventsDuration())
              }
            }
          }}
          headerToolbar={{
            left: 'myCustomButton',
            center: 'title',
            right: 'today customPrev customNext'//'dayGridMonth timeGridWeek'
          }}
          initialView='timeGridWeek'
          slotEventOverlap={false}
          eventOverlap={false}
          //lazyFetching={false}
          editable={true}
          selectable={true}
          selectMirror={true}
          unselectAuto={false}
          dayMaxEvents={false}
          weekends={false}
          allDaySlot={false}
          firstDay={1}
          businessHours={{
            startTime: '10:00',
            endTime: '19:00',
          }}
          slotMinTime={'09:00:00'}
          slotMaxTime={'20:00:00'}
          contentHeight={570}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'long'          
          }}
          events={events}
          select={(info) => {
            handleNewEvent(info);
            setSelected(info);
          }}
          eventContent={renderEventContent} // custom render function
          eventClick={(info)=>{
            handleEventClick(info)
          }}
          eventDrop={handleEventUpdate}
          eventResize={handleEventUpdate}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModal}>
        {!isEventUpdated ? (
          <EventForm
            handleNotify={handleNotify}
            eventInfo={selectedPeriodInfo}
            userData={user}
            handleModal={handleModal}
          />
          ) : (
          <Dialog 
            eventInfo={selectedPeriodInfo}
            handleModal={handleModal}
            handleNotify={handleNotify}
          />
          )
        }
      </Modal>
      <NotificationContainer 
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </div>
  )
})

function renderEventContent(eventInfo) {
  const duration = (eventInfo.event.end - eventInfo.event.start) / MILLISEC_IN_HOUR
  
  return (
    <div>
      <b>{eventInfo.timeText}</b>
      {duration !== 0.5 && (<br />)}
      <label>{'  '}{eventInfo.event.title}</label>
      {duration > 1 && (
        <div>
          <label><i>{eventInfo.event.extendedProps.subtitle}</i></label>
        </div>
      )}
    </div>
  )
}

export default Calendar;
