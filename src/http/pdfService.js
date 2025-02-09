export async function fetchPDF() {
  try {
    console.log("FETCH")
    const response = await fetch('/api/v1/pdf', { 
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const data = await response.json();
    console.log("DATA:", data)
    return data;
    
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return null;
  }
}
