import { GoogleGenAI } from "@google/genai";

// Initialize the client with default key (for text tools)
let ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateToolContent = async (
  prompt: string,
  modelName: string = 'gemini-3-flash-preview'
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // fast response for tools
      }
    });

    return response.text || "عذراً، لم أتمكن من إنشاء المحتوى. حاول مرة أخرى.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء الاتصال بالخدمة. يرجى التحقق من مفتاح API والمحاولة مرة أخرى.";
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
     // Re-init for fresh key usage if needed
     ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash-image',
       contents: {
         parts: [
           { text: prompt }
         ]
       }
     });
     
     // Extract image from parts
     const parts = response.candidates?.[0]?.content?.parts;
     if (parts) {
       for (const part of parts) {
         if (part.inlineData) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
         }
       }
     }
     
     return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
