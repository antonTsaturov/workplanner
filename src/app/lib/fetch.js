  export const handleSubmitEvent = async (e) => {
    
    try {
      const response = await fetch('/api/event/[id]', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(e),
      });
      const result = await response.json();
      return result;

    } catch (error) {
      console.log(`handleSubmitEvent Error: ${error}`);
      return error;
      
    } finally {
      console.log('Event created');
    }
  };
  
  export const handleGetEventInfo = async () => {

    try {
      const response = await fetch('/api/event/[id]');
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
    
  export const handleDeleteEvent = async (eventId) => {
    
    try {
      const response = await fetch('/api/event/[id]', {
        method: 'DELETE',
        headers: {
          'X-Event-ID': eventId,
        }
      });

      if (response.ok) {
        // Remove event 
        //alert('Event deleted successfully');
        return response
      } else {
        //const error = await response.json();
        //alert(`Error: ${error.error}`);
        return response
      }
    } catch (error) {
      console.error('Delete error:', error);
      //alert('Error deleting event');
      return error
      
    } finally {
      console.log('Deleting final');
      
    }
  };


  export const handleUpdateEvent = async (e) => {
    try {
      const response = await fetch('/api/event/[id]', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(e),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Event updated')
        return result;
      } else {
        console.log(` handleUpdateEvent Error: ${result.error}`);
        return result;
      }
    } catch (error) {
      console.log(' handleUpdateEvent Error updating event');
      return result;
      
    } finally {
      console.log('final');
      
    }
  }
  // FETCH FOR USER DB
  
  export const handleRegistration = async (e) => {
    
    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(e),
      });

      const result = await response.json();
      console.log('fetch result: ', result)
      return result;

    } catch (error) {
      console.log(' handleRegistration Error creating user', error);
      
    } finally {
      console.log('final');
      
    }
  };
  
  export const handleLogin = async (e) => {
    
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(e),
      });

      const result = await response.json();
      //console.log('handleLogin Result: ', result)
      return result;

    } catch (error) {
      console.log(' handleLogin Error: ', error);
      
    } finally {
      //console.log('final');
      
    }
  };

  export const getSessionInfo = async () => {
    
    try {
      const response = await fetch('/api/user/session', {
        method: 'GET',
      });
  
      const result = await response.json()
      return result;
  
    } catch (error) {
      console.log(' getSessionInfo fetch Error: ', error);
      
    } 
  };

  
  export const logout = async () => {
    
    try {
      const response = await fetch('/api/user/logout', {
        method: 'GET',
      });
  
      const result = await response.json()
      console.log(result)
      return result;
  
    } catch (error) {
      console.log(' /app/lib/feth logout func Error: ', error);
      
    } finally {
      console.log('final');
      
    }
  };
