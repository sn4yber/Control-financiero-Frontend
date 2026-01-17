
export const handler = async (event, context) => {
  const { path, httpMethod, headers, body, queryStringParameters } = event;

  const BACKEND_URL = 'https://api-control-financiero.onrender.com';
  
  const queryString = new URLSearchParams(queryStringParameters).toString();
  const targetUrl = `${BACKEND_URL}${path}${queryString ? `?${queryString}` : ''}`;

  console.log(`Proxying ${httpMethod} request to: ${targetUrl}`);

  try {
    // Prepare headers
    const requestHeaders = { ...headers };
    
    // Override critical headers to prevent CORS issues at the backend
    requestHeaders['Host'] = 'api-control-financiero.onrender.com';
    requestHeaders['Origin'] = 'https://api-control-financiero.onrender.com';
    requestHeaders['Referer'] = 'https://api-control-financiero.onrender.com/';
    
    // Remove headers that might conflict or betray the proxy
    delete requestHeaders['host'];
    delete requestHeaders['origin'];
    delete requestHeaders['referer'];

    // Node generic fetch setup
    const options = {
      method: httpMethod,
      headers: requestHeaders,
    };

    // Attach body only if appropriate (not for GET/HEAD), and if body exists
    if (body && httpMethod !== 'GET' && httpMethod !== 'HEAD') {
      options.body = body;
    }

    const response = await fetch(targetUrl, options);
    
    const responseText = await response.text();

    // Convert Headers object to plain object
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      // Skip headers that can cause issues with the proxy response
      if (['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        return;
      }
      responseHeaders[key] = value;
    });

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: responseText,
    };

  } catch (error) {
    console.error('Proxy Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Proxy Error', 
        message: error.message 
      }),
    };
  }
};
