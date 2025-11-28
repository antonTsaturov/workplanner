'use client'

import '../styles/EventForm.css';
import { subtasks} from '../lib/tasks'
import { useState, useEffect, useMemo } from 'react';
import { handleFetch } from '../lib/fetch'
import { formatDate, formatTime } from '../utils/format'

export interface EventFormProps {
  eventInfo: {
    start: string,
    end: string,
    length: string,
    title?: string,
    subtitle?: string,
    project?: string,
    comments?: string,
  };
  userData: {
    dept: string,
    author: string,
  };
  handleModal: () => void;
  handleNotify: () => void;
}

const MILLISEC_IN_HOUR = 3600000;

const EventForm = ({eventInfo, userData, handleModal, handleNotify}: EventFormProps) => {
  
  const projects = [
    {id: 0, code: 'Please, select a project'},
    {id: 1, code: 3456},
    {id: 2, code: 9872},
    {id: 3, code: 2900},
  ];
    
  const [formData, setFormData] = useState({
    start: eventInfo.start,
    end: eventInfo.end,
    length: ((new Date(eventInfo.end) - new Date(eventInfo.start)) / MILLISEC_IN_HOUR),
    title: eventInfo?.title,
    subtitle: eventInfo?.subtitle,
    project: eventInfo?.project,
    comments: eventInfo?.comments,
    dept: userData.dept,
    author: userData.email,
    name: userData.name,
  });
  
  const isChanged = useMemo(() => 
    JSON.stringify({
      project: eventInfo.project,
      title: eventInfo.title,
      subtitle: eventInfo.subtitle,
      comments: eventInfo.comments
    }) !== JSON.stringify({
      project: formData.project,
      title: formData.title,
      subtitle: formData.subtitle,
      comments: formData.comments
    }),
    [eventInfo, formData]
  );


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  useEffect(() => {
    if (eventInfo.title) {
      setFormData(prev => ({
        ...prev,
        id: eventInfo.id
      }));
    }
  }, [])
  
  const [emptyField, setEmptyField] = useState([])
  
  const hilightEmptyFields = () => {
    setEmptyField([])
    Object.entries(formData).map((item) => {
      if (!item[1]) {
        setEmptyField(prev => [...prev, item[0]])
      }
    });
    setTimeout(()=> {setEmptyField([])}, 1500)
  }
  
  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validation

      if (!formData.project || !formData.subtitle || !formData.title) {
        handleNotify('warning')
        hilightEmptyFields()
        return;
      }

      const response = await handleFetch('event', 'POST', formData);
      
      if (!response.error) {
        handleModal()
        setTimeout(()=> {handleNotify('success')}, 400 )
      } else {
        console.log('response: ', response.message)
        setTimeout(()=> {handleNotify('error')}, 500 )
      }
      
    } catch (err) {
      setTimeout(()=> {handleNotify('error')}, 500 )
      console.log('response: ', err)
    }
  }
  
  const deleteEvent = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await handleFetch('event', 'DELETE', eventInfo.id);
        handleModal('eventDelete')
        setTimeout(()=> {handleNotify('info')}, 500 )
        
      } catch (err) {
        console.log(err)
        setTimeout(()=> {handleNotify('error')}, 500 )
      }
  }
  
  const updateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    //const id = eventInfo.id;
    const response = await handleFetch('event', 'PUT', formData)
    if (response.success) {
      handleModal()
      setTimeout(()=> {handleNotify('success')}, 500 )
    } else {
      console.log(response)
      setTimeout(()=> {handleNotify('error')}, 500 )
    }
  }


    return (
      <div className="event-form-container">
        <form className="event-form-content">
          <div className="event-form-title">
          <h3>Event Form</h3>
          </div>
          <div className="event-form-content-columns">
            <div>
              <label className="event-form-label">Event date</label>
              <input
                className="event-form-input disabled"   
                type="text"
                readOnly
                onChange={handleFormChange}
                value={formatDate(eventInfo.start)}
                disabled  
              />
              <label className="event-form-label">Time start</label>
              <input
                className="event-form-input disabled"
                type='text'
                readOnly
                name="start"
                value={formData.start}
                onChange={handleFormChange}
                value={formatTime(eventInfo.start)}
                disabled
              />
              <label className="event-form-label">Time end</label>
              <input
                className="event-form-input disabled"
                type='text'
                readOnly
                name="end"
                value={formData.end}
                onChange={handleFormChange}
                value={formatTime(eventInfo.end)}
                disabled
              />
            </div>
            
            <div>
              <label className="event-form-label">Task *</label>                     {/*TITLE*/}
              <select
                className={`${!emptyField?.includes('title') ? "event-form-select" : "event-form-select empty"}`}
                name="title"
                //value={formData.title}
                defaultValue={eventInfo?.title ? eventInfo?.title : 'Please, select task'}
                onChange={handleFormChange}
              >
                <option disabled>Please, select task</option>
              {
                subtasks[`${userData.dept}`].map(item => {
                  return <option key={item.head} value={item.head}>{item.head}</option>
                })
              }            
              </select>

              <label className="event-form-label">Sub-task *</label>                 {/*SUBTITLE*/}
              <select
                className={`${!emptyField?.includes('subtitle') ? "event-form-select" : "event-form-select empty"}`}
                name="subtitle"
                defaultValue={eventInfo?.subtitle || formData.subtitle }
                onChange={handleFormChange}
              >
                <option></option>
              { 
                subtasks[`${userData.dept}`].map(item => {
                  if (item.head === formData.title || item.head === eventInfo?.title) {
                    return item.details.map(subitem => {
                      return <option key={subitem.id} value={subitem.subtitle}>{subitem.subtitle}</option>
                    })
                  } 
                })
              }
              </select>
              <label className="event-form-label">Project *</label>
              <select 
                className={`${!emptyField?.includes('project') ? "event-form-select" : "event-form-select empty"}`}
                name="project"
                onChange={handleFormChange}
                defaultValue={eventInfo?.project}
              >
                {
                  projects.map(item => {
                    return <option key={item.id} value={item.code}>{item.code}</option>
                  })
                }
              </select>
            </div>
          </div>
          
            <label className="event-form-label">Comments</label>
            <textarea
              className="event-form-textarea"
              name="comments"
              maxLength={100}
              //value={formData.comments}
              defaultValue={eventInfo?.comments || formData.comments }
              onChange={handleFormChange}
            />
          
          <div className="event-button-container">
          { eventInfo.title ? (
            <div>
              <button onClick={deleteEvent} className="event-button-delete">
                  <h4 className="button-text">Delete</h4>
              </button>

              <button
                onClick={updateEvent}
                className={`${isChanged ? "event-button-save" : "event-button-save disabled-btn"}`}
                disabled={isChanged ? false : true }
              >
                  <h4 className="button-text">Update</h4>
              </button>
            </div>

            ) : (
            <button onClick={submitEvent} className="event-button-save" >
                <h4 className="button-text">Save</h4>
            </button>
            )
          }
          </div>


        </form>
      </div>

    );
  };
  
  export default EventForm;
