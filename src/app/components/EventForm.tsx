//import React, { useEffect, useState } from 'react';
import '../globals.css';

const EventForm = ({eventInfo}: {eventInfo: any}) => {

    function formatDate(dateString: string) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
    
    function formatTime(dateString: string) {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  
    return (
      <div className="event-form-container">
        <div className="event-form-title">
        <h3>Event Form</h3>
        </div>
        <div className="event-form-content">
          <div>
            <p>Event date</p>
            <input
              className="event-form-input"   
              type="text"
              readOnly
              value={formatDate(eventInfo.start)}
            />
            <p>Time start</p>
            <input
              className="event-form-input"
              type='text'
              readOnly
              value={formatTime(eventInfo.startStr)}
            />
            <p>Time end</p>
            <input
              className="event-form-input"
              type='text'
              readOnly
              value={formatTime(eventInfo.endStr)}
            />
            <p>Task</p>
            <select className="event-form-select">
              <option value="1">Travel to site</option>
              <option value="2">Mantain TMF</option>
              <option value="3">SDV</option>
            </select>
          </div>
          
          <div>
            <p>Sub-task</p>
            <select className="event-form-select">
              <option value="1">Sub-task 1</option>
              <option value="2">Sub-task 2</option>
              <option value="3">Sub-task 3</option>
            </select>
            <p>Project</p>
            <select className="event-form-select">
              <option value="1">4444</option>
              <option value="2">5555</option>
              <option value="3">6666</option>
            </select>
            <p>Comments</p>
            <textarea className="event-form-textarea"/>
          </div>
        </div>
      </div>
    );
  };
  
  export default EventForm;
  
  