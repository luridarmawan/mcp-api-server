import { OpenAI } from 'openai';
import config from './config.js';
import { discoverFunctions, callFunction } from './mcp.js';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY
});

export async function chatWithAgent(messages) {
  const functions = await discoverFunctions();

  const res = await openai.chat.completions.create({
    model: config.OPENAI_MODEL,
    messages,
    functions,
    function_call: 'auto'
  });

  const message = res.choices[0].message;

  // If model wants to call a function
  if (message.function_call) {
    const functionName = message.function_call.name;
    const args = JSON.parse(message.function_call.arguments || '{}');

    console.log(`⚡ Calling function: ${functionName} with args:`, args);

    const result = await callFunction(functionName, args);

    // Add function call + result to message history
    messages.push(message);
    messages.push({
      role: 'function',
      name: functionName,
      content: JSON.stringify(result)
    });

    // Recursive call: continue conversation
    return chatWithAgent(messages);
  }

  // Else normal reply
  return message.content;
}