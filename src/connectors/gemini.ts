import { GoogleGenerativeAI } from '@google/generative-ai';

export async function geminiComplete(prompt: string, model = process.env.GEMINI_MODEL || 'gemini-1.5-pro') {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY missing');
  const genAI = new GoogleGenerativeAI(key);
  const m = genAI.getGenerativeModel({ model });
  const resp = await m.generateContent(prompt);
  const text = resp.response?.text?.() ?? '';
  return text;
}
