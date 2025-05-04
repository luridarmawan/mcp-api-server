import { Elysia, t } from 'elysia';
import { proxyToLLMVendor } from './vendor';
import { ChatCompletionRequest } from './types';

export default new Elysia({ prefix: '/llm' })

  .post('/chat/completions', async ({ body }) => {
    const model = body.model || '';
    if (model==''){
      return {
        success: false,
        message: 'Invalid model or model not found'
      }
    }
    const result = await proxyToLLMVendor(body as ChatCompletionRequest);
    return result;
  }, {
    body: t.Object({
      vendor: t.Optional(t.String()),
      model: t.String(),
      messages: t.Array(
        t.Object({
          role: t.String(),
          content: t.String(),
        })
      ),
    }),
    detail: {
      tags: ['LLM'],
      summary: 'Chat completions'
    }
    });

