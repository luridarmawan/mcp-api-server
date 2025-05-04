import { Elysia, t } from 'elysia';
import { http } from '../../utils/http'
import FormData from 'form-data';
import fs from 'fs/promises';

export const OCRModule = new Elysia({ prefix: '/ocr' })
  .post(
    '/labelFile/:modelId',
    async ({ params, body }) => {
      const fileBuffer = await fs.readFile(body.file.path);
      const form = new FormData();
      form.append('file', fileBuffer, body.file.name);

      let url = process.env.NANONETS_BASE_URL + process.env.NANONETS_MODEL_ID_KTP + `/LabelFile/`;
      url = 'https://webhook.site/cc1b8851-fa1b-4c2d-84ea-f44455c2c0db';
      url += (query.async !== undefined ? `?async=${query.async}` : '');
      const response = await http.post(
        url,
        form,
        {
          headers: {
            ...form.getHeaders(),
            Authorization: 'Basic ' + Buffer.from(process.env.NANONETS_API_KEY + ':').toString('base64')
          }
        }
      );

      return response.data;
    },
    {
      params: t.Object({
        modelId: t.String()
      }),
      query: t.Object({
        async: t.Optional(t.Boolean())
      }),      body: t.Object({
        file: t.File()
      }),
      detail: {
        tags: ['OCR'],
        summary: 'Prediction for Image File',
      }
    }
  )
  .post(
    '/labelUrls/:modelId',
    async ({ params, body, query }) => {
      const imageURL = body.urls;
      if (imageURL == ''){
        return {
          success: false,
          message: 'Image URL invalid or not found',
        }
      }
      const form = new URLSearchParams();
      form.append('urls', imageURL);

      let url = process.env.NANONETS_BASE_URL + process.env.NANONETS_MODEL_ID_KTP + `/LabelUrls/`;
      url = 'https://webhook.site/cc1b8851-fa1b-4c2d-84ea-f44455c2c0db'
      url += (query.async !== undefined ? `?async=${query.async}` : '');
      const response = await http.post(
        url,
        form,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(process.env.NANONETS_API_KEY + ':').toString('base64')
          }
        }
      );

      return response.data;
    },
    {
      params: t.Object({
        modelId: t.String()
      }),
      query: t.Object({
        async: t.Optional(t.Boolean())
      }),      body: t.Object({
        urls: t.String()
      }),
      detail: {
        tags: ['OCR'],
        summary: 'Prediction for Image URL',
      }
    }
  );
