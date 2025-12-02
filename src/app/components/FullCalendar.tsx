'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLocale, useTranslations } from 'next-intl';

import '../styles/Calendar.css'

import Modal  from './Modal'
import EventForm  from './EventForm';
import Dialog from './Dialog';
import SidePanel from './SidePanel';
import Loader from './Loader';


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

const Calendar = observer(() => {
  
  const t = useTranslations('fullCalendar');
  const locale = useLocale();
  
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
  
  const handleMonthClick = (info) => {
    if (info.view.type === 'dayGridMonth') {
      // Add custom click handler to the event element
      info.el.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const calendar = info.view.calendar;
        const eventDate = info.event.start;
        
        // Change to week view
        calendar.changeView('timeGridWeek', eventDate);
        
        // Optional: Add visual feedback
        calendar.updateSize(); // Ensure proper rendering
        
        // Optional: Scroll to the specific day in week view
        setTimeout(() => {
          const dayElement = document.querySelector(`.fc-timeGridWeek-view .fc-day[data-date="${eventDate.toISOString().split('T')[0]}"]`);
          if (dayElement) {
            dayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            dayElement.style.backgroundColor = 'rgba(66, 153, 225, 0.1)';
            setTimeout(() => {
              dayElement.style.backgroundColor = '';
            }, 2000);
          }
        }, 100);
      });
      
      // Change cursor to pointer
      info.el.style.cursor = 'pointer';
      info.el.title = 'Click to view day details in week view';
      
      // Optional: Add custom styling
      info.el.style.border = 'none';
      info.el.style.background = 'transparent';
    }
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
          locale={locale}
          views={{
            timeGrid:{
              titleFormat:{ year: 'numeric', month: 'long', day: 'numeric' }
            }
          }}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          customButtons={{
            myCustomButton: {
             text: isVisible ? t('sidePanelButtonText_open') : t('sidePanelButtonText_close'),
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
              }
            },
            customPrev: {
              text: '<',
              click: function() {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.prev()
                dateStore.setFcDate(calendarApi.currentData.currentDate)
                setCurDate(calendarApi.currentData.currentDate)
              }
            }
          }}
          headerToolbar={{
            left: 'myCustomButton',
            center: 'title',
            right: 'timeGridWeek dayGridMonth today customPrev customNext'//'dayGridMonth timeGridWeek'
          }}
          buttonText={{
            today: t('todayButtonText'),
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
            if (info.view.type !== 'dayGridMonth') {
              handleNewEvent(info);
              setSelected(info);
            }
          }}
          eventContent={renderEventContent} // custom render function
          eventClick={(info)=>{
            if (info.view.type === 'dayGridMonth') {
              info.jsEvent.preventDefault();
              info.jsEvent.stopPropagation();
              
              // Change to week view and go to the clicked date
              info.view.calendar.changeView('timeGridWeek', info.event.start);
              return false;
            } else {
              handleEventClick(info)
            }
          }}
          dateClick={(info) => {
            if (info.view.type === 'dayGridMonth') {
              // Change to week view and go to the clicked date
              info.view.calendar.changeView('timeGridWeek', info.dateStr);
              
              // Optional: Add visual feedback
              //highlightDayInWeekView(info.view.calendar, info.dateStr);
            }
          }}
          eventDrop={handleEventUpdate}
          eventResize={handleEventUpdate}
          eventDidMount={(info) => {
            handleMonthClick(info)
          }}
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

//function renderEventContent(eventInfo) {
  //const duration = (eventInfo.event.end - eventInfo.event.start) / MILLISEC_IN_HOUR
  
  //return (
    //<div>
      //<b>{eventInfo.timeText}</b>
      //{duration !== 0.5 && (<br />)}
      //<label>{'  '}{eventInfo.event.title}</label>
      //{duration > 1 && (
        //<div>
          //<label><i>{eventInfo.event.extendedProps.subtitle}</i></label>
        //</div>
      //)}
    //</div>
  //)
//}

function renderEventContent(eventInfo) {
  
  // For dayGridMonth view - show aggregated summary per day
  if (eventInfo.view.type === 'dayGridMonth') {
    const currentDateStr = eventInfo.event.start.toISOString().split('T')[0];
    const allEvents = eventInfo.view.calendar.getEvents();
    
    // Filter events for this specific day
    const dayEvents = allEvents.filter(event => {
      return event.start.toISOString().split('T')[0] === currentDateStr;
    });
    
    // Check if this is the first event for the day
    const isFirstEvent = dayEvents[0]?.id === eventInfo.event.id;
    
    if (!isFirstEvent) {
      return null; // Don't render for subsequent events
    }
    
    const eventCount = dayEvents.length;
    
    // Calculate total duration in hours from all events
    const totalDuration = dayEvents.reduce((total, event) => {
      // Check if event has extendedProps.length or calculate from start/end times
      if (event.extendedProps && event.extendedProps.length) {
        // If length is stored in extendedProps (assuming in hours)
        return total + parseFloat(event.extendedProps.length);
      }
      //else if (event.end && event.start) {
        //// Calculate duration from start and end times
        //const durationMs = event.end - event.start;
        //const durationHours = durationMs / (1000 * 60 * 60);
        //return total + durationHours;
      //}
      return total;
    }, 0);
    
    // Format duration display
    const formatDuration = (hours) => {
      if (hours < 1) {
        return `${Math.round(hours * 60)}min`;
      } else if (hours % 1 === 0) {
        return `${hours}h`;
      } else {
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours % 1) * 60);
        return minutes > 0 ? `${wholeHours}h ${minutes}min` : `${wholeHours}h`;
      }
    };
    
    const color = totalDuration > 7 ? '#329901' : '#4299e1';
  
    
    
    return (
      <div style={{
        background: color,
        color: 'white',
        padding: '6px 8px',
        borderRadius: '6px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '2px',
        width: '100%',
        height: '4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: '0 4px 16px #0000004a'
      }}>
        <div>
          {eventCount} event{eventCount !== 1 ? 's' : ''}
        </div>
        <div style={{
          fontSize: '11px',
          opacity: 0.9,
          fontWeight: 'normal'
        }}>
          Total: {formatDuration(totalDuration)}
        </div>
      </div>
    );
  }
  
  // Original timeGridWeek view logic
  const MILLISEC_IN_HOUR = 1000 * 60 * 60;
  const duration = (eventInfo.event.end - eventInfo.event.start) / MILLISEC_IN_HOUR;
  
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
  );
}

export default Calendar;
