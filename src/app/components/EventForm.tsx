//import '../globals.css';
import '../styles/EventForm.css';
import { subtasks} from '../lib/tasks'
import { useState, useEffect } from 'react';
import { handleSubmitEvent, handleDeleteEvent } from '../lib/fetch'
import { formatDate, formatTime } from '../utils/format'

export interface EventFormProps {
  eventInfo: {
    start: string,
    end: string,
    title?: string,
    subtitle?: string,
    project?: string,
    comments?: string,
  };
  tasks: {};
  subtasks: {}; 
  userData: {
    dept: string,
    author: string,
  };
  handleModal: () => void;
  handleNotify: () => void;
}


const EventForm = ({eventInfo, tasks, subtasks, userData, handleModal, handleNotify}: EventFormProps) => {
    
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const projects = [
    {id: 0, code: 'Please, select a project'},
    {id: 1, code: 3456},
    {id: 2, code: 9872},
    {id: 3, code: 2900},
  ];
      
  const [formData, setFormData] = useState({
    start: eventInfo.start,
    end: eventInfo.end,
    title: tasks[0].title,
    subtitle: subtasks[0].details[0].subtitle,
    project: 0,
    comments: '',
    dept: userData.dept,
    author: userData.email
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    console.log('formData: ', formData)
  };

  const [currentSubtasks, setCurrentSubtasks] = useState()
  const handleTaskChange = (event) => {
    subtasks.map(item => {
      if (item.head === event.target.value) {
        //return item.details
        setCurrentSubtasks(item.details)
        //return <option key={item.details[0].subtitle} value={item.details[0].subtitle}>{item.details[0].subtitle}</option>
      }
    })
  }
  
  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      // Validation
      if (formData.project == 0) {
        //setError('Please select a project code');
        handleNotify('warning')
        return;
      }
      const response = await handleSubmitEvent(formData);
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
        setError('');
        setSuccess('');
        
        const response = await handleDeleteEvent(eventInfo.id);
        handleModal('eventDelete')
        setTimeout(()=> {handleNotify('info')}, 500 )
      } catch (err) {
        console.log(err)
        setTimeout(()=> {handleNotify('error')}, 500 )
      }
  }

    return (
      <div className="event-form-container">
        <div className="event-form-title">
        <h3>Event Form</h3>
        </div>
        <form className="event-form-content">
          <div className="event-form-content-columns">
            <div>
              <p>Event date</p>
              <input
                className="event-form-input"   
                type="text"
                readOnly
                onChange={handleFormChange}
                value={formatDate(eventInfo.start)}
              />
              <p>Time start</p>
              <input
                className="event-form-input"
                type='text'
                readOnly
                name="start"
                value={formData.start}
                onChange={handleFormChange}
                value={formatTime(eventInfo.start)}
              />
              <p>Time end</p>
              <input
                className="event-form-input"
                type='text'
                readOnly
                name="end"
                value={formData.end}
                onChange={handleFormChange}
                value={formatTime(eventInfo.end)}
              />
              <p>Task</p>                     {/*TITLE*/}
              <select
                className="event-form-select"
                name="title"
                //value={formData.title}
                defaultValue={eventInfo?.title ? eventInfo?.title : 'Please, select task'}
                onChange={(e)=>{
                  handleFormChange(e)
                  handleTaskChange(e)
                }}
              >
                <option disabled>Please, select task</option>
              {
                tasks.map(item => {
                  return <option key={item.id} value={item.title}>{item.title}</option>
                })
              }            
              </select>
            </div>
            
            <div>
              <p>Sub-task</p>                 {/*SUBTITLE*/}
              <select
                className="event-form-select"
                name="subtitle"
                defaultValue={eventInfo.subtitle}
                onChange={handleFormChange}
              >
              {!currentSubtasks ?
                subtasks.map(item => {
                  if (item.head === eventInfo.title) {
                    return item.details.map(subitem => {
                      return <option key={subitem.id} value={subitem.subtitle}>{subitem.subtitle}</option>
                      
                    })
                  } else {
                    
                    //return <option key={item.details[0].subtitle} value={item.details[0].subtitle}>{item.details[0].subtitle}</option>
                  }
                }) :
                currentSubtasks.map(item => {
                  return <option key={item.id} value={item.subtitle}>{item.subtitle}</option>
                })
              }            
              </select>
              <p>Project</p>
              <select 
                className="event-form-select"
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
              <p>Comments</p>
              <textarea
                className="event-form-textarea"
                name="comments"
                value={formData.comments}
                onChange={handleFormChange}
              />
            </div>
          </div>
          
          <div className="event-button-container">
          { eventInfo.title ? (
            <button onClick={deleteEvent} className="event-button-delete">
                <h4 className="button-text">Delete</h4>
            </button>
            
            ) : (
              <div/>
            )
          }
            <button onClick={submitEvent} className="event-button-save">
                <h4 className="button-text">Save</h4>
            </button>
          </div>


        </form>
      </div>

    );
  };
  
  export default EventForm;
