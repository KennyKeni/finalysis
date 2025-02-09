import { insertBalanceSheet } from "@/db/actions/json";
import { connectToDatabase } from "@/db/dbClient";
import { getSession } from "@auth0/nextjs-auth0";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const session = await getSession(req, res);
  console.log("Session:", session);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash"});

    const prompt = "Hi, can you respond to me";
    const result = await model.generateContent([prompt])
    console.log(result.response.text())
  } catch (error) {
    console.log("nooo")
  }
}