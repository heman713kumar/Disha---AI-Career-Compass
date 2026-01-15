import { GoogleGenAI, Chat, type Content, type GenerateContentResponse } from "@google/genai";
import { BASE_SYSTEM_INSTRUCTION } from "../constants";
import { UserRole, SupportedLanguage } from "../types";

let client: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const initializeGemini = (userRole: UserRole, language: SupportedLanguage) => {
  if (!process.env.API_KEY) {
    console.error("API Key not found");
    return;
  }

  client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Customize system instruction based on role and language
  const roleInstruction = `\nThe user has identified as a ${userRole}. Adjust your persona accordingly immediately.`;
  
  const languageInstruction = language === SupportedLanguage.ENGLISH 
    ? "" 
    : `\nIMPORTANT: The user has selected the preferred language as "${language}". You must conduct the entire conversation in ${language}. If technical terms are used (like JEE, NEET, AI, Data Science), you may keep them in English or transliterated if commonly used that way in India, but the rest of the conversation must be in ${language}.`;
  
  chatSession = client.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: BASE_SYSTEM_INSTRUCTION + roleInstruction + languageInstruction,
      tools: [{ googleSearch: {} }], 
    },
  });
};

export const sendMessageStream = async function* (message: string) {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    
    for await (const chunk of result) {
      yield chunk as GenerateContentResponse;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const generateJsonForVisualization = async (contextPrompt: string): Promise<string> => {
    if (!chatSession) return "{}";
    
    // We send a separate message to get the JSON, but we want to keep the main context.
    // However, to avoid polluting the chat history visible to the user with raw JSON, 
    // strictly speaking we are continuing the chat. We will just filter this message out of the UI.
    const result = await chatSession.sendMessage({ message: contextPrompt });
    return result.text || "{}";
}
