import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize Gemini AI client with API key from environment variables
// Note: We assume process.env.API_KEY is available and valid as per requirements.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const isAiAvailable = (): boolean => true;

export const sendMessageToTutor = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        
        // Construct a prompt that includes context
        const systemInstruction = `You are a world-class Senior Network Engineer and Mentor named "Net-Start Bot". 
        Your goal is to teach beginners networking concepts clearly and concisely. 
        Use analogies. If asked about a vendor command, provide both the command and an explanation.
        Be encouraging and professional. Format your response with Markdown (headers, lists, bold text).`;

        const chat = ai.chats.create({
            model: model,
            config: {
                systemInstruction: systemInstruction,
            },
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage({ message: newMessage });
        return result.text || "I'm sorry, I couldn't generate a response.";

    } catch (error) {
        console.error("Gemini Error:", error);
        return "Error connecting to the AI Tutor. Please check your connection and API key.";
    }
};

export const generateQuizForTopic = async (topicTitle: string): Promise<any> => {
    try {
         const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: `Generate 3 multiple-choice questions about "${topicTitle}" for a beginner network engineer.`,
             config: {
                 responseMimeType: 'application/json',
                 responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { 
                                type: Type.ARRAY,
                                items: { type: Type.STRING } 
                            },
                            correctAnswer: { type: Type.STRING },
                            explanation: { type: Type.STRING }
                        },
                        required: ["question", "options", "correctAnswer", "explanation"]
                    }
                 }
             }
         });
         
         const text = response.text;
         if (!text) return null;
         return JSON.parse(text);

    } catch (error) {
        console.error("Quiz Gen Error", error);
        return null;
    }
}