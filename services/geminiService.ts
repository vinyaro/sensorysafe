import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCalmingAdvice = async (currentDb: number, status: string, language: Language): Promise<string> => {
  if (!apiKey) {
    return language === 'pt' 
      ? "Não foi possível conectar ao assistente. Verifique a configuração da API."
      : "Unable to connect to the calming assistant. Please check your API key configuration.";
  }

  try {
    const langPrompt = language === 'pt' ? 'Brazilian Portuguese' : 'English';
    
    const prompt = `
      You are an empathetic, soothing assistant for someone with sound hypersensitivity or autism.
      The user is currently experiencing a noise level of ${currentDb} dB, which is considered "${status}".
      
      Please provide a very short (max 2 sentences), gentle, and grounding piece of advice or a breathing exercise. 
      Focus on validation and calming techniques. Do not be alarmist.
      Respond in ${langPrompt}.
      Example: "It is quite loud right now. Try taking a deep breath in for four seconds, and slowly out for four seconds."
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || (language === 'pt' ? "Respire fundo. Você está seguro." : "Take a deep breath. You are safe.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'pt' 
      ? "Estou com dificuldade para pensar agora, mas lembre-se de respirar fundo."
      : "I'm having trouble thinking right now, but remember to breathe deeply.";
  }
};
