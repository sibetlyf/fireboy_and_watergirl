import assert from 'node:assert/strict';
import { RoomManager } from './online-room.mjs';

const rooms = new RoomManager();
const created = rooms.create({ mode:'message', card:{ to:'小鹿', leftConstellation:'leo', rightConstellation:'pisces' } }, 'owner');
assert.equal(created.room.card.leftConstellation, 'leo');
assert.equal(created.room.card.rightConstellation, 'pisces');
assert.equal(rooms.cardConfig({ leftConstellation:'invalid', rightConstellation:'aries' }).leftConstellation, 'taurus');
assert.equal(rooms.cardConfig({ leftConstellation:'invalid', rightConstellation:'aries' }).rightConstellation, 'aries');
console.log('寄语双自定义星座房间协议检查通过');
