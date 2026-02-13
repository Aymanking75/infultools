// api/generate.ts
   import { GoogleGenerativeAI } from "@google/generative-ai";
   import type { VercelRequest, VercelResponse } from "@vercel/node";

   export default async (req: VercelRequest, res: VercelResponse) => {
     if (req.method !== "POST") {
       return res.status(405).json({ error: "Method not allowed" });
     }

     const { prompt } = req.body;
     const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

     if (!apiKey) {
       return res.status(500).json({ error: "API key missing" });
     }

     try {
       const genAI = new GoogleGenerativeAI(apiKey);
       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
       const result = await model.generateContent(prompt);
       const response = result.response;
       const text = response.text();

       res.status(200).json({ text });
     } catch (error: any) {
       console.error(error);
       res.status(500).json({ error: error.message || "Failed to generate" });
     }
   };