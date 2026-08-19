import { WebSocket } from 'ws';
import { once } from 'node:events';

const url = `ws://127.0.0.1:${process.env.TEST_PORT ?? '3100'}/ws`;
async function connect() {
  const socket = new WebSocket(url);
  const messages = [];
  socket.on('message', (raw) => messages.push(JSON.parse(raw.toString())));
  await once(socket, 'open');
  return { socket, messages };
}
async function waitFor(messages, type) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const message = messages.find((item) => item.type === type);
    if (message) return message;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`未收到 ${type}`);
}
const roomId = `M${Date.now().toString(36).slice(-6)}`.toUpperCase();
const fire = await connect();
const water = await connect();
fire.socket.send(JSON.stringify({ type: 'join', roomId }));
if ((await waitFor(fire.messages, 'joined')).role !== 'fire') throw new Error('第一台设备必须控制火人');
water.socket.send(JSON.stringify({ type: 'join', roomId }));
if ((await waitFor(water.messages, 'joined')).role !== 'water') throw new Error('第二台设备必须控制冰人');
fire.socket.close();
water.socket.close();
console.log('首关两台设备角色验证通过');
