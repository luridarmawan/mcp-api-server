import { Elysia, t } from 'elysia'
import { http } from '../../utils/http'

export default new Elysia({ prefix: '/registration' })
  .post('/',
    async ({ body }) => {
      try {
        const response = await http.post('https://6806508f001fae34ed13.arinni.id/general/registration/', body)
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