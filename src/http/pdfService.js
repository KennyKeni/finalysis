import fetchService from "./fetchService";

export async function fetchPDF() {
    try {
      const response = await fetchService('/pdf', { method: "GET" });
  
      if (!response) {
        throw new Error("No response received");
      }
      
      return response; 
    } catch (error) {
      console.error("Error fetching PDF:", error);
      return null;
    }
  }
  