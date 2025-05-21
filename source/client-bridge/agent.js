const mcp = require("./mcp")
const llm = require("./llm")
const utils = require("./utils")
const { LLM_PROVIDER } = require('./config');

async function executeFunctionChain(functions, functionCalls) {
    const results = [];
    for (const call of functionCalls) {
        const functionName = call.name;
        utils.think(`🤔 executing function: ${functionName}`);
        const args = call.arguments || {};
        const result = await mcp.callFunction(functions, functionName, args);
        results.push(result);
    }
    return results;
}

async function combineResults(results) {
    // Buat prompt khusus untuk menggabungkan hasil
    const combinePrompt = await utils.readFile("data/prompt_combine.txt");

    const messages = [{
        role: 'system',
        content: combinePrompt
    }];

    // Tambahkan semua hasil ke dalam messages
    messages.push({
        role: 'user',
        content: JSON.stringify(results, null, 2)
    });

    const response = await llm.chatCompletions(messages);
    return response.choices[0].message.content;
}

async function chatWithAgent(messages) {
    const functions = await mcp.discoverFunctions();
    if (!functions){
        console.log("function not exists....!!!");
        process.exit()
    }

    // ✅ OPENAI: Native function_call support
    if (LLM_PROVIDER === 'openai') {
        //TODO: openai handler
        // Sudah ada di folder contoh yang lain
    }

    if (LLM_PROVIDER === 'bridge') {
        let response = await mcp.chatWithMCP(messages, functions);

        // Handle single function call
        if (response.function_call && !Array.isArray(response.function_call)) {
            const functionName = response.function_call.name;
            utils.think(`found single function: ${functionName}`);
            const args = response.function_call.arguments || {};
            const functionResult = await mcp.callFunction(functions, functionName, args);
            response.content = functionResult.human_readable;
        }
        // Handle multiple function calls
        else if (response.function_call && Array.isArray(response.function_call)) {
            utils.think(`☀️  found multiple functions: ${response.function_call.map(f => f.name).join(', ')}`);
            const results = await executeFunctionChain(functions, response.function_call);
            response.content = await combineResults(results);
        }

        return response;
    }// ./bridge
}

module.exports = { chatWithAgent };
