import { getSession } from "@auth0/nextjs-auth0";
import { geminiParse } from "@/db/actions/geminiParse";
import formidable from 'formidable';
import fs from 'fs/promises';
import { connectToDatabase } from "@/db/dbClient";
import { getBalanceSheets, insertBalanceSheet } from "@/db/actions/balanceSheetActions";

export const config = {
  api: {
    bodyParser: false
  }
};

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 20 * 1024 * 1024, 
    });
    
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  const session = await getSession(req, res);
  
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized Access" });
  }

  try {
    switch (req.method) {
      case "GET":
        try {
          console.log("GET");
          const userId = session.user.sub;
          await connectToDatabase();
          const balanceSheetArr = await getBalanceSheets(userId);
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).json({data: balanceSheetArr});
        } catch (error) {
          return res.status(400).json({ error: error.message });
        }
      case "POST":
        try {
          const { files } = await parseForm(req);
          const file = files.pdf?.[0] || files.pdf;

          if (!file) {
            return res.status(400).json({ error: 'No PDF file provided' });
          }

          let buffer;
          try {
            buffer = await fs.readFile(file.filepath || file.path);
          } catch (readError) {
            console.error("Error reading file:", readError);
            return res.status(500).json({ 
              error: "Error reading uploaded file",
              details: readError.message 
            });
          }

          const jsonData = await geminiParse(buffer);
          
          try {
            await fs.unlink(file.filepath || file.path);
          } catch (unlinkError) {
            console.error("Error deleting temporary file:", unlinkError);
          }
          
          const userId = session.user.sub;
          const balanceSheetData = {
            ...jsonData,
            user: userId,
            period: {
              ...jsonData.period,
              periodStart: jsonData.period?.periodStart && jsonData.period.periodStart !== null
                ? new Date(jsonData.period.periodStart)
                : null,
              periodEnd: jsonData.period?.periodEnd && jsonData.period.periodEnd !== null
                ? new Date(jsonData.period.periodEnd)
                : null,
            },
            metadata: {
              source: "SEC 10-Q/K or Private Filing",
              extractedAt: new Date(), // Ensure this is stored as a Date object
            },
          };

          await connectToDatabase();
          insertBalanceSheet(balanceSheetData)

        } catch (error) {
          console.error("Error processing PDF:", error);
          return res.status(500).json({ 
            error: "Error processing PDF",
            details: error.message 
          });
        }
        
      default:
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error handling request for PDF:", error);
    return res.status(500).json({ 
      error: "Error handling API Request",
      details: error.message 
    });
  }
}
