import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Message, Sender } from '../types';

const MODELS = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash'
];

let genAI: any = null; // Use any to avoid type complexity with private properties or just re-instantiate

const getApiKey = (): string | null => {
  // Priority: LocalStorage -> Env Var
  const localKey = localStorage.getItem('gemini_api_key');
  if (localKey) return localKey;

  // Fallback to env var (safe for dev, but for prod user needs to input)
  // Note: Vercel env vars are usually process.env.GEMINI_API_KEY
  return process.env.GEMINI_API_KEY || process.env.API_KEY || null;
};

export const sendMessageToGemini = async (
  history: Message[],
  currentMessage: string,
  imagePart?: { inlineData: { data: string; mimeType: string } }
): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return "Vui lòng nhập API Key trong phần Cài đặt để sử dụng.";
  }

  // Convert internal message history to Gemini format
  const chatHistory = history
    .filter(msg => !msg.isLoading && msg.text)
    .map(msg => ({
      role: msg.sender === Sender.User ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

  const contents = imagePart
    ? [
      ...chatHistory.map(h => ({ role: h.role, parts: h.parts })),
      {
        role: 'user',
        parts: [imagePart, { text: currentMessage }]
      }
    ]
    : undefined;

  // Fallback Loop
  for (const model of MODELS) {
    try {
      if (!genAI || genAI.apiKey !== apiKey) {
        genAI = new GoogleGenAI({ apiKey });
      }

      console.log(`Attempting with model: ${model}`); // Debug log

      let responseText = "";

      if (imagePart) {
        // Multimodal request
        const response: GenerateContentResponse = await genAI.models.generateContent({
          model,
          contents: contents!,
          config: { systemInstruction: SYSTEM_INSTRUCTION }
        });
        responseText = response.text || "";
      } else {
        // Text-only chat
        const chat = genAI.chats.create({
          model,
          history: chatHistory,
          config: { systemInstruction: SYSTEM_INSTRUCTION },
        });
        const response: GenerateContentResponse = await chat.sendMessage({
          message: currentMessage
        });
        responseText = response.text || "";
      }

      if (responseText) return responseText;

    } catch (error: any) {
      console.error(`Error with model ${model}:`, error);
      // If it's the last model, throw or return error
      if (model === MODELS[MODELS.length - 1]) {
        return `Đã xảy ra lỗi: ${error.message || "Không thể kết nối với AI"}. (Code: ${error.status || 'Unknown'})`;
      }
      // Continue to next model
      continue;
    }
  }

  return "Xin lỗi, không có model nào phản hồi.";
};
