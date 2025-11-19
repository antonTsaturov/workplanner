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
  session: '/api/user/session',
};

export const handleFetch = async (pathKey, method, data = null) => {
  
  // Get the API path template
  let apiPath = API_PATHS[pathKey]
  
  //Read email and return events of current user
  if (method === 'GET' && data?.includes('@') && pathKey == 'event') {
      apiPath += `?email=${data}`;
  }
  //Get all events for dashboard statistics
  if (method === 'GET' && !data?.includes('@') && pathKey == 'event') {
      apiPath += '';
  }
  
  //Read email check is user already exist in staff db
  if (method === 'GET' && data?.includes('@') && pathKey == 'staff') {
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
      console.log(response.json())
      throw new Error(`HTTP error! status: ${response}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.log(`API Error: ${error}`);
    throw error; // Re-throw to let caller handle it
  }
}
