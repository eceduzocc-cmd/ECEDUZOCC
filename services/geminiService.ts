
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  // Re-instantiating inside methods is essential to capture the latest API key if updated via key selection UI.

  async askEducationalAssistant(prompt: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
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

  async draftAcademicEvidence(briefNotes: string, functionName: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Como docente de la Escuela de Ciencias de la Educación, he realizado la siguiente actividad: "${functionName}". 
      Mis notas breves son: "${briefNotes}". 
      Por favor, redacta un párrafo técnico y profesional de máximo 150 palabras para mi informe de evidencias. 
      Usa terminología académica (UNAD 5.0, fractalidad, reticularidad, impacto territorial) y asegúrate de que suene oficial y robusto.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "Eres un redactor académico experto de la UNAD. Tu misión es transformar notas simples en descripciones de alta calidad técnica para informes de gestión docente.",
          temperature: 0.5,
        },
      });

      return response.text || briefNotes;
    } catch (error) {
      console.error("AI Drafting Error:", error);
      return briefNotes;
    }
  }
}

export const geminiService = new GeminiService();
