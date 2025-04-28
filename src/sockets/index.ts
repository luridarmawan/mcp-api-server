import { Elysia } from 'elysia'
import { sucrose } from 'elysia/dist/sucrose';

export const socketService = new Elysia()
  .ws('/ws', {
    open(ws) {
      //console.log('🟢 WebSocket connected')
      ws.send(JSON.stringify({ status: 'connected' }))
    },

    close(ws) {
      //console.log('🔴 WebSocket disconnected')
    },

    message(ws, message) {
      try {
        let data: Record<string, any>;

        // Jika message string, parse jadi object
        if (typeof message === 'string') {
          try {
            data = JSON.parse(message);
          } catch {
            throw new Error('Invalid JSON format');
          }
        } else if (typeof message === 'object' && message !== null) {
          data = message as Record<string, any>;
        } else {
          throw new Error('Invalid message format: expected object');
        }

        if (!data.event) {
          throw new Error('Event type is required');
        }

        switch (data.event) {
          case 'prayer:schedule':
            if (!data.city) {
              throw new Error('City parameter is required');
            }
            ws.send(JSON.stringify({
              event: 'prayer:schedule:response',
              data: `Schedule for ${data.city} received`
            }));
            break;

          default:
            throw new Error(`Unknown event type: ${data.event}`);
        }

      } catch (error) {
        ws.send(JSON.stringify({
          success: false,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }));
      }
    },

    error({ error }) {
      console.error('💥 WebSocket server error:', error)
      return new Response(null, { status: 1011 })
    }
  });
