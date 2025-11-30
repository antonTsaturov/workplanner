'use client'

import EventFormProps from './EventForm';
import { handleFetch } from '../lib/fetch';
import { useState } from 'react';



const Dialog = ({eventInfo, handleModal, handleNotify}: EventFormProps) => {
  console.log(eventInfo)
  const updateEvent = async () => {
    const response = await handleFetch('event', 'PUT', eventInfo)
    if (response.success) {
      handleModal()
      setTimeout(()=> {handleNotify('success')}, 500 )
    } else {
      console.log(response)
      setTimeout(()=> {handleNotify('error')}, 500 )
    }
  }

  return (
    <div className="modal-dialog">
      <div>
        <h3>Update event?</h3>
      </div>
      <div className="modal-dialog-container">
        <button
          className="modal-dialog-button-decline"
          onClick={handleModal}
        >
          <h4 className="button-text" >Cancel</h4>
        </button>
        <button
          className="modal-dialog-button-confirm"
          onClick={updateEvent}
        >
          <h4 className="button-text" >Update</h4>
        </button>
      </div>
    </div>
  )
}

export default Dialog;
