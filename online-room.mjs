export class RoomManager {
  constructor() { this.rooms = new Map(); }

  roomId(value) {
    const roomId = String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    if (roomId.length < 4) throw new Error('房间码至少需要 4 位字母或数字');
    return roomId;
  }
  mode(value) { return value === 'adventure' ? 'adventure' : 'message'; }
  generatedRoomId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let id = '';
    do { id = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''); } while (this.rooms.has(id)); return id;
  }
  cardConfig(card = {}) {
    const clean = value => String(value ?? '').trim().slice(0, 160);
    return { to:clean(card.to)||'洛小白', message:clean(card.message)||'愿我们每一次并肩，都走向更辽阔的星河。', from:clean(card.from)||'—— 与你同行' };
  }
  create(options = {}, playerId) {
    const id = this.generatedRoomId(), mode = this.mode(options.mode);
    const room = { id, mode, card:this.cardConfig(options.card ?? options), players:new Map() };
    room.players.set(playerId, { id:playerId, role:'fire' }); this.rooms.set(id, room); return { room, role:'fire' };
  }
  join(rawRoomId, playerId, requestedMode) {
    const id = this.roomId(rawRoomId);
    const room = this.rooms.get(id) ?? { id, mode:this.mode(requestedMode), card:this.cardConfig(), players:new Map() };
    if (requestedMode && room.mode !== this.mode(requestedMode)) throw new Error('邀请链接模式与房间不一致');
    if (room.players.size >= 2) throw new Error('房间已满');
    const role = room.players.size === 0 ? 'fire' : 'water'; room.players.set(playerId, { id:playerId, role }); this.rooms.set(id, room); return { room, role };
  }
  leave(rawRoomId, playerId) { const room=this.rooms.get(this.roomId(rawRoomId)); if(!room)return null; room.players.delete(playerId); if(!room.players.size){this.rooms.delete(room.id);return null;} return room; }
  snapshot(room) { return { type:'room', roomId:room.id, mode:room.mode, isReady:room.players.size===2, card:room.card, players:[...room.players.values()] }; }
}
