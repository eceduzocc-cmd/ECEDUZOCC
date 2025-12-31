
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Fix: Using process.env.API_KEY directly as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async askEducationalAssistant(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: `Eres un asistente experto en administración académica para la Escuela de Ciencias de la Educación. 
          Tu objetivo es ayudar a los directivos y administrativos con:
          1. Redacción de actas y documentos oficiales.
          2. Sugerencias sobre políticas pedagógicas.
          3. Análisis de tendencias educativas.
          4. Resolución de dudas sobre gestión de estudiantes y docentes.
          Responde de manera profesional, empática y estructurada en español.`,
          temperature: 0.7,
        },
      });

      return response.text || "Lo siento, no pude procesar tu solicitud en este momento.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Hubo un error al conectar con el asistente de IA. Por favor, intenta de nuevo.";
    }
  }
}

export const geminiService = new GeminiService();
