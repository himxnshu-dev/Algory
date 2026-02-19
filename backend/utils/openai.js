import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient = null;

const getGemini = () => {
  if (!geminiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.'
      );
    }
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return geminiClient;
};

export default getGemini;
