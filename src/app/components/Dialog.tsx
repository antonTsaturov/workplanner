import EventFormProps from './EventForm';
import { handleUpdateEvent } from '../lib/fetch';
import { useState } from 'react';



const Dialog = ({eventInfo, handleModal}: EventFormProps) => {
  //console.log('dialog: ', eventInfo)
  const [error, setError] = useState();
  
  const updateEvent = async () => {
    const response = await handleUpdateEvent(eventInfo)
    response.success ? handleModal() : setError(response.error)
  }

  return (
    <div className="modal-dialog">
      <div>
        <h3>Update event?</h3>
      </div>
      <div className="modal-dialog-container">
        <button
          className="modal-dialog-button-confirm"
          onClick={updateEvent}
        >
          <h4 className="button-text" >Update</h4>
        </button>
        <button
          className="modal-dialog-button-decline"
          onClick={handleModal}
        >
          <h4 className="button-text" >Cancel</h4>
        </button>
      </div>
        <div className="dialog-error">
          {error}
        </div>
    </div>
  )
}

export default Dialog;
