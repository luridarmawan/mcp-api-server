# API & MCP Server Skeleton (ElysiaJS + Bun)

![bun](https://img.shields.io/badge/Bun-v1.0%2B-blue)
![elysia](https://img.shields.io/badge/ElysiaJS-Server-orange)
![websocket](https://img.shields.io/badge/WebSocket-Supported-green)
![license](https://img.shields.io/badge/License-Apache%202.0-blueviolet)

__(Documentation is not yet complete.)__

A lightweight, high-performance API Server using [ElysiaJS](https://elysiajs.com/) with [Bun](https://bun.sh/) runtime, integrated with Model Context Protocol (MCP) and WebSocket support.


## 🚀 Features

- REST API Server with Bun runtime.
- Model Context Protocol (MCP) base support.
- MCP Discovery Endpoint / .well-known/mcp.json supported
- WebSocket Event Handling (realtime communication).
- Example Events: Prayer Schedule, Event Registration.
- Hot reload during development.



## 📋 Requirements

- Bun runtime (v1.0+): [Install Bun](https://bun.sh/docs/installation)
- Node.js (optional, for installing tools like wscat)
- WebSocket client (Postman, wscat, etc.)


## 🛠️ Getting Started

Clone this project and install dependencies:

```bash
git clone https://github.com/luridarmawan/mcp-api-server.git
cd mcp-api-server
bun install
```

Start the development server:

```bash
bun run dev
```

Open http://localhost:3000 in your browser.


## 🧠 Model Context Protocol (MCP)

MCP is a lightweight communication protocol designed to enable context-aware interactions with AI agents or applications.

- **Base URL**: http://localhost:3000/mcp
- **Discovery Endpoint**: http://localhost:3000/mcp/.well-known/mcp.json
- **Request/Response Format**: JSON

Example basic MCP interaction via WebSocket:

```json
{
  "event": "prayer:schedule",
  "city": "Jakarta"
}
```

[See this to read more information about this MCP server](MCP_and_API.md)


## 🔌 WebSocket Usage

You can interact with the server via WebSocket:

1. Install wscat (if you haven't):

```bash
npm install -g wscat
```

2. Connect to the WebSocket server:
```bash
wscat -c ws://localhost:3000
```

3. Example Events you can send:

| Event | Payload Example | Description |
|---|---|---|
| `prayer:schedule` | `"Jakarta"` | Get prayer times for a city |
| `registration:new` | `{ "name": "Alice", "phone": "081122334455", "email": "alice@example.com" }` | Register a new user |



```bash
# Install wscat (jika belum ada)
npm install -g wscat

# Connect ke socket server
wscat -c ws://localhost:3000

# Setelah terhubung, kirim event:
>> {"event":"prayer:schedule","city":"Jakarta"}
>> {"event":"registration:new","data":{"name":"Alice","phone":"081122334455","email":"alice@example.com"}}
```

## 📁 Project Structure

```bash
.
├── constants.ts
├── index.test.ts
├── index.ts
├── modules
│   ├── mcp
│   │   ├── index.ts
│   │   └── types.ts
│   ├── prayer
│   │   ├── index.ts
│   │   └── types.ts
│   └── registration
│       ├── index.ts
│       └── types.ts
├── services
│   └── prayerService.ts
├── sockets
│   └── index.ts
└── utils
    └── http.ts
```

## 🚀 Deployment

Build for production:

```bash
bun run build
```

Then run the production server:
```bash
bun start
```

Ready to deploy on platforms like **Vercel**, **Railway**, **Fly.io**, or any Bun-supported environment.

## 📄 License

This project is licensed under the [Apache 2.0 License](LICENSE).

## 📚 References

- [Model Context Protocol/MCP](https://modelcontextprotocol.io/)
- [ElysiaJS Documentation](https://elysiajs.com/)
- [Bun Documentation](https://bun.sh/docs)

