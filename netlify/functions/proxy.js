
import axios from 'axios';

export const handler = async (event, context) => {
  const { path, httpMethod, headers, body, queryStringParameters } = event;

  // The backend URL base
  const BACKEND_URL = 'https://api-control-financiero.onrender.com';
  
  // Construct the full target URL
  // event.path will be something like /api/auth/login
  const queryString = new URLSearchParams(queryStringParameters).toString();
  const targetUrl = `${BACKEND_URL}${path}${queryString ? `?${queryString}` : ''}`;

  console.log(`Proxying ${httpMethod} request to: ${targetUrl}`);

  try {
    const response = await axios({
      method: httpMethod,
      url: targetUrl,
      headers: {
        ...headers,
        // Override critical headers to fool the backend
        'Host': 'api-control-financiero.onrender.com', 
        'Origin': 'https://api-control-financiero.onrender.com',
        'Referer': 'https://api-control-financiero.onrender.com/',
        // Remove headers that might betray us or cause issues
        'host': undefined,
        'origin': undefined,
        'referer': undefined,
      },
      data: body,
      validateStatus: () => true, // Pass through all status codes (400, 401, 403, 500, etc)
    });

    // Filter response headers if necessary (e.g., removing tight CORS headers from backend if we want to add our own? 
    // But we are same-origin to the browser, so we likely don't need to add any, and backend ones are ignored or fine).
    // We'll just pass them along mostly.
    
    // Convert axios headers to plain object if needed (Axios headers are special objects sometimes)
    const responseHeaders = {};
    Object.entries(response.headers).forEach(([key, value]) => {
       responseHeaders[key] = String(value);
    });

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: typeof response.data === 'object' ? JSON.stringify(response.data) : response.data,
    };

  } catch (error) {
    console.error('Proxy Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Proxy Error', 
        message: error.message,
        details: error.response ? error.response.data : null 
      }),
    };
  }
};
