const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  OPENAI_API_KEY,
  OPENAI_MODEL,
  OPENAI_BASEURL,
  GEMINI_API_KEY,
  GEMINI_MODEL,
  LLM_PROVIDER
} = require('./config');

const { discoverFunctions } = require('./mcp');

async function chatWithLLM(messages) {
  try {
    const functions = await discoverFunctions();

    if (LLM_PROVIDER === 'openai') {
      const config = { apiKey: OPENAI_API_KEY };
      if (OPENAI_BASEURL) config.baseURL = OPENAI_BASEURL;

      const openai = new OpenAI(config);
      const res = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages,
        functions,
        function_call: 'auto'
      });

      return {
        role: 'assistant',
        content: res.choices[0].message.content,
        function_call: res.choices[0].message.function_call
      };
    }

    if (LLM_PROVIDER === 'gemini') {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      // Build function descriptions
      const pluginDescriptions = functions.map(fn =>
        `- ${fn.name}: ${fn.description || 'No description'}`
      ).join('\n');

      const mcpInstruction = `You can call external tools via MCP plugins:\n${pluginDescriptions}`;

      // Process messages for Gemini
      const systemMessages = messages.filter(msg => msg.role === 'system');
      const otherMessages = messages.filter(msg => msg.role !== 'system');

      const contents = [];

      // Combine all system messages with MCP instructions
      if (systemMessages.length > 0 || pluginDescriptions) {
        const systemContent = [
          mcpInstruction,
          ...systemMessages.map(msg => msg.content)
        ].filter(Boolean).join('\n\n');

        contents.push({ role: 'user', parts: [{ text: systemContent }] });
      }

      // Add conversation history
      otherMessages.forEach(msg => {
        const role = msg.role === 'user' ? 'user' : 'model';
        contents.push({
          role,
          parts: [{ text: msg.content }]
        });
      });

      const result = await model.generateContent({ contents });
      const responseText = await result.response.text();

      return {
        role: 'assistant',
        content: responseText,
        function_call: null // Gemini doesn't support function calling natively
      };
    }

    throw new Error(`Unsupported LLM provider: ${LLM_PROVIDER}`);
  } catch (error) {
    console.error('Error in chatWithLLM:', error);
    throw new Error(`Failed to get LLM response: ${error.message}`);
  }
}

module.exports = { chatWithLLM };