import { GoogleGenAI, Type } from "@google/genai";
import { Language, LocalizedText } from "../types";

/**
 * Generates translations for provided source text into all supported site languages.
 * Uses Gemini 3 Flash for efficient, high-quality translation tasks.
 */
export const generateTranslations = async (sourceText: string, sourceLang: Language = Language.FR): Promise<LocalizedText> => {
  try {
    // Creating a new GoogleGenAI instance for each request as per guidelines for key handling.
    // The API key is obtained exclusively from process.env.API_KEY.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview for translation tasks as it is well-suited for high-quality text processing.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional translator for an art gallery website.
      Translate the following text (which is in ${sourceLang}) into French, Malagasy, English, and Russian.
      Maintain the artistic, elegant, and professional tone suitable for a master sculptor's portfolio.
      
      Input text: "${sourceText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fr: { type: Type.STRING, description: "Translation in French" },
            mg: { type: Type.STRING, description: "Translation in Malagasy" },
            en: { type: Type.STRING, description: "Translation in English" },
            ru: { type: Type.STRING, description: "Translation in Russian" },
          },
          required: ["fr", "mg", "en", "ru"],
        }
      }
    });

    // Access the text property directly from the response object.
    const jsonText = response.text;
    if (!jsonText) throw new Error("No response text received from Gemini API");

    // Parse the generated JSON string.
    const result = JSON.parse(jsonText.trim());
    
    return {
      fr: result.fr || sourceText,
      mg: result.mg || "",
      en: result.en || "",
      ru: result.ru || ""
    };

  } catch (error) {
    console.error("Gemini Translation Error:", error);
    // Fallback: return source text for all fields to allow manual correction by the user in the UI.
    return {
      fr: sourceText,
      mg: sourceText,
      en: sourceText,
      ru: sourceText
    };
  }
};
