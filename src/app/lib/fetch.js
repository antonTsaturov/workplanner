//export type ApiPathKey = 
  //| 'event'
  //| 'staff' 
  //| 'userRegister'
  //| 'userLogin'
  //| 'userLogout';

//// HTTP methods
//export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

//// Data types for different endpoints
//export interface UserRegisterData {
  //name: string;
  //email: string;
  //password: string;
//}

//export interface UserLoginData {
  //email: string;
  //password: string;
//}

//export interface EventData {
  //title: string;
  //description: string;
  //date: string;
  //location: string;
//}

//export interface StaffData {
  //name: string;
  //role: string;
  //email: string;
//}

//// Union type for all possible data shapes
//export type ApiData = UserRegisterData | UserLoginData | EventData | StaffData | null;

//// Path parameters interface
//export interface PathParams {
  //id?: string;
  //[key: string]: string | undefined;
//}


const API_PATHS = {
  event: '/api/event/[id]',
  staff: '/api/staff/[id]',
  register: '/api/user/register',
  login: '/api/user/login',
  logout: '/api/user/logout',
};

export const handleFetch = async (pathKey, method, data = null) => {
  // Get the API path template
  
  let apiPath = API_PATHS[pathKey]
  if (method === 'GET' && data.includes('@')) {
      apiPath += `?email=${data}`;
  }
  
  //console.log(apiPath)
  if (!apiPath) {
    throw new Error(`Invalid path key: ${pathKey}`);
  }
    
  const config = {
    method,
    headers: {},
  };
  
  if (method === 'POST' || method === 'PUT') {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(data);
  }
  
  if (method === 'DELETE') {
    config.headers['X-Event-ID'] = data;
  }
    
  try {
    const response = await fetch(apiPath, config);
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.log(`API Error: ${error}`);
    throw error; // Re-throw to let caller handle it
  }
}



//export const handleSubmitEvent = async (e) => {
  
  //try {
    //const response = await fetch('/api/event/[id]', {
      //method: 'POST',
      //headers: {
        //'Content-Type': 'application/json',
      //},
      //body: JSON.stringify(e),
    //});
    //const result = await response.json();
    //return result;

  //} catch (error) {
    //console.log(`handleSubmitEvent Error: ${error}`);
    //return error;
    
  //} finally {
    //console.log('Event created');
  //}
//};

//export const handleGetEventInfo = async () => {
  
  //try {
    //const response = await fetch('/api/event/[id]');
    //const result = await response.json();
    
    //if (result.success) {
      //return result.data;
    //}
  //} catch (error) {
    //console.error('Error fetching events:', error);
  //}
//};
  
//export const handleDeleteEvent = async (eventId) => {
  
  //try {
    //const response = await fetch('/api/event/[id]', {
      //method: 'DELETE',
      //headers: {
        //'X-Event-ID': eventId,
      //}
    //});

    //if (response.ok) {
      //// Remove event 
      //return response
    //} else {
      //return response
    //}
  //} catch (error) {
    //console.error('Delete error:', error);
    //return error
    
  //} finally {
    //console.log('Deleting final');
    
  //}
//};


//export const handleUpdateEvent = async (e) => {
  //try {
    //const response = await fetch('/api/event/[id]', {
      //method: 'PUT',
      //headers: {
        //'Content-Type': 'application/json',
      //},
      //body: JSON.stringify(e),
    //});

    //const result = await response.json();

    //if (result.success) {
      //console.log('Event updated')
      //return result;
    //} else {
      //console.log(` handleUpdateEvent Error: ${result.error}`);
      //return result;
    //}
  //} catch (error) {
    //console.log(' handleUpdateEvent Error updating event');
    //return result;
    
  //} finally {
    //console.log('final');
    
  //}
//}

// FETCH FOR USER REGISTRATION AND AUTHORIZATION

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

// FETCH FOR STAFF

export const handleSaveNewEmpl = async (e) => {

try {
  const response = await fetch('/api/staff/[id]', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(e),
  });
  const result = await response.json();
  return result;

} catch (error) {
  console.log(`handleSaveNewEmpl Error: ${error}`);
  return error;
  
}
//finally {
  //console.log('Employee record created');
//}

}
