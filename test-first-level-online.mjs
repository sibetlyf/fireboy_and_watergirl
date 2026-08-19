import assert from 'node:assert/strict';
import { RoomManager } from './online-room.mjs';

const manager = new RoomManager();
const fire = manager.join('QIXI', 'fire-player');
const water = manager.join('QIXI', 'water-player');
assert.equal(fire.role, 'fire');
assert.equal(water.role, 'water');
assert.equal(manager.snapshot(water.room).isReady, true);
assert.throws(() => manager.join('QIXI', 'third-player'), /房间已满/);
console.log('首关双设备角色分配检查通过');
