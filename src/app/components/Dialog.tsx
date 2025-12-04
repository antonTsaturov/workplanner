'use client'

import { handleFetch } from '../lib/fetch';

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
  handleNotify: (message: string) => void;
}


const Dialog = ({eventInfo, handleModal, handleNotify}: EventFormProps) => {
  console.log(eventInfo)

  const updateEvent = async () => {
    const response = await handleFetch('event', 'PUT', eventInfo )
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
