import { Elysia, t } from 'elysia'
import { http } from '../../utils/http'
import { getPrayerSchedule } from '../../services/prayerService'
import * as utils from '../../utils'

export default new Elysia({ prefix: '/mcp' })
  // MCP base check
  .get('/', async () => {
    return {
      message: 'MCP service is running'
    }
  },{
    detail: {
      tags: ['MCP'],
      summary: 'MCP Base URL',
      description: 'MCP Base URL'
        + `<br>Use the discovery endpoint to retrieve additional MCP information.`,
    }
  })
  
  .get('/ping', async () => {
    return {
      mcp: true,
    }
  },{
    detail: {
      tags: ['MCP'],
      summary: 'PING',
      description: 'Ping MCP Server',
    }
  })
  
  .get('/info', () => {
    return {
      name: `${process.env.API_NAME} Assistant MCP Server`,
      description: 'Plugin server untuk assistant berbasis Model Context Protocol (MCP)',
      version: '1.0.0',
      author: 'Carik Team',
      discovery: '/.well-known/mcp.json',
      documentation: '/docs' // jika tersedia Swagger
    }
  },{
    detail: {
      tags: ['MCP'],
      summary: 'MCP Metadata',
      description: 'MCP Metadata',
    }
  })

  // JADWAL SHOLAT
  .get("/prayerSchedule/:city", async ({ params }) => {
    return getPrayerSchedule(params.city);
  }, {
    detail: {
      tags: ["MCP"],
      summary: "Get prayer times"
    }
  })
  .post("/prayerSchedule/", async ({ params, body }) => {
    const city = (body.city == undefined) ? "jakarta" : body.city;
    return getPrayerSchedule(city);
  }, {
    detail: {
      tags: ["MCP"],
      summary: "Get prayer times for a specific city."
    }
  })

  // Event Registration
  .post('/registerToEvent', async ({ body }) => {
    const { name, email, eventId } = body
    
    // Simulasi: call ke sistem lain atau database

    return {
      success: true,
      registered: {
        name,
        email,
        eventId
      }
    }
  }, {
    detail: {
      tags: ['MCP'],
      hide: true
    },
    body: t.Object({
      name: t.String(),
      email: t.Optional(t.String()),
      eventId: t.String()
    })
  })


  // STREAM SUPPORT
  /*
  .get("/stream", ({ set, signal }) => {
    set.headers["Content-Type"] = "text/event-stream";
    set.headers["Cache-Control"] = "no-cache";
    set.headers["Connection"] = "keep-alive";

    return new ReadableStream({
      start(controller) {
        console.log("# starting stream");

        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();


        const send = (data: any) => {
          writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Kirim event awal ke Copilot
        send({ type: "ready", agent: "mcp-server", status: "connected" });

        // heartbeat setiap 10 detik
        const interval = setInterval(() => {
          send({ type: "ping", time: new Date().toISOString() });
        }, 10000);


        // Saat koneksi ditutup
        signal?.addEventListener("abort", () => {
          clearInterval(interval);
          controller.close();
        });

      }
    });
  })
  */
  // /STREAM SUPPORT

  // MCP discovery endpoint
  .get('/.well-known/mcp.json', () => {
    return {
      name: `${process.env.API_NAME} MCP Assistant Plugin`,
      version: '1.0.0',
      functions: [
        {
          name: "fetch_employee_list",
          description: "Mengambil daftar employee beserta kota tempat tinggalnya.",
          type: "http",
          method: "GET",
          url: "/../employee/list",
          response_mapping: {
            path: "data"
          },
          example_request: "GET /employee/list",
          example_response: {
            success: true,
            data: [
              { "id": 1, "code": "A1023", "fullname": "Andi Pratama", "city": "Jakarta" }
            ]
          }
        },
        {
          name: "fetch_employee_occupation",
          description: "Mengambil daftar jabatan untuk masing-masing employee berdasarkan kode karyawan.",
          type: "http",
          method: "GET",
          url: "/../employee/occupation/",
          response_mapping: {
            path: "data"
          }
        },
        {
          name: 'prayerSchedule',
          description: 'Prayer Schedule',
          parameters: {
            type: 'object',
            properties: {
              city: { type: 'string' },
            },
          },
          endpoint: '/mcp/prayerSchedule'
        },
        {
          name: 'registerToEvent',
          description: 'Mendaftarkan peserta ke event',
          parameters: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              eventId: { type: 'string' }
            },
            required: ['name', 'eventId']
          },
          endpoint: '/mcp/registerToEvent'
        },
      ]
    }
  })
