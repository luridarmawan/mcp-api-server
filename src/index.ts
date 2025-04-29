import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from "@elysiajs/cors";
import staticPlugin from '@elysiajs/static';
import prayerModule from './modules/prayer';
import registrationModule from './modules/registration';
import employeeModule from './modules/employee';
import mcp from './modules/mcp';
import llmModule from './modules/llm';
import { socketService } from './sockets';
import * as Constants from './constants';
import * as utils from './utils'

const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: `${process.env.API_NAME} API Server Documentation`,
        version: '1.0.0',
        description: 'API Server with lorem ipsum dan bla bla bla bla'
      },
      tags: [
        { name: 'Employee', description: 'Employee Information Modul' },
        { name: 'Prayer', description: 'Prayer schedule operations' },
        { name: 'Registration', description: 'Event registration operations' },
        { name: 'LLM', description: 'Large Language Model' },
        { name: 'MCP', description: 'Model Context Protocol' },
      ]
    },
    path: '/docs',
  }))
  .use(staticPlugin({
    assets: 'public',
    prefix: '/',
  }))
  .use(mcp)
  .use(employeeModule)
  .use(prayerModule)
  .use(registrationModule)
  .use(llmModule)
  .use(socketService)
  .listen(process.env.API_PORT || Constants.API_PORT)

console.log(
  `🦊 ${process.env.API_NAME} API Server is running at ${app.server?.hostname}:${app.server?.port}`
)

export type App = typeof app
