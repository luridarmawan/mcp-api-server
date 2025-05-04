// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fetch from 'node-fetch';
import { chatWithAgent } from './agent.js';
import { marked } from 'marked';
import 'dotenv/config';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.static('public'));

// Basic prompt handler with MCP discovery
const MCP_DISCOVERY_URL = process.env.MCP_SERVER_URL;

const messages = [{ role: 'system', content: 'You are an assistant who can use MCP server plugins to help answer questions.' }];

async function callMCP(prompt) {
  messages.push({ role: 'user', content: prompt });
  const reply = await chatWithAgent(messages);
  const htmlReply = marked.parse(reply);
  return htmlReply;
}

io.on('connection', (socket) => {
  socket.on('userMessage', async (msg) => {
    const reply = await callMCP(msg);
    socket.emit('botMessage', reply);
  });
});

server.listen(process.env.WEB_PORT, () => {
  console.log(`MCP Assistant UI server running at http://localhost:${process.env.WEB_PORT}`);
});
