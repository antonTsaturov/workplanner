const API_PATHS = {
  event: '/api/event/[id]',
  staff: '/api/staff/[id]',
  register: '/api/user/register',
  login: '/api/user/login',
  logout: '/api/user/logout',
  session: '/api/user/session',
  password: '/api/user/password'
} as const;

type ApiPathKey = keyof typeof API_PATHS;

export const handleFetch = async (pathKey: ApiPathKey, method: string, data: object | string | null) => {
  
  // Get the API path template
  let apiPath = API_PATHS[pathKey]
  
  //Read email and return events of current user
  if (method === 'GET' && typeof data === 'string' &&  data?.includes('@') && pathKey == 'event') {
      apiPath += `?email=${data}`;
  }
  //Get all events for dashboard statistics
  if (method === 'GET' && typeof data !== 'string' && pathKey == 'event') {
      apiPath += '';
  }
  //Read email check is user already exist in staff db
  if (method === 'GET' && typeof data === 'string' && data?.includes('@') && pathKey == 'staff') {
      apiPath += `?email=${data}`;
  }

  const config: RequestInit = {
    method,
    headers: {},
  };
  
  //console.log(apiPath)
  if (!apiPath) {
    throw new Error(`Invalid path key: ${pathKey}`);
  }
    
  if (method === 'POST' || method === 'PUT') {
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
    };
    config.body = JSON.stringify(data);
  }
  
  if (method === 'DELETE') {
    config.headers = {
      ...config.headers,
      'X-Event-ID': data as string,
    };
  }
  
  try {
    const response = await fetch(apiPath, config);
    // All responses sending to client side 
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.log(`API Error: ${error}`);
    throw error; // Re-throw to let caller handle it
  }
}
