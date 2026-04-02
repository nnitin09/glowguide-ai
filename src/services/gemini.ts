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

export async function analyzeFace(imageBase64: string): Promise<MakeupRecommendation> {
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
  
  Return the result in a structured JSON format. Be descriptive in the explanation field, using markdown for formatting.`;

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
    
    return JSON.parse(text) as MakeupRecommendation;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API key")) {
      throw new Error("Invalid or missing API key. Please ensure it is set correctly.");
    }
    throw new Error(error.message || "An unexpected error occurred during analysis.");
  }
}
