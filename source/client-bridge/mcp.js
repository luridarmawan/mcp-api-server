const axios = require('axios');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const llm = require("./llm")
const utils = require('./utils')
const {
  MCP_SERVER_URL,
  OPENAI_API_KEY,
  OPENAI_MODEL,
  OPENAI_BASEURL,
  GEMINI_API_KEY,
  GEMINI_MODEL,
  LLM_PROVIDER
} = require('./config');

export async function discoverFunctions() {
  try {
    const response = await axios.get(`${MCP_SERVER_URL}/.well-known/mcp.json`, {
      timeout: 5000,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    if (!response.data?.functions || !Array.isArray(response.data.functions)) {
      return null;
    }

    return response.data.functions.map((func) => ({
      name: func.name || '',
      description: func.description || '',
      type: func.type || 'internal',
      method: func.method || 'internal',
      url: func.url || '',
      parameters: func.parameters || { type: 'object', properties: {} },
    }));
  } catch (error) {
    console.error('Failed to discover functions:', error.message || error);
    return null;
  }
}

export function formatToolPrompt(tools) {
  return `
You are an AI assistant that can perform specific tasks using available tools or answer general questions based on your knowledge. 

INSTRUCTION:
1. For tool-related requests, respond strictly with the JSON format above.
    {
      "name": "<tool_name>",
      "arguments": { ... }
    }
2. Do not include any additional text or markdown.
3. Always prioritize tool usage ONLY when the query matches the tool's intent.
4. If parameters are required but missing, ask a clarifying question.
5. If parameters are optional and not mentioned, use default values if available or omit them.

FALLBACK POLICY:
- Jika permintaan TIDAK relevan dengan tool, jawab NATURAL tanpa JSON.
- JANGAN paksakan penggunaan tool yang tidak sesuai.

POLA KOMUNIKASI:
- Pertahankan gaya ramah dan informatif.
- Untuk jawaban non-tool, format agar mudah dibaca manusia.
- Jangan gabungkan format JSON dengan teks natural.

Available tools:

${tools.map(tool => {
    const paramDesc = extractParameters(tool);
    return `- ${tool.name}(${paramDesc}) → ${tool.description || ''}`;
  }).join("\n")}


`;
}

function extractParameters(tool) {
  if (!tool.parameters || !tool.parameters.properties) return "no parameters";

  const props = tool.parameters.properties;
  return Object.entries(props)
    .map(([key, val]) => `${key}: ${val.type || 'any'}`)
    .join(", ");
}


export async function chatWithMCP(messages, functions) {
  let parsed = false;
  let responseAsText = '';

  // generate prompt
  const currentPrompt = (messages[0].role === 'system') ? messages[0].content + "\n" : "";
  const systemPrompt = formatToolPrompt(functions);
  
  const buildedMessage = [
    { role: "system", content: currentPrompt + messages[0].content + " " + systemPrompt },
    ...messages.slice(1) // Pertahankan role original (user/assistant)
  ];

  try {
    const response = await llm.chatCompletions(buildedMessage);
    responseAsText = response.choices[0].message.content;
    responseAsText = utils.removeNestedThinkTags(responseAsText);
    
    try {
      parsed = JSON.parse( utils.cleanMarkdownCodeBlocks(responseAsText));
    } catch (e) {
      console.error("err: ", responseAsText)
      //return `❌ Failed to parse DeepSeek output:\n${response}`;
    }
  } catch (error) {
    console.error('❗ Error in chatWithMCP:', error);
    throw new Error(`❗ Failed to get chatWithMCP: ${error.message}`);
  }

  const output = {
    role: 'assistant',
    content: responseAsText,
    function_call: parsed
  }
  buildedMessage.push(output)
  utils.saveToFile("tmp.txt", JSON.stringify(buildedMessage, null, 2));

  return output;

}

export async function callFunction(functions, functionName, args) {
  const func = functions.find(f => f.name === functionName);

  if (!func) throw new Error(`Function ${functionName} not found.`);
  utils.think(`call function: ${functionName}`, args);
  args['mcp'] = true;

  let url = MCP_SERVER_URL + func.url;
  let method = func.method.toLowerCase();
  if (method=='internal') method = 'post'

  if (method === 'get' && args && Object.keys(args).length > 0) {
    url += '?' + new URLSearchParams(args).toString();
  }
  url = url.replace(`//..`, `/..`);
  url = url.replace(`??`, `?`);
  utils.think(`  url: ${url}`);
  utils.think(`    args: ${JSON.stringify(args)}`);

  const res = await axios({
    method,
    url,
    data: method === 'post' ? args : undefined
  });

  let result = res.data;
  if (func.response_mapping && func.response_mapping.path) {
    result = func.response_mapping.path.split('.').reduce((obj, key) => obj?.[key], result);
  }

  // return result; <<-- simple result

  // Tambahkan generated text yang lebih informatif
  try {
    const humanReadableResult = await makeHumanReadable({
      function_name: functionName,
      function_description: func.description || '',
      raw_result: result,
      timestamp: new Date().toISOString()
    });

    return {
      raw_data: result,
      human_readable: humanReadableResult,
      metadata: {
        function_name: functionName,
        timestamp: new Date().toISOString(),
        status: 'success'
      }
    };
  } catch (error) {
    console.error('Error generating human readable text:', error);
    return {
      raw_data: result,
      human_readable: `Hasil dari fungsi ${functionName}: ${JSON.stringify(result, null, 2)}`,
      metadata: {
        function_name: functionName,
        timestamp: new Date().toISOString(),
        status: 'success_with_fallback'
      }
    };
  }

}

export async function makeHumanReadable(params) {
  utils.think("make result human readable.")
  let promptHumanReadable = await utils.readFile("data/prompt_humanreadable.txt");

  const messages = [{ 
    role: 'system', 
    content: promptHumanReadable
  }];
  messages.push({role: 'assistant', content: JSON.stringify(params, null, 2)});
  const response = await llm.chatCompletions(messages);
  let responseAsText = response.choices[0].message.content;
  return responseAsText
}