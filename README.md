# API & MCP Server Skeleton (ElysiaJS + Bun)

![bun](https://img.shields.io/badge/Bun-v1.2%2B-blue)
![elysia](https://img.shields.io/badge/ElysiaJS-Server-orange)
![mcp](https://img.shields.io/badge/MCP-Supported-green)
![websocket](https://img.shields.io/badge/WebSocket-Supported-green)
![license](https://img.shields.io/badge/License-Apache%202.0-blueviolet)

__(Documentation is not yet complete.)__

<!-- TOC -->
<details>
<summary>📑 Daftar Isi</summary>

- [API & MCP Server Skeleton (ElysiaJS + Bun)](#api--mcp-server-skeleton-elysiajs--bun)
  - [🚀 Features](#-features)
  - [📌 Requirements](#-requirements)
  - [🛠️ Getting Started](#-getting-started)
  - [🧠 Model Context Protocol (MCP)](#-model-context-protocol-mcp)
  - [🔌 WebSocket Usage](#-websocket-usage)
  - [📁 Project Structure](#-project-structure)
  - [🚀 Deployment](#-deployment)
  - [🔖 License](#-license)
  - [📘 References](#-references)
- [MCP vs Traditional API](MCP_and_API.md)
</details>

---

A lightweight, high-performance API Server using [ElysiaJS](https://elysiajs.com/) with [Bun](https://bun.sh/) runtime, integrated with Model Context Protocol (MCP) and WebSocket support.


## 🚀 Features

- REST API Server powered by Bun runtime.
- WebSocket Event Handling (realtime communication).
- Model Context Protocol (MCP) base support:
  - MCP Plugin Registry
  - MCP Discovery Endpoint (`/.well-known/mcp.json`)
- Hot reload during development.
- Ready for scalable deployment.
- Example Events: Prayer Schedule, Event Registration.


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

Run development server:

```bash
bun run dev
```

Open http://localhost:3000 in your browser.


## 🧠 Model Context Protocol (MCP)

MCP is a lightweight communication protocol designed to enable context-aware interactions with AI agents or applications.

- **Base URL**: http://localhost:3000/mcp
- **Discovery Endpoint**: http://localhost:3000/mcp/.well-known/mcp.json

Example basic MCP interaction via WebSocket:

```json
{
  "event": "prayer:schedule",
  "data": {
    "city": "Jakarta"
  }
}
```

For full details, see [MCP and API Explanation](MCP_and_API.md).


## 🔌 WebSocket Usage

You can interact with the server via WebSocket:

1. Install wscat if needed:

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

Build and run for production:

```bash
bun run build
bun start
```

Ready to deploy on platforms like **Vercel**, **Railway**, **Fly.io**, or any Bun-supported environment.

## 📄 License

This project is licensed under the [Apache 2.0 License](LICENSE).

## 📚 References

- [Model Context Protocol/MCP](https://modelcontextprotocol.io/)
- [ElysiaJS Documentation](https://elysiajs.com/)
- [Bun Documentation](https://bun.sh/docs)

