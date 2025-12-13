'use client'

import '../styles/EventForm.css';
import { subtasks} from '../lib/tasks'
import { useState, useMemo } from 'react';
import { handleFetch } from '../lib/fetch'
import { formatDate, formatTime } from '../utils/format'
import { useTranslations } from 'next-intl';


export interface EventFormProps {
  eventInfo?: {
    id?: string,
    start?: string,
    end?: string,
    length?: string,
    title?: string,
    subtitle?: string,
    project?: string,
    comments?: string,
  };
  userData?: {
    dept?: string,
    email?: string,
    name?: string,
  };

  handleModal: (message: string) => void;
  handleNotify: (message: string) => void;
}

const MILLISEC_IN_HOUR = 3600000;

const EventForm = ({eventInfo, userData, handleModal, handleNotify}: EventFormProps) => {
  
  const t = useTranslations('eventForm');

  const projects = [
    {id: 0, code: 'Please, select a project'},
    {id: 1, code: 3456},
    {id: 2, code: 9872},
    {id: 3, code: 2900},
  ];
    
  const [formData, setFormData] = useState(() => {
    const start = eventInfo?.start ? new Date(eventInfo.start) : new Date();
    const end = eventInfo?.end ? new Date(eventInfo.end) : new Date();
    
    return {
      start: start,
      end: end,
      length: eventInfo?.start && eventInfo?.end 
        ? ((new Date(eventInfo.end).getTime() - new Date(eventInfo.start).getTime()) / MILLISEC_IN_HOUR)
        : 0,
      title: eventInfo?.title || '',
      subtitle: eventInfo?.subtitle || '',
      project: eventInfo?.project || '',
      comments: eventInfo?.comments || '',
      dept: userData?.dept || '',
      author: userData?.email || '',
      name: userData?.name || '',
    };
  });

  const isChanged = useMemo(() => {
    if (eventInfo && formData) {
      return JSON.stringify({
        project: eventInfo.project,
        title: eventInfo.title,
        subtitle: eventInfo.subtitle,
        comments: eventInfo.comments
      }) !== JSON.stringify({
        project: formData.project,
        title: formData.title,
        subtitle: formData.subtitle,
        comments: formData.comments
      })
    }
  },[eventInfo, formData] );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLSelectElement>
    | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
    
  const [emptyField, setEmptyField] = useState<string[]>([])
  
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
        handleModal('')
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
        //const response = 
        if (eventInfo) {
          const idToDel = eventInfo?.id as string;
          await handleFetch('event', 'DELETE', idToDel);
        }
        
        handleModal('EVENT_DELETE')
        setTimeout(()=> {handleNotify('info')}, 500 )
        
      } catch (err) {
        console.log(err)
        setTimeout(()=> {handleNotify('error')}, 500 )
      }
  }
  
  const updateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (eventInfo?.title) {
      setFormData(prev => ({
        ...prev,
        id: eventInfo?.id
      }));
    }
    //const id = eventInfo.id;
    const response = await handleFetch('event', 'PUT', formData)
    if (response.success) {
      handleModal('')
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
            {
              eventInfo?.title ? <h3>{t('titleEvent')}</h3> : <h3>{t('titleNewEvent')}</h3>
            }
          
          </div>
          <div className="event-form-content-columns">
            <div>
              <label className="event-form-label">{t('eventDateLabel')}</label>
              <input
                className="event-form-input disabled"   
                type="text"
                readOnly
                onChange={handleFormChange}
                value={eventInfo?.start && formatDate(eventInfo.start)}
                disabled  
              />
              <label className="event-form-label">{t('eventStartLabel')}</label>
              <input
                className="event-form-input disabled"
                type='text'
                readOnly
                name="start"
                //value={formData.start}
                onChange={handleFormChange}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                value={eventInfo?.start && formatTime(eventInfo.start)}
                disabled
              />
              <label className="event-form-label">{t('eventEndLabel')}</label>
              <input
                className="event-form-input disabled"
                type='text'
                readOnly
                name="end"
                //value={formData.end}
                onChange={handleFormChange}
                value={eventInfo?.end && formatTime(eventInfo.end)}
                disabled
              />
            </div>
            
            <div>
              <label className="event-form-label">{t('taskLabel')}</label>                     {/*TITLE*/}
              <select
                className={`${!emptyField?.includes('title') ? "event-form-select" : "event-form-select empty"}`}
                name="title"
                //value={formData.title}
                defaultValue={eventInfo?.title ? eventInfo?.title : 'Please, select task'}
                onChange={handleFormChange}
              >
                <option disabled>Please, select task</option>
              {
                (() => {
                  const dept = userData?.dept;
                  if (dept && (dept === 'CLN' || dept === 'DM')) {
                    return subtasks[dept]?.map((item: { head: string }) => (
                      <option key={item.head} value={item.head}>{item.head}</option>
                    ));
                  }
                  return null;
                })()
              }             
              </select>

              <label className="event-form-label">{t('subTaskLabel')}</label>                 {/*SUBTITLE*/}
              <select
                className={`${!emptyField?.includes('subtitle') ? "event-form-select" : "event-form-select empty"}`}
                name="subtitle"
                defaultValue={eventInfo?.subtitle || formData.subtitle }
                onChange={handleFormChange}
              >
                <option></option>
              {
                (() => {
                  const dept = userData?.dept as 'CLN' | 'DM' | undefined;
                  
                  if (!dept || !subtasks[dept]) return null;
                  
                  return subtasks[dept].map(item => {
                    if (item.head === formData.title || item.head === eventInfo?.title) {
                      return item.details.map(subitem => (
                        <option key={subitem.id} value={subitem.subtitle}>
                          {subitem.subtitle}
                        </option>
                      ));
                    }
                    return null;
                  });
                })()
              }
              </select>
              <label className="event-form-label">{t('projectLabel')}</label>
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
          
            <label className="event-form-label">{t('commentsLabel')}</label>
            <textarea
              className="event-form-textarea"
              name="comments"
              maxLength={100}
              //value={formData.comments}
              defaultValue={eventInfo?.comments || formData.comments }
              onChange={handleFormChange}
            />
          
          <div className="event-button-container">
          { eventInfo?.title ? (
            <div>
              <button onClick={deleteEvent} className="event-button-delete">
                  <h4 className="button-text">{t('deleteButtonText')}</h4>
              </button>

              <button
                onClick={updateEvent}
                className={`${isChanged ? "event-button-save" : "event-button-save disabled-btn"}`}
                disabled={isChanged ? false : true }
              >
                  <h4 className="button-text">{t('updateButtonText')}</h4>
              </button>
            </div>

            ) : (
            <button onClick={submitEvent} className="event-button-save" >
                <h4 className="button-text">{t('saveButtonText')}</h4>
            </button>
            )
          }
          </div>


        </form>
      </div>

    );
  };
  
  export default EventForm;
