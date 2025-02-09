import { GoogleGenerativeAI } from "@google/generative-ai";
import { FinancialStatementSchema } from "@/types/balanceSheet";

import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function geminiParse(buffer) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.log("Google API key is not set");
    }
    
    // Create a temporary file from the buffer
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `temp-${Date.now()}.pdf`);
    await fs.promises.writeFile(tempFile, buffer);

    const apiKey = process.env.GOOGLE_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const fileManager = new GoogleAIFileManager(apiKey);

    // Upload file to Gemini
    const uploadResult = await fileManager.uploadFile(tempFile, {
      mimeType: "application/pdf",
      displayName: "financial_statement.pdf"
    });
    const file = uploadResult.file;

    // Wait for file processing
    let activeFile = await fileManager.getFile(file.name);
    while (activeFile.state === "PROCESSING") {
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      activeFile = await fileManager.getFile(file.name);
    }
    if (activeFile.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }


    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: FinancialStatementSchema,
      }
    });

    // Log file details after ensuring the file is ACTIVE


    const chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: file.mimeType,
                fileUri: file.uri,
              },
            },
            {
            // File: improvedPrompt.js (excerpt)
            text: `You are a highly experienced professional accountant with decades of expertise in parsing and analyzing balance sheets from SEC filings. Your task is to carefully analyze the provided financial statement and extract all relevant information exactly as specified by the following schema. Please adhere to these guidelines:

            - **Monetary Values:** Report all monetary amounts in their base units (do not scale to thousands or millions).
            - **UNITS**: If presented with numbers in 'millions' like 1000, multiply by 1000000, if in 'thousands' multiply to 1000000. CONVERSION MUST BE DONE DO NOT DISCARD VALUES.
            - **JSON Output:** Return the data in valid JSON format.
            - **Data Completeness:** For any field where the required data is not found after a thorough review, set its value to null. Do not guess or fabricate any data.
            - **Strict Schema Adherence:** Follow the schema exactly without any deviations.
            - Proceed with the analysis and output your response strictly in the required JSON format.
            - Please do not return any non descriptive fields, such as 'string' return them as null insteas.
            - It may not be obvious where each text fits in the field, make your best predictions BUT AVOID MAKING UP NUMBERS AT ALL COST.
            - DATE PARAMETERS REQUIRE A DATE DO NOT PUT ANYTHING OTHER THAN DATES OR NULL`
            
            }
          ],
        }
      ],
    });


  // Updated snippet in geminiParse.js
    const result = await chatSession.sendMessage("Extract all financial data according to the schema");
    const response = await result.response.text();
  

    // Clean up temp file
    await fs.promises.unlink(tempFile);


    console.log("RESPONSE: ", response)
    try {
      const parsedData = JSON.parse(response.replace(/"\s*null\s*"/g, "null"));
      console.log(parsedData)
      return parsedData; // Since the response is an array with one object
    } catch (parseError) {
      console.log('JSON Parse Error:', parseError);
      throw new Error(`Invalid JSON returned from Gemini: ${parseError.message}`);
    }

  } catch (error) {
    console.log("Error in parsePDF:", error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}
