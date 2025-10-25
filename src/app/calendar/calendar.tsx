'use client'
import React, { useEffect, useState } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import  Modal  from '../components/Modal'
import  EventForm  from '../components/EventForm'
import { handleSubmitEventInfo, handleDeleteEvent, handleGetEventInfo } from '../lib/fetch'
import { useEvents } from '../hooks/useEvents';

export default function Calendar() {
  //const { events } = useEvents();//Custom hook. Not use while...
  
  const [events, setEvents] = useState();
  const handleEvents = () => {
    handleGetEventInfo()
      .then(success => {
        setEvents(success);
      });
  }
  useEffect(()=>{
    handleEvents();
  }, []);
    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriodInfo, setSelectedPeriodInfo] = useState({});
  const [selected, setSelected] = useState();
  const [currentEvents, setCurrentEvents] = useState([])

  const openModal = () => setIsModalOpen(true);  
  
  const closeModal = () => {
    setIsModalOpen(false);
    selected.view.calendar.unselect(); //unselect current slots after close modal
    handleSubmitEventInfo(selectedPeriodInfo);
    handleEvents();
  }
  
  function handleEventClick(clickInfo) { //Delete
    handleDeleteEvent(clickInfo.event._def.publicId);
    clickInfo.event.remove()
  }
  
  const handlePeriodInfo = (e) => {
    console.log(e.startStr.toString());
    setSelectedPeriodInfo({
      start: e.startStr.slice(0,-6).toString(),
      end: e.endStr.slice(0,-6).toString()
    });
  };
  
  //if (!events) {
    //return <div>Загрузка календаря...</div>;
  //}
  
  return (
    <div className='demo-app'>
      <div className='demo-app-main'>
      
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            initialView='timeGridWeek'
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
              openModal();
              handlePeriodInfo(info);
              setSelected(info);
            }}
            // select={(info)=> {
            //   openModal()
            //   setSelectedPeriodInfo(info)
            // }
            // eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            //eventsSet={ev} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
      </div>


      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <EventForm 
          eventInfo={selectedPeriodInfo}
        />        
      </Modal>
      
    </div>
  )
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}
