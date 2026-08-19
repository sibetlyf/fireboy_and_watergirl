import assert from 'node:assert/strict';
import { RoomManager } from './online-room.mjs';

const rooms = new RoomManager();
const created = rooms.create({ to:'小鹿', message:'星河见证我们的相遇', from:'你的朋友' }, 'owner');
assert.match(created.room.id, /^[A-Z0-9]{6}$/);
assert.deepEqual(created.room.card, { to:'小鹿', message:'星河见证我们的相遇', from:'你的朋友' });
const joined = rooms.join(created.room.id, 'guest');
assert.equal(joined.role, 'water');
assert.deepEqual(rooms.snapshot(created.room).card, created.room.card);
console.log('房主贺卡与房间号协议检查通过');
