const BASE_URL = "/api/v1";

export default async function fetchService(endpoint, request) {  
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...request,
      headers: {
        "Content-Type": "application/json",
        ...request.headers,
      },
    });
    console.log("Response Object:", response);
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
  
    if (response.status === 204) {
      return null;
    }
    
    console.log(response)
    return response.json();
  }
  