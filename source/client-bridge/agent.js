
const mcp = require("./mcp")
const utils = require("./utils")
const { LLM_PROVIDER } = require('./config');

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
        if (response.function_call) {
            const functionName = response.function_call.name;
            utils.think(`found function: ${functionName}`);
            const args = response.function_call.arguments || {};
            const functionResult = await mcp.callFunction(functions, functionName, args);
            const responseAsText = await mcp.makeHumanReadable(functionResult);
            response.content = responseAsText;
        }
        return response;
    }// ./bridge

}

module.exports = { chatWithAgent };
