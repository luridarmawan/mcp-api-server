const axios = require('axios');
const { MCP_SERVER_URL } = require('./config');

async function discoverFunctions() {
  const res = await axios.get(`${MCP_SERVER_URL}/.well-known/mcp.json`);
  return res.data.functions.map(func => ({
    name: func.name,
    description: func.description,
    parameters: func.parameters || { type: 'object', properties: {} }
  }));
}

async function callFunction(functionName, args) {
  const resDiscovery = await axios.get(`${MCP_SERVER_URL}/.well-known/mcp.json`);
  const func = resDiscovery.data.functions.find(f => f.name === functionName);

  if (!func) throw new Error(`Function ${functionName} not found.`);

  let url = MCP_SERVER_URL + func.url;
  const method = func.method.toLowerCase();

  if (method === 'get' && args && Object.keys(args).length > 0) {
    url += '?' + new URLSearchParams(args).toString();
  }

  const res = await axios({
    method,
    url,
    data: method === 'post' ? args : undefined
  });

  let result = res.data;
  if (func.response_mapping && func.response_mapping.path) {
    result = func.response_mapping.path.split('.').reduce((obj, key) => obj?.[key], result);
  }

  return result;
}

module.exports = { discoverFunctions, callFunction };
