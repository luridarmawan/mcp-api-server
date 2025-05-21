const axios = require('axios');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  MCP_SERVER_URL,
  OPENAI_API_KEY,
  OPENAI_MODEL,
  OPENAI_BASEURL,
  GEMINI_API_KEY,
  GEMINI_MODEL,
  LLM_PROVIDER
} = require('./config');
const utils = require('./utils')

export async function chatCompletions(messages) {
  const promptText = messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');

  const config = { apiKey: OPENAI_API_KEY };
  if (OPENAI_BASEURL) config.baseURL = OPENAI_BASEURL;

  const openai = new OpenAI(config);
  const res = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages,
  });
  return res;
}
