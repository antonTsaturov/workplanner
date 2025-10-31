'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../styles/Calendar.css'

import  Modal  from '../components/Modal'
import  EventForm  from '../components/EventForm';
import Dialog from '../components/Dialog';

import NotificationContainer from '../components/NotificationContainer';
import useNotification from '../hooks/useNotification';

import { handleSubmitEventInfo, handleDeleteEvent, handleGetEventInfo } from '../lib/fetch'
import { useEvents } from '../hooks/useEvents';
import { storage } from '../utils/localStorage';
import { tasks, subtasks } from '../lib/tasks';
import { useSession } from '../components/Providers';











export default function Calendar() {
  
  const calendarRef = useRef(null);
  //const [events, setEvents] = useState([]);

  // Function to refetch events
  const refetchCalendarEvents = () => {
    useEvents()
  };  
  
  
  
  
  
  
  const { session, isLoading, refreshSession } = useSession();
  const { events } = useEvents();
  const user = storage.get('user');
  const [count, setCount] = useState(0)
  
  const rerender = () => {
    setCount(prev => prev+1)
  }
  //console.log(user)
  
  const { notifications, addNotification, removeNotification, clearAll } = useNotification();
  
  const showNotification = (type, style = 'default') => {
    const messages = {
      success: 'Event added.',
      error: 'Something went wrong. Please try again.',
      warning: 'Select a project code.',
      info: 'Event deleted.'
    };

    addNotification(messages[type], { type, style});
    console.log('Current notifications:', notifications); 
  };  
  
  const [userTasks, setUserTasks] = useState();
  const [userSubtasks, setUserSubtasks] = useState();
  const [eventMoved, setEventMoved] = useState(false)

  const defineTasks = useMemo(() => {
    if (user?.dept === 'CLN') {
      setUserTasks(tasks.CLN);
      setUserSubtasks(subtasks.CLN);
    } else {
      setUserTasks(tasks.DM);
      setUserSubtasks(subtasks.DM);
    } 
    ///return {tasks, subtasks}
  }, [tasks, subtasks]);

    
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPeriodInfo, setSelectedPeriodInfo] = useState({});
  const [selected, setSelected] = useState();
  const [currentEvents, setCurrentEvents] = useState([])
  const [clickInfo, setClickInfo] = useState();

  const openModal = () => setIsModalOpen(true);  
  
  const closeModal = () => {
    setIsModalOpen(false);
    //selected ? selected.view.calendar.unselect() : null; //unselect current slots after close modal
    setSelected(false)
  }
  
  function handleEventClick(info) {
    setClickInfo(info.event);
    setEventMoved(false);
    openModal()
    setSelectedPeriodInfo({
      id: info.event.id,
      start: info.event.start,
      end: info.event.end,
      title: info.event.title,
      subtitle: info.event.extendedProps.subtitle,
      project: info.event.extendedProps.project,
      comments: info.event.extendedProps.comments,
    })
  }
  
  const handleNewEvent = (e) => {
    setSelected(true)
    setEventMoved(false);
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
  
  const handleEventMove = (eventDropInfo) => {
    setEventMoved(true)
    openModal()
    
    setSelectedPeriodInfo({
      id: eventDropInfo.event.id,
      start: eventDropInfo.event.start,
      end: eventDropInfo.event.end,
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


  return (
    <div  className='demo-app'>
      <div className='demo-app-main'>
      
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            customButtons={{
              myCustomButton: {
                text: 'side panel',
                click: function() {
                  refetchCalendarEvents();
                }
            }}}
            headerToolbar={{
              left: 'myCustomButton',
              center: 'title',
              right: 'today prev,next'//'dayGridMonth timeGridWeek'
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
              meridiem: 'long'          }}
            //select={handleDateSelect}
            events={events}
            select={(info) => {
              
              handleNewEvent(info);
              setSelected(info);
            }}
            // select={(info)=> {
            //   openModal()
            //   setSelectedPeriodInfo(info)
            // }
            eventContent={renderEventContent} // custom render function
            eventClick={(info)=>{
              handleEventClick(info)
            }}
            eventDrop={handleEventMove}
            //eventsSet={ev} // called after events are initialized/added/changed/reeventMoved
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
      </div>


      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {!eventMoved ? (
          <EventForm
            handleNotify={handleNotify}
            eventInfo={selectedPeriodInfo}
            tasks={userTasks}
            subtasks={userSubtasks}
            userData={user}
            handleModal={handleModal}
            rerender={rerender}
          />
          ) : (
          <Dialog 
            eventInfo={selectedPeriodInfo}
            handleModal={handleModal}
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
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b><br/>
      <div>{eventInfo.event.title}</div>
    </>
  )
}
