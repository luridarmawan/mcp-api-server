import { ChatCompletionRequest } from './types';
import { http } from '../../utils/http';

const vendorUrls: Record<string, string> = {
    openai: process.env.OPENAI_BASEURL ?? '',
    localllm: process.env.LOCALLLM_BASEURL ?? '',
};

export async function proxyToLLMVendor(payload: ChatCompletionRequest) {
    const vendor = payload.vendor || 'openai';
    const url = vendorUrls[vendor];

    if (!url) {
      return {
        success: false,
        message: `Unsupported vendor: ${vendor}`
      }
      // throw new Error(`Unsupported vendor: ${vendor}`);
    }

    // Buat payload copy tanpa field vendor
    const { vendor: _omitVendor, ...forwardPayload } = payload;
    switch (vendor) {
      case 'openai':
        return openAI(forwardPayload);
      case 'localllm':
        return localLLM(forwardPayload);
      default:
        return {
          success: false,
          message: 'Invalid vendor.'
        }
  
    }


}

function generateResponse(Response: Record<string, any>){
  if (Response.success === undefined){
    const newObj = {
      success: true,
      ...Response,
    };
    return newObj;
  }
  return Response;
}

async function openAI(payload: ChatCompletionRequest) {
  const url = vendorUrls['openai'];
  const token = process.env.OPENAI_API_KEY ?? '';
  if (token == ''){
    return {
      success: false,
      message: 'OpenAI Token invalid or not found.'
    }
  }
  const customHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
  try {
    const response = await http.post(url, payload, {
      headers: customHeaders
    })
    return generateResponse(response.data);
  } catch (error) {
    console.error('=========================')
    console.error(error)
    return {
      success: false,
      message: 'OpenAI failed'
    }
  }
}

async function localLLM(payload: ChatCompletionRequest) {
  const url = vendorUrls['localllm'];
  const customHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + process.env.LOCALLLM_TOKEN,
  }
  try {
    const response = await http.post(url, payload, {
      headers: customHeaders
    })
    return generateResponse(response.data);
  } catch (error) {
    return {
      success: false,
      message: 'LocalLLM failed'
    }
  }
}
