'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react';
//import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/Calendar.css'

import  Modal  from './Modal'
import  EventForm  from './EventForm';
import Dialog from './Dialog';
import SidePanel from './SidePanel';


import NotificationContainer from './NotificationContainer';
import useNotification from '../hooks/useNotification';

import { handleSubmitEventInfo, handleDeleteEvent, handleGetEventInfo } from '../lib/fetch'
import { useEvents } from '../hooks/useEvents';
import { storage } from '../utils/localStorage';
import { tasks, subtasks } from '../lib/tasks';
import { useSession } from './Providers';
import { showNotification } from '../utils/notifications';
import { observer } from 'mobx-react';
import { dateStore } from '../store/dateStore';

const MILLISEC_IN_HOUR = 3600000;


//###############################################################################
const Calendar = observer(() => {
  const { notifications, addNotification, removeNotification, clearAll } = useNotification();
  
  const showNotification = (type, style = 'default') => {
    const messages = {
      success: 'Operation completed.',
      error: 'Something went wrong. Please try again.',
      warning: 'Select a project code.',
      info: 'Event deleted.'
    };

    addNotification(messages[type], { type, style});
    //console.log('Current notifications:', notifications); 
  };  
  
  const { session } = useSession();
  
  const { events, reloadEvents } = useEvents();
  const user = session?.user;
  const [count, setCount] = useState(0)

  const [userTasks, setUserTasks] = useState();
  const [userSubtasks, setUserSubtasks] = useState();
  const [isEventUpdated, setIsEventUpdated] = useState(false);
  const [eventResized, setEventResized] = useState(false);
  

  const defineTasks = useMemo(() => {
    if (user?.dept === 'CLN') {
      setUserTasks(tasks.CLN);
      setUserSubtasks(subtasks.CLN);
    } else {
      setUserTasks(tasks.DM);
      setUserSubtasks(subtasks.DM);
    } 
  }, [tasks, subtasks, session]);

    
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPeriodInfo, setSelectedPeriodInfo] = useState({});
  const [selected, setSelected] = useState();
  const [currentEvents, setCurrentEvents] = useState([])
  const [clickInfo, setClickInfo] = useState();

  const openModal = () => setIsModalOpen(true);  
  
  const closeModal = () => {
    setIsModalOpen(false);
    selected ? selected.view.calendar.unselect() : null; //unselect current slots after close modal
    setSelected(false)
    reloadEvents()
  }
  
  function handleEventClick(info) {
    setClickInfo(info.event);
    setIsEventUpdated(false);
    openModal()
    setSelectedPeriodInfo({
      id: info.event.id,
      start: info.event.start,
      end: info.event.end,
      duration: ((info.event.end - info.event.start) / MILLISEC_IN_HOUR),
      title: info.event.title,
      subtitle: info.event.extendedProps.subtitle,
      project: info.event.extendedProps.project,
      comments: info.event.extendedProps.comments,
    })
  }
  
  const handleNewEvent = (e) => {
    setSelected(true)
    setIsEventUpdated(false);
    openModal()
    setSelectedPeriodInfo({
      start: e.startStr.slice(0,-6).toString(),
      end: e.endStr.slice(0,-6).toString()
    });
  };
  
  const handleModal = (subaction) => {
    closeModal()
    subaction === 'eventDelete' && clickInfo.remove()
    setClickInfo(null)
  }
  
  const handleNotify = (status) => {
    showNotification(status)
  }
  
  const handleEventUpdate = (eventDropInfo) => {
    setIsEventUpdated(true)
    openModal()
    
    setSelectedPeriodInfo({
      id: eventDropInfo.event.id,
      start: eventDropInfo.event.start,
      end: eventDropInfo.event.end,
      duration: ((eventDropInfo.event.end - eventDropInfo.event.start) / MILLISEC_IN_HOUR),
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
      dateStore.setFcApi(calendarRef)
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
      
      // Получаем все события
      const allEvents = calendarApi.getEvents()
      
      // Фильтруем события по видимой области
      const visibleEvents = allEvents.filter(event => {
        const eventStart = event.start
        const eventEnd = event.end || eventStart
        return (eventStart > currentViewStart && eventEnd < currentViewEnd)
      })
      
      const eventsDuration = visibleEvents.map(event => ({
        duration: ((event.end - event.start) / MILLISEC_IN_HOUR),
      }))
       
      
      const result = eventsDuration.reduce((sum, item) => sum + item.duration, 0); //sum durations of visible events
      dateStore.setDuration(result)
    } else {
      console.log('Calendar API not available')
    }
  }
  getEventsDuration()
  
    
  const calendarRerender = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setTimeout(()=>{calendarApi.updateSize()},400)
    }
  };
      
  return (
    <div className='demo-app' style={{display: 'flex', flexDirection:'row', width: '-webkit-fill-available'}}>
    
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
                getEventsDuration()
              }
            },
            customPrev: {
              text: '<',
              click: function() {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.prev()
                dateStore.setFcDate(calendarApi.currentData.currentDate)
                getEventsDuration()
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

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {!isEventUpdated ? (
          <EventForm
            handleNotify={handleNotify}
            eventInfo={selectedPeriodInfo}
            tasks={userTasks}
            subtasks={userSubtasks}
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
  return (
    <div>
      <b>{eventInfo.timeText}</b><br/>
      <div>{eventInfo.event.title}</div>
    </div>
  )
}

export default Calendar;
