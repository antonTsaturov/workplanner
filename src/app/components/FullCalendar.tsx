'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react';
//import  RefObject  from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventImpl } from '@fullcalendar/core/internal';
//import { EventDropArg } from '@fullcalendar/core';

import { useLocale, useTranslations } from 'next-intl';
import { observer } from 'mobx-react';
import { dateStore } from '../store/dateStore';
import { reaction } from 'mobx';

import '../styles/Calendar2.css'

import Modal  from './Modal'
import EventForm  from './EventForm';
import Dialog from './Dialog';
import SidePanel from './SidePanel';

import NotificationContainer from './NotificationContainer';
import useNotification from '../hooks/useNotification';

import { useEvents } from '../hooks/useEvents';
import { useModal } from '../hooks/useModal';
import { useSession } from './Providers';
import { DateSelectArg, EventClickArg, EventMountArg, EventDropArg } from '@fullcalendar/core/index.js';

const MILLISEC_IN_HOUR = 3600000;

const Calendar = observer(() => {
  
  const t = useTranslations('fullCalendar');
  const locale = useLocale();
  
  const { notifications, addNotification, removeNotification } = useNotification();
  
  type NotificationType = 'success' | 'error' | 'warning' | 'info';
  const showNotification = (type: NotificationType, style = 'default') => {
    const messages: Record<NotificationType, string> = {
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
  const [selected, setSelected] = useState<DateSelectArg | false>();
  const [clickInfo, setClickInfo] = useState<EventImpl | undefined>();

  function handleEventClick(info: EventClickArg) {
    setClickInfo(info.event);
    setIsEventUpdated(false);
    open();

    const startTime = info.event.start?.getTime() || 0;
    const endTime = info.event.end?.getTime() || 0;

    setSelectedPeriodInfo({
      id: info.event.id,
      start: info.event.start,
      end: info.event.end,
      length: ((endTime - startTime) / MILLISEC_IN_HOUR),
      title: info.event.title,
      subtitle: info.event.extendedProps.subtitle,
      project: info.event.extendedProps.project,
      comments: info.event.extendedProps.comments,
    })
  }
  
  const handleMonthClick = (info: EventMountArg) => {
    if (info.view.type === 'dayGridMonth') {
      // Add custom click handler to the event element
      info.el.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const eventDate = info.event.start;
        
        if (!eventDate) {
          console.warn('Event start date is null');
          return;
        }

        const calendar = info.view.calendar;
        // Change to week view
        calendar.changeView('timeGridWeek', eventDate);
        
        // Optional: Add visual feedback
        calendar.updateSize(); // Ensure proper rendering
        
        // Optional: Scroll to the specific day in week view
        setTimeout(() => {
          const dayElement = document.querySelector(`.fc-timeGridWeek-view .fc-day[data-date="${eventDate.toISOString().split('T')[0]}"]`) as HTMLElement;;
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
  
  const handleNewEvent = (e: DateSelectArg) => {
    setSelected(e)
    setIsEventUpdated(false);
    open() //open modal
    setSelectedPeriodInfo({
      start: e.startStr.slice(0,-6).toString(),
      end: e.endStr.slice(0,-6).toString()
    });
  };
  
  const handleModal = (subaction: string) => {
    close(); // close modal

    if (selected) {
      selected.view.calendar.unselect();
    }

    setSelected(false) 

    if (subaction === 'EVENT_DELETE' && clickInfo) {
      clickInfo.remove();
    }
    //Remove info about clicked event
    setClickInfo(undefined) 
    //Reload all events after new event added only
    if (!subaction) {
      setTimeout(() => { 
        reloadEvents();
        console.log('handleModal: events reloaded');
      }, 900);
    }

  }
  
  const handleNotify = (status: string) => {
    showNotification(status as NotificationType)
  }
  
  // const handleEventUpdate = (
  //   eventDropInfo: { 
  //     event: { 
  //       id: string; 
  //       start: Date | null;  // Allow start to be null
  //       end: Date | null;    // Allow end to be null
  //       title: string; 
  //       extendedProps: { 
  //         subtitle: string; 
  //         project: string; 
  //         comments: string; 
  //       }; 
  //     }; 
  //   }
  // ) => {
const handleEventUpdate = (eventDropInfo: EventDropArg) => {  
    setIsEventUpdated(true);
    open();

    const start = eventDropInfo.event.start || new Date();
    const end = eventDropInfo.event.end || new Date();
    const startTime = start.getTime();
    const endTime = end.getTime();

    setSelectedPeriodInfo({
      id: eventDropInfo.event.id,
      start: eventDropInfo.event.start,
      end: eventDropInfo.event.end,
      length: ((endTime - startTime) / MILLISEC_IN_HOUR),
      title: eventDropInfo.event.title,
      subtitle: eventDropInfo.event.extendedProps.subtitle,
      project: eventDropInfo.event.extendedProps.project,
      comments: eventDropInfo.event.extendedProps.comments,
    })
  }
    
  const calendarRef = useRef<FullCalendar>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  
  const panelButton = document.querySelector('.fc-myCustomButton-button') as HTMLElement;
  const panelVisibility = (close: string | null) => {
    
    if (close) {
      setIsPanelVisible(false);
      setTimeout(()=> {calendarRerender()}, 200)
      panelButton.classList.remove('fc-button-active');
      return;
    }
    
    if (!isPanelVisible) {
      panelButton.classList.add('fc-button-active');
      setIsPanelVisible(true)
      dateStore.setFcApi(calendarRef as React.RefObject<FullCalendar>) //Month calendar will change view form FullCalendar
    } else {
      panelButton.classList.remove('fc-button-active');
      setIsPanelVisible(false)
      calendarRerender()
    }
  }
  
  const getEventsDuration = useCallback(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      const currentViewStart = calendarApi.view.activeStart
      const currentViewEnd = calendarApi.view.activeEnd
      
      const eventsVisibleDuration = events
        .map(item => {
          if (currentViewStart < new Date(item.start) && new Date(item.end) < currentViewEnd) {
            return parseInt(item.length) || 0;
          } else {
            return 0;
          }
        })
        .reduce((acc, num) => {return acc + num}, 0);

      dateStore.setDuration(eventsVisibleDuration as number)
      
    } else {
      console.log('Calendar API not available')
    }
  }, [events])
  
  // useEffect for updating week complentness
  useEffect(() => {
    // Create a reaction that runs when dateStore.fcDate changes
    const dispose = reaction(
      () => dateStore.fcDate,
      () => {
        getEventsDuration();
      },
      { fireImmediately: true } // Run immediately on mount
    );
    // Cleanup reaction on unmount
    return () => dispose();
  }, [getEventsDuration]); // Keep dependency if dateStore reference changes  
  
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
              click: function() {
                panelVisibility(null);
                
                // Remove focus from the button after click
                setTimeout(() => {
                  const button = document.querySelector('.fc-myCustomButton-button') as HTMLElement;
                  if (button) {
                    button.blur();
                  }
                }, 10);
              }
            },
            customNext: {
              icon: 'chevron-right',
              hint: 'Next',
              click: function() {
                const calendarApi = calendarRef.current?.getApi();
                if (calendarApi) {
                  calendarApi.next();
                  //dateStore.setFcDate(calendarApi.currentData.currentDate);
                  const targetDate = calendarApi.getDate()
                  dateStore.setFcDate(targetDate);
                  //setCurDate(calendarApi.currentData.currentDate);
                  //setCurDate(targetDate);
                }
              }
            },
            customPrev: {
              icon: 'chevron-left',
              hint: 'Previous',
              click: function() {
                const calendarApi = calendarRef.current?.getApi();
                if (calendarApi) {
                  calendarApi.prev();
                  const targetDate = calendarApi.getDate();
                  dateStore.setFcDate(targetDate);
                  //setCurDate(targetDate);
                }
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
            meridiem: 'short'  // 'short', 'narrow', false
          }}
          events={events}
          select={(info) => {
            if (info.view.type !== 'dayGridMonth') {
              handleNewEvent(info);
              //setSelected(info);
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
              
            if (info.event.start) {
              // Change to week view and go to the clicked date
              info.view.calendar.changeView('timeGridWeek', info.event.start);
            } else {
              // Если start null, переходим без указания даты
              info.view.calendar.changeView('timeGridWeek');
            }
              return false;
            } else {
              handleEventClick(info)
            }
          }}
          dateClick={(info) => {
            if (info.view.type === 'dayGridMonth') {
              // Change to week view and go to the clicked date
              info.view.calendar.changeView('timeGridWeek', info.dateStr);
              //console.log(info)
              // Optional: Add visual feedback
              setTimeout(() => {
                const dayElement = document.querySelector(`.fc-timeGridWeek-view .fc-day[data-date="${info.dateStr}"]`) as HTMLElement;
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          eventResize={handleEventUpdate as any}
          eventDidMount={(info) => {
            handleMonthClick(info)
          }}
          viewDidMount={(info) => {
            const myCustomButton = document.querySelector('.fc-myCustomButton-button') as HTMLElement;
            
            if (info.view.type === 'dayGridMonth') {
              // Hide button in month view
              if (myCustomButton) {
                panelVisibility('close');
                myCustomButton.style.display = 'none';
              }
            } else {
              // Show button in other views
              if (myCustomButton) {
                myCustomButton.style.display = 'block';
              }
            }
          }}
          datesSet={() => {
            // Remove focus from all buttons after view changes
            setTimeout(() => {
              const focusedButton = document.activeElement as HTMLElement;
              //console.log(focusedButton)
              if (focusedButton && focusedButton.classList.contains('fc-button')) {
                focusedButton.blur();
              }
            }, 10);
          }}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={()=>handleModal('open')}>
        {!isEventUpdated ? (
          <EventForm
            handleNotify={handleNotify}
            eventInfo={selectedPeriodInfo}
            userData={user}
            handleModal={()=>handleModal('')}
          />
          ) : (
          <Dialog 
            eventInfo={selectedPeriodInfo}
            handleModal={()=>handleModal('')}
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


// interface CalendarEventInfo {
//   view: {
//     type: string;
//     calendar: {
//       getEvents: () => unknown[];
//     };
//   };
//   event: {
//     start: Date | null;
//     end: Date | null;
//     title: string;
//     extendedProps?: Record<string, unknown>;
//     [key: string]: unknown;
//   };
//   [key: string]: unknown;
// }

interface RenderEventContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventInfo: any;//CalendarEventInfo; 
  t: (key: string) => string;
  locale: string;
}

const  RenderEventContent = ({ eventInfo, t, locale }: RenderEventContentProps) => {

  if (!eventInfo) {
    return null;
  }
  // For dayGridMonth view - show aggregated summary per day
  if (eventInfo.view.type === 'dayGridMonth') {
    const currentDateStr = eventInfo.event.start.toISOString().split('T')[0];
    const allEvents = eventInfo.view.calendar.getEvents() as CalendarEvent[];;
    
    // Filter events for this specific day
    interface CalendarEvent {
      start: Date;
      end: Date;
      title: string;
      length: string;
      [key: string]: unknown; // для других свойств
    }
    const dayEvents = allEvents.filter((event: CalendarEvent) => {
      return event.start && event.start.toISOString().split('T')[0] === currentDateStr;
    });
    
    // Check if this is the first event for the day
    const isFirstEvent = dayEvents[0]?.id === eventInfo.event.id;
    
    if (!isFirstEvent) {
      return null; // Don't render for subsequent events
    }
    
    const eventCount = dayEvents.length;
    
    // Calculate total duration in hours from all events
const totalDuration = dayEvents.reduce((total, event) => {
  // Проверяем extendedProps через optional chaining
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lengthValue = (event.extendedProps as any)?.length;
  
  if (lengthValue) {
    const lengthNumber = parseFloat(lengthValue);
    return total + (isNaN(lengthNumber) ? 0 : lengthNumber);
  }
  
  // Если нет length, считаем из start/end
  if (event.start && event.end) {
    const durationMs = event.end.getTime() - event.start.getTime();
    return total + (durationMs / (1000 * 60 * 60)); // часы
  }
  
  return total;
}, 0);
    
    // Format duration display
    const formatDuration = (hours: number) => {
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
  //const MILLISEC_IN_HOUR = 1000 * 60 * 60;
  const startTime = eventInfo.event.start.getTime();
  const endTime = eventInfo.event.end.getTime();
  const duration = (endTime - startTime) / MILLISEC_IN_HOUR;

  return (
    <div>
      <b>{eventInfo.timeText as string}</b>
      {duration !== 0.5 && (<br />)}
      <label>{'  '}{eventInfo.event.title}</label>
      {duration > 1 && (
        <div>
          <label><i>{String(eventInfo.event.extendedProps?.subtitle || '')}</i></label>
        </div>
      )}
    </div>
  );
}

export default Calendar;
