
  export const handleSubmitEventInfo = async (e) => {
    
    try {
      const response = await fetch('/api/event/[id]', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(e),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Success')
      } else {
        console.log(` handleSubmitEventInfo Error: ${result.error}`);
      }
    } catch (error) {
      console.log(' handleSubmitEventInfo Error creating event');
      
    } finally {
      console.log('final');
      
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
        alert('Event deleted successfully');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting event');
      
    } finally {
      console.log('Deleting final');
    }
  };

  
  
