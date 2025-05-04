import { Elysia, t } from 'elysia'
import { http } from '../../utils/http'

export default new Elysia({ prefix: '/registration' })
  .post('/',
    async ({ body }) => {


      // Example: POST to another webhook
      let url = process.env.REGISTRATION_WEBHOOK;
      if (url == undefined){
        return {
          success: false,
          message: 'Registration webhook not found'
        }
      }
      try {
        body.event = 'registration'
        const response = await http.post(url, body)
        return {
          success: true,
          data: response.data
        }
      } catch (error) {
        return {
          success: false,
          message: 'Registration failed'
        }
      }


    },
    {
      body: t.Object({
        name: t.String({ description: 'Full name of participant' }),
        phone: t.String({ description: 'Phone number of participant' }),
        email: t.String({ format: 'email', description: 'Email of participant' })
      }),
      detail: {
        tags: ['Registration'],
        summary: 'registration',
        description: 'Register a new participant for an event',
        responses: {
          201: {
            description: 'Successfully registered participant',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'object' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid registration data'
          },
          500: {
            description: 'Registration failed'
          }
        }
      }
    }
  )