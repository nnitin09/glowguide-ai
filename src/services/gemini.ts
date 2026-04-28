import { GoogleGenAI, Type } from "@google/genai";

export interface MakeupRecommendation {
  skinTone: string;
  undertone: string;
  faceShape: string;
  skinType: string;
  recommendations: {
    foundation: string;
    lipstick: string;
    lipstickHex: string;
    eyeshadow: string;
    eyeshadowHex: string;
    blush: string;
    blushHex: string;
    overallStyle: string;
  };
  explanation: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export async function chatWithBeautyBot(history: ChatMessage[], newMessage: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const contents = [...history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  })), { role: 'user', parts: [{ text: newMessage }] }];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: "You are GlowGuide AI, a friendly beauty, makeup, and skincare expert. Your goal is to provide helpful, easy-to-understand, and personalized beauty advice. Explain things simply using everyday English so that anyone can understand, avoiding complex jargon or overly scientific terms. When a user asks about a concern or look, suggest simple product types, easy-to-find ingredients, and clear, step-by-step instructions. Ask the user simple questions about their skin type or what they like. Format your responses beautifully using markdown, with clear headings, bullet points, and bold text so it's easy to read. Respond ONLY to queries related to beauty, makeup, skincare, and styling. Politely decline any off-topic requests.",
      }
    });

    return response.text || "I'm sorry, I couldn't provide a response.";
  } catch (error: any) {
    console.error("Gemini API Error in chat:", error);
    throw new Error(error.message || "An unexpected error occurred during chat.");
  }
}

function cleanJsonResponse(text: string): string {
  // Remove markdown codeblock wrapping if it exists
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return match ? match[1] : text;
}

export async function analyzeFace(imageBase64: string, retries = 2): Promise<MakeupRecommendation> {
  // Instantiate inside the function to ensure we use the latest API key
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please check your environment variables.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash"; // Switched to 2.5 flash for better availability and quota
  
  const prompt = `Analyze this person's face for makeup recommendations. 
  Identify their skin tone (e.g., Fair, Light, Medium, Tan, Deep), 
  undertone (Cool, Warm, Neutral), 
  face shape (Oval, Round, Square, Heart, Diamond),
  and apparent skin type (Oily, Dry, Combination, Normal).
  
  Provide specific makeup recommendations including:
  - Foundation/Concealer shades/types
  - Lipstick colors that would suit them (provide a specific hex color code)
  - Eyeshadow palettes/colors (provide a primary hex color code)
  - Blush shades (provide a specific hex color code)
  - An overall makeup style suggestion (e.g., "Natural Glow", "Bold Glam", "Classic Professional")
  
  Return the result in a structured JSON format. Be descriptive in the explanation field, but use simple, easy-to-understand language so that normal people can understand it without needing to know complex beauty words. Use markdown for formatting.`;

  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64.split(",")[1],
              },
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              skinTone: { type: Type.STRING },
              undertone: { type: Type.STRING },
              faceShape: { type: Type.STRING },
              skinType: { type: Type.STRING },
              recommendations: {
                type: Type.OBJECT,
                properties: {
                  foundation: { type: Type.STRING },
                  lipstick: { type: Type.STRING },
                  lipstickHex: { type: Type.STRING, description: "Hex color code for lipstick" },
                  eyeshadow: { type: Type.STRING },
                  eyeshadowHex: { type: Type.STRING, description: "Hex color code for eyeshadow" },
                  blush: { type: Type.STRING },
                  blushHex: { type: Type.STRING, description: "Hex color code for blush" },
                  overallStyle: { type: Type.STRING },
                },
                required: ["foundation", "lipstick", "lipstickHex", "eyeshadow", "eyeshadowHex", "blush", "blushHex", "overallStyle"],
              },
              explanation: { type: Type.STRING },
            },
            required: ["skinTone", "undertone", "faceShape", "skinType", "recommendations", "explanation"],
          },
        },
      });

      const text = response.text;
      if (!text) throw new Error("The AI returned an empty response.");
      
      const cleanedText = cleanJsonResponse(text);
      return JSON.parse(cleanedText) as MakeupRecommendation;
    } catch (error: any) {
      console.error(`Gemini API Error (attempt ${attempt + 1}):`, error);
      lastError = error;
      
      // If it's a quota or API key error, don't retry, fail immediately
      if (error.message?.includes("API key") || error.status === 403 || error.status === 401) {
        throw new Error("Invalid or missing API key. Please ensure it is set correctly.");
      }
      
      // If not the last attempt, wait before retrying (exponential backoff)
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If we exhausted all retries
  throw new Error(lastError?.message || "Analysis failed after multiple attempts. Please try again later.");
}
