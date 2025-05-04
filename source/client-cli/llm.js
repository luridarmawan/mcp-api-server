const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  OPENAI_API_KEY,
  OPENAI_MODEL,
  GEMINI_API_KEY,
  GEMINI_MODEL,
  LLM_PROVIDER
} = require('./config');

const { discoverFunctions } = require('./mcp');

async function chatWithLLM(messages) {
  const functions = await discoverFunctions();

  if (LLM_PROVIDER === 'openai') {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const res = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      functions,
      function_call: 'auto'
    });

    return res.choices[0].message;
  }

  if (LLM_PROVIDER === 'gemini') {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Bangun deskripsi fungsi MCP
    const pluginDescriptions = functions.map(fn =>
      `- ${fn.name}: ${fn.description || 'No description.'}`
    ).join('\n');

    const mcpInstruction = `You can call external tools via MCP plugins:\n${pluginDescriptions}`;

    // Gabungkan dengan pesan system yang ada
    const userSystemMessage = messages.find(msg => msg.role === 'system')?.content;
    const fullSystemPrompt = [mcpInstruction, userSystemMessage].filter(Boolean).join('\n\n');

    // Buat history Gemini
    const nonSystemMessages = messages.filter(msg => msg.role !== 'system');
    const history = [];

    if (fullSystemPrompt) {
      history.push({ role: 'user', parts: [{ text: fullSystemPrompt }] });
    }

    nonSystemMessages.forEach(msg => {
      if (msg.role === 'user') {
        history.push({ role: 'user', parts: [{ text: msg.content }] });
      } else if (msg.role === 'assistant') {
        history.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    });

    const result = await model.generateContent({ contents: history });

    return {
      role: 'assistant',
      content: result.response.text()
    };
  }

  throw new Error(`Unsupported LLM provider: ${LLM_PROVIDER}`);
}

module.exports = { chatWithLLM };
