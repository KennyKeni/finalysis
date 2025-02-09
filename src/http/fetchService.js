const BASE_URL = "/api/v1";

export default async function fetchService(endpoint, request) {  
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...request,
      headers: {
        "Content-Type": "application/json",
        ...request.headers,
      },
    });
  
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
  
    if (response.status === 204) {
      return null;
    }
  
    return response.json();
  }
  