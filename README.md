# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

# MCP

Base URL MCP adalah `http://localhost:3000/mcp`.

# SOCKET TEST

Gunakan WebSocket client seperti Postman atau wscat:

```bash
# Install wscat (jika belum ada)
npm install -g wscat

# Connect ke socket server
wscat -c ws://localhost:3000

# Setelah terhubung, kirim event:
>> {"event":"prayer:schedule","data":"Jakarta"}
>> {"event":"registration:new","data":{"name":"Alice","phone":"081122334455","email":"alice@example.com"}}
```


