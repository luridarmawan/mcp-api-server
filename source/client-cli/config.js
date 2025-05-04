require('dotenv').config();

module.exports = {
  MCP_SERVER_URL: process.env.MCP_SERVER_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: 'gpt-4-turbo' // gpt-4o
};
