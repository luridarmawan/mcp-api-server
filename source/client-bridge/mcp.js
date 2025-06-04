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
1. For tool-related requests, respond with either:
   a. Single function call (for simple requests):
      {
        "name": "<tool_name>",
        "arguments": { ... }
      }
   b. Multiple function calls (for complex requests that need data from multiple functions):
      [
        {
          "name": "<tool_name_1>",
          "arguments": { ... }
        },
        {
          "name": "<tool_name_2>",
          "arguments": { ... }
        }
      ]
2. Do not include any additional text or markdown.
3. Always prioritize tool usage ONLY when the query matches the tool's intent.
4. If parameters are required but missing, ask a clarifying question.
5. If parameters are optional and not mentioned, use default values if available or omit them.
6. For complex queries that need data from multiple functions, use array format.
7. Dont change tool name.

FALLBACK POLICY:
- Jika permintaan TIDAK relevan dengan tool, jawab NATURAL tanpa JSON.
- JANGAN paksakan penggunaan tool yang tidak sesuai.

POLA KOMUNIKASI:
- Pertahankan gaya ramah dan informatif.
- Untuk jawaban non-tool, format agar mudah dibaca manusia.
- Jangan gabungkan format JSON dengan teks natural.

CONTOH MULTIPLE FUNCTION CALLS:
Query: "siapa saja karyawan yang tinggal di semarang, tampilkan juga jabatannya"
Response: [
  {
    "name": "fetch_employee_list",
    "arguments": {}
  },
  {
    "name": "fetch_employee_occupation",
    "arguments": {}
  }
]

Available tools (USE EXACT NAME - DO NOT MODIFY):

${tools.map(tool => {
    const paramDesc = extractParameters(tool);
    let item = `- ${tool.name}(${paramDesc}) → ${tool.description || ''}`
    return item;
  }).join("\n")}

`;
}

function extractParameters(tool) {
  if (!tool.parameters || !tool.parameters.properties) return "no parameters";

  const props = tool.parameters.properties;
  return Object.entries(props)
    .map(([key, val]) => `${key} ${(val.required) ? '(required)' : ''}: ${val.type || 'any'}`)
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

export async function callFunction(functions, functionName, args = {}) {
  const func = functions.find(f => f.name === functionName);
  //console.log("func: ", func)

  if (!func) throw new Error(`Function ${functionName} not found.`);
  utils.think(`call function: ${functionName}`, args);
  args['mcp'] = true;

  let url = MCP_SERVER_URL + func.url;
  let method = func.method.toLowerCase();
  if (method === 'internal') method = 'post';

  // Penanganan parameter GET yang lebih aman
  if (method === 'get' && args && typeof args === 'object' && Object.keys(args).length > 0) {
    try {
      const params = new URLSearchParams();

      // Loop melalui semua properti args
      for (const key in args) {
        if (args.hasOwnProperty(key) && args[key] !== undefined && args[key] !== null) {
          // Konversi nilai ke string
          params.append(key, String(args[key]));
        }
      }

      if (params.toString()) {
        url += '?' + params.toString();
      }
    } catch (error) {
      console.error('Error creating URL parameters:', error);
      // Lanjutkan tanpa parameter daripada membatalkan
    }
  }

  // reformat parameter if property_field exist
  if (func.parameters?.property_field){
    const property_field = func.parameters.property_field;
    let tempArgs = {}
    tempArgs['mcp'] = true;
    tempArgs[property_field] = args;
    args = tempArgs
  }

  // Bersihkan URL
  url = url.replace(`//..`, `/..`).replace(`??`, `?`);
  utils.think(`  url: ${url}`);
  utils.think(`    args: ${JSON.stringify(args)}`);

  // Eksekusi request
  let result;
  try {
    const res = await axios({
      method,
      url,
      data: method === 'post' ? args : undefined
    });

    result = res.data;

    // Apply response mapping jika ada
    if (func.response_mapping && func.response_mapping.path) {
      result = func.response_mapping.path.split('.').reduce((obj, key) => {
        return (obj !== null && obj !== undefined) ? obj[key] : undefined;
      }, result);
    }
  } catch (error) {
    console.error(`Error calling function ${functionName}:`, error);
    return {
      raw_data: null,
      human_readable: `Gagal memanggil fungsi ${functionName}: ${error.message}`,
      metadata: {
        function_name: functionName,
        timestamp: new Date().toISOString(),
        status: 'error'
      }
    };
  }

  // Buat hasil yang lebih informatif
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
  let text = `Kalimat yang diubah:\n ${params.raw_result}`;
  //JSON.stringify(params.raw_result, null, 2)
  messages.push({role: 'assistant', content: text});

  const response = await llm.chatCompletions(messages);
  let responseAsText = response.choices[0].message.content;
  let formattedText = utils.reformatMarkdown(responseAsText);
  return formattedText
}

