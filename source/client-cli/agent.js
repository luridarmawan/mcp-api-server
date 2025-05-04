const { chatWithLLM } = require('./llm');
const { discoverFunctions, callFunction } = require('./mcp');
const { LLM_PROVIDER } = require('./config');

// Helper: Ekstrak nama fungsi dan argumen dari teks Gemini
function extractFunctionCallGemini(content, functions) {
  // Contoh deteksi: plugin getWeather({ city: "Jakarta" })
  const fnRegex = /(?:plugin|function|call)?\s*["'`]?([a-zA-Z0-9_]+)["'`]?\s*(?:\(([^)]*)\)|\{([^}]*)\})?/i;

  const match = content.match(fnRegex);
  if (!match) return null;

  const fnName = match[1];
  const argsRaw = match[2] || match[3];

  const fn = functions.find(f => f.name === fnName);
  if (!fn) return null;

  let args = {};
  if (argsRaw) {
    try {
      // Coba parse sebagai JSON (dengan menambahkan {} jika perlu)
      args = JSON.parse(`{${argsRaw}}`);
    } catch {
      // Fallback: parse manual format seperti city=Jakarta, age=25
      argsRaw.split(',').forEach(pair => {
        const [key, value] = pair.split('=').map(s => s.trim());
        if (key && value) args[key] = value.replace(/^["']|["']$/g, '');
      });
    }
  }

  return { fnName, args };
}

async function chatWithAgent(messages) {
  const functions = await discoverFunctions();
  const response = await chatWithLLM(messages);

  // ✅ OPENAI: Native function_call support
  if (LLM_PROVIDER === 'openai') {
    const message = await chatWithLLM(messages);

    if (message.function_call) {
      const functionName = message.function_call.name;
      const args = JSON.parse(message.function_call.arguments || '{}');

      console.log(`⚡ Calling function: ${functionName} with args:`, args);

      const result = await callFunction(functionName, args);

      messages.push(message);
      messages.push({
        role: 'function',
        name: functionName,
        content: JSON.stringify(result)
      });

      return chatWithAgent(messages);
    }

    return message.content;
  }

  // 🤖 GEMINI: Manual plugin detection from content
  if (LLM_PROVIDER === 'gemini') {
    const answerText = response.content;
    const detection = extractFunctionCallGemini(answerText, functions);
    if (!detection) return response;

    const { fnName, args } = detection;

    try {
      const result = await callFunction(fnName, args);
      return {
        role: 'assistant',
        content: `${answerText}\n\n📡 I also called plugin "${fnName}":\n${result}`
      };
    } catch (err) {
      return {
        role: 'assistant',
        content: `${answerText}\n\n⚠️ Tried calling plugin "${fnName}" but got an error: ${err.message}`
      };
    }
  }

  return {
    role: 'assistant',
    content: '⚠️ Unsupported LLM provider.'
  };
}

module.exports = { chatWithAgent };
