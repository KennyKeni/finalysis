export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract our balance sheet data and question count from the request payload.
  const { balanceSheetData, count } = req.body;

  // Construct the prompt for Gemini
  const prompt = `
    Given the following balance sheet:
    ${JSON.stringify(balanceSheetData, null, 2)}
    
    Generate ${count} trivia questions related to the numbers in the financial data.
    Each question should have a text prompt and exactly three answer options.
    Mark one answer option as correct.
    Return your answer as valid JSON in this format:
    [
      {
        "question": "Your question text",
        "options": [
          { "text": "Answer 1", "correct": false },
          { "text": "Answer 2", "correct": true },
          { "text": "Answer 3", "correct": false }
        ]
      }
    ]
  `;

  try {
    // Correct request format for Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    console.log("Received Gemini API response with status:", geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error response:", errorText);
      return res.status(geminiResponse.status).json({ error: errorText });
    }

    const data = await geminiResponse.json();
    console.log("Gemini API response:", data);

    // Extract the generated text from Gemini's response
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the generated text as JSON to get the questions
    try {
      const questions = JSON.parse(generatedText);
      return res.status(200).json({ questions });
    } catch (parseError) {
      console.error("Error parsing Gemini response as JSON:", parseError);
      return res.status(500).json({ error: "Failed to parse Gemini response as JSON" });
    }

  } catch (error) {
    console.error("Error in Gemini API handler:", error);
    return res.status(500).json({ error: error.message });
  }
} 