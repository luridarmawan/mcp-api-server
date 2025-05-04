require('dotenv').config();

module.exports = {
  MCP_SERVER_URL: process.env.MCP_SERVER_URL,
  LLM_PROVIDER: process.env.LLM_PROVIDER || 'openai',

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: 'gpt-4-turbo', // gpt-4o

  // GEMINI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-pro',
};
