import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, normalize, relative, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { WebSocket, WebSocketServer } from 'ws';
import { RoomManager } from './online-room.mjs';

const root = resolve('新建文件夹 (2)');
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? '0.0.0.0';
const rooms = new RoomManager();
const finaleCards = new Map();
const FINALE_CARD_TTL_MS = 24 * 60 * 60 * 1000;
const clients = new Map();
const mimeTypes = { '.css':'text/css; charset=utf-8','.fnt':'text/plain; charset=utf-8','.html':'text/html; charset=utf-8','.ico':'image/x-icon','.jpeg':'image/jpeg','.jpg':'image/jpeg','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.mp3':'audio/mpeg','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8' };

function safePath(pathname) {
  const requestPath = decodeURIComponent(pathname) === '/' ? '/index.html' : decodeURIComponent(pathname);
  const fullPath = resolve(root, `.${normalize(requestPath)}`);
  const fromRoot = relative(root, fullPath);
  return fromRoot.startsWith('..') || fromRoot.includes(':') ? null : fullPath;
}
function send(socket, payload) { if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(payload)); }
function sendRoom(room) { for (const player of room.players.values()) send(clients.get(player.id)?.socket, rooms.snapshot(room)); }
function relay(room, sender, payload) { for (const player of room.players.values()) { const socket = clients.get(player.id)?.socket; if (socket !== sender) send(socket, payload); } }
function detach(playerId) { const client = clients.get(playerId); if (!client?.roomId) return clients.delete(playerId); const room = rooms.leave(client.roomId, playerId); clients.delete(playerId); if (room) sendRoom(room); }

function getFinaleCard(roomId) {
  const entry = finaleCards.get(roomId);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) { finaleCards.delete(roomId); return null; }
  return entry.card;
}
function saveFinaleCard(room) {
  if (room.mode === 'message') finaleCards.set(room.id, { card:room.card, expiresAt:Date.now() + FINALE_CARD_TTL_MS });
}

const server = createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const cardMatch = /^\/api\/rooms\/([A-Za-z0-9]{4,8})\/card$/.exec(url.pathname);
  if (request.method === 'GET' && cardMatch) {
    const card = getFinaleCard(cardMatch[1].toUpperCase());
    if (!card) { response.writeHead(404, { 'Content-Type':'application/json; charset=utf-8' }); response.end(JSON.stringify({ error:'未找到或已过期的寄语房间' })); return; }
    response.writeHead(200, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' }); response.end(JSON.stringify({ card })); return;
  }
  const filePath = safePath(url.pathname);
  if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) { response.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' }); response.end('未找到资源'); return; }
  response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream', 'Cache-Control':'no-store' });
  createReadStream(filePath).pipe(response);
});

const wss = new WebSocketServer({ server, path:'/ws' });
wss.on('connection', (socket) => {
  const playerId = randomUUID(); clients.set(playerId, { socket, roomId:null }); send(socket, { type:'connected' });
  socket.on('message', (raw) => {
    let message; try { message = JSON.parse(raw.toString()); } catch { return send(socket, { type:'error', message:'无效消息' }); }
    const client = clients.get(playerId); if (!client) return;
    try {
      if (message.type === 'create') {
        detach(playerId); clients.set(playerId, { socket, roomId:null });
        const created = rooms.create({ mode:message.mode, card:message.card }, playerId); saveFinaleCard(created.room); clients.get(playerId).roomId = created.room.id;
        send(socket, { type:'joined', roomId:created.room.id, role:created.role, owner:true }); sendRoom(created.room); return;
      }
      if (message.type === 'join') {
        detach(playerId); clients.set(playerId, { socket, roomId:null });
        const joined = rooms.join(message.roomId, playerId, message.mode); clients.get(playerId).roomId = joined.room.id;
        send(socket, { type:'joined', roomId:joined.room.id, role:joined.role }); sendRoom(joined.room); return;
      }
      if (!client.roomId) return;
      const room = rooms.rooms.get(client.roomId); const player = room?.players.get(playerId); if (!room || !player) return;
      if (message.type === 'input') {
        const input = message.input ?? {}; relay(room, socket, { type:'input', role:player.role, input:{ left:Boolean(input.left), right:Boolean(input.right), up:Boolean(input.up) } });
      }
      if (message.type === 'level-start' && player.role === 'fire' && message.level) relay(room, socket, { type:'level-start', level:message.level });
      if (message.type === 'state' && player.role === 'fire' && message.state) relay(room, socket, { type:'state', state:message.state });
    } catch (error) { send(socket, { type:'error', message:error.message }); }
  });
  socket.on('close', () => detach(playerId));
});
server.listen(port, host, () => console.log(`森林冰火人首关双设备版: http://${host}:${port}`));
