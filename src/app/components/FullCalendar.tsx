'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLocale, useTranslations } from 'next-intl';

import '../styles/Calendar2.css'

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
            }, 1500);
          }
        }, 100);
      });
      
      // Change cursor to pointer
      info.el.style.cursor = 'pointer';
      // Hide other event cards
      info.el.style.display = 'contents';
      
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
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  
  const panelButton = document.querySelector('.fc-myCustomButton-button');
  const panelVisibility = (close = null) => {
    
    if (close) {
      setIsPanelVisible(false);
      calendarRerender();
      panelButton.classList.remove('fc-button-active');
      return;
    }
    
    if (!isPanelVisible) {
      panelButton.classList.add('fc-button-active');
      setIsPanelVisible(true)
      dateStore.setFcApi(calendarRef) //Month calendar will change view in FullCalendar
    } else {
      panelButton.classList.remove('fc-button-active');
      setIsPanelVisible(false)
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
        isPanelVisible={isPanelVisible}
      />

      <div className='demo-app-main'style={{width: '100%' }}>
        <FullCalendar
          locale={locale}
          views={{
            timeGrid:{
              titleFormat:{ year: 'numeric', month: 'long', day: 'numeric' },
              dayHeaderFormat: (date) => {
                const formatter = new Intl.DateTimeFormat(locale, {
                  weekday: 'long',
                  day: 'numeric',
                });
                // Get the weekday name in Russian
                let weekdayName = formatter.format(date.date.marker);
                // Capitalize first letter
                weekdayName = weekdayName.charAt(0).toUpperCase() + weekdayName.slice(1);
                return weekdayName;
              }
            },
            dayGrid:{
              titleFormat: (date) => {
                const formatter = new Intl.DateTimeFormat(locale, {
                  year: 'numeric',
                  month: 'long'
                });
                let weekdayName = formatter.format(date.date.marker);
                if (locale == 'ru') {
                  weekdayName = weekdayName.charAt(0).toUpperCase() + weekdayName.slice(1, -2);
                }
                return weekdayName;
              },
              dayHeaderFormat: (date) => {
                const length = locale == 'ru' ? 'long' : 'short'
                const formatter = new Intl.DateTimeFormat(locale, {
                  weekday: length // 'понедельник', 'вторник', etc.
                });
                // Get the weekday name in Russian
                let weekdayName = formatter.format(date.date.marker);
                if (locale == 'ru') {
                  // Capitalize first letter
                  weekdayName = weekdayName.charAt(0).toUpperCase() + weekdayName.slice(1);
                } else {
                  weekdayName = weekdayName.toUpperCase();
                }
                return weekdayName;
              }
            }
          }}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          customButtons={{
            myCustomButton: {
              text: isPanelVisible ? t('sidePanelButtonText_open') : t('sidePanelButtonText_close'),
              hint: 'Show/Hide navigation panel',
              click: function(e) {
                panelVisibility();
                
                // Remove focus from the button after click
                setTimeout(() => {
                  if (this && this.blur) {
                    this.blur();
                  } else {
                    // Fallback: find the button and blur it
                    const button = document.querySelector('.fc-myCustomButton-button');
                    if (button) button.blur();
                  }
                }, 10);
              }
            },
            customNext: {
              icon: 'chevron-right',
              hint: 'Next',
              click: function() {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.next()
                dateStore.setFcDate(calendarApi.currentData.currentDate)
                setCurDate(calendarApi.currentData.currentDate)
              }
            },
            customPrev: {
              icon: 'chevron-left',
              hint: 'Previous',
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
            right: 'dayGridMonth timeGridWeek today customPrev customNext'//'dayGridMonth timeGridWeek'
          }}
          buttonText={{
            today: t('todayButtonText'),
            timeGridWeek: t('weekButtonText'),
            dayGridMonth: t('monthButtonText'),
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
          weekends={true}
          stickyFooterScrollbar={false}
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
          eventContent={(eventInfo) => (
            <RenderEventContent
              eventInfo={eventInfo}
              t={t}
              locale={locale}
            />
            )
          } // custom render component
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
              console.log(info)
              // Optional: Add visual feedback
              setTimeout(() => {
                const dayElement = document.querySelector(`.fc-timeGridWeek-view .fc-day[data-date="${info.dateStr}"]`);
                if (dayElement) {
                  dayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  dayElement.style.backgroundColor = '#94BFE9';
                  setTimeout(() => {
                    dayElement.style.backgroundColor = '';
                  }, 1500);
                }
              }, 100);

            }
          }}
          eventDrop={handleEventUpdate}
          eventResize={handleEventUpdate}
          eventDidMount={(info) => {
            handleMonthClick(info)
          }}
          viewDidMount={(info) => {
            const myCustomButton = document.querySelector('.fc-myCustomButton-button');
            
            if (info.view.type === 'dayGridMonth') {
              // Hide button in month view
              if (myCustomButton) {
                panelVisibility(true);
                myCustomButton.style.display = 'none';
              }
            } else {
              // Show button in other views
              if (myCustomButton) {
                myCustomButton.style.display = 'block';
              }
            }
          }}
          datesSet={(info) => {
            // Remove focus from all buttons after view changes
            setTimeout(() => {
              const focusedButton = document.activeElement;
              console.log(focusedButton)
              if (focusedButton && focusedButton.classList.contains('fc-button')) {
                focusedButton.blur();
              }
            }, 10);
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

const  RenderEventContent = ({eventInfo, t, locale}) => {
  //console.log(locale)
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
        return `${Math.round(hours * 60)} ${t('min')}`;
      } else if (hours % 1 === 0) {
        return `${hours} ${t('hour')}`;
      } else {
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours % 1) * 60);
        return minutes > 0 ? `${wholeHours} ${t('hour')} ${minutes} ${t('min')}` : `${wholeHours} ${t('hour')}`;
      }
    };
    
    const color = totalDuration > 7 ? '#329901' : '#4299e1';
    
    return (
      <div className='custom-month-card' style={{background: color}}>
        {
          locale === 'en' ?
            (<div>
              {eventCount} {t('monthViewEvent')}{eventCount !== 1 ? 's' : ''}
            </div>)
          : 
            (<div>
              {t('monthViewEvent')}{eventCount}
            </div>)
        }
        <div style={{
          fontSize: '13px',
          opacity: 0.9,
          fontWeight: 'normal'
        }}>
          {t('total')}{formatDuration(totalDuration)}
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
