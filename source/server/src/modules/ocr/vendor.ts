import { ChatCompletionRequest } from './types';
import { http } from '../../utils/http';

const vendorUrls: Record<string, string> = {
    nanonet: process.env.NANONETS_BASE_URL ?? '',
    localocr: process.env.LOCALOCR_BASE_URL ?? '',
};

export async function proxyToOCRVendor(payload: ChatCompletionRequest) {
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
      case 'nanonet':
        return {
            success: true,
            vendor: "nannnooooo",
        }
        // return openAI(forwardPayload);
      case 'localocr':
        return {
            success: true,
            vendor: "nannnooooo",
        }
        // return localLLM(forwardPayload);
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

