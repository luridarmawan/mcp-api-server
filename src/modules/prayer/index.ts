import { Elysia, t } from 'elysia'
import { http } from '../../utils/http'
import { getPrayerSchedule } from '../../services/prayerService'

export default new Elysia({ prefix: '/prayer' })
  .get('/', async () => {
    return {
      message: 'Prayer schedule service is running'
    }
  },{
    detail: {
      tags: ['Prayer'],
      description: 'Prayer information',
      hide: true
    }
  })

  .get('/schedule', 
    async ({ query }) => {
      const { city } = query
      return getPrayerSchedule(city);
    },
    {
      query: t.Object({
        city: t.String({ description: 'City name to get prayer schedule' })
      }),
      detail: {
        tags: ['Prayer'],
        summary: "chedule",
        description: 'Get prayer schedule for a specific city',
        responses: {
          200: {
            description: 'Successfully retrieved prayer schedule',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'string' }
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid request parameters'
          },
          500: {
            description: 'Failed to fetch prayer schedule'
          }
        }
      }
    }
  )