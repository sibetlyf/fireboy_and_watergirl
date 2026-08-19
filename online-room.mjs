export class RoomManager {
  constructor() { this.rooms = new Map(); }

  roomId(value) {
    const roomId = String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    if (roomId.length < 4) throw new Error('房间码至少需要 4 位字母或数字');
    return roomId;
  }

  join(rawRoomId, playerId) {
    const id = this.roomId(rawRoomId);
    const room = this.rooms.get(id) ?? { id, players: new Map() };
    if (room.players.size >= 2) throw new Error('房间已满');
    const role = room.players.size === 0 ? 'fire' : 'water';
    room.players.set(playerId, { id: playerId, role });
    this.rooms.set(id, room);
    return { room, role };
  }

  leave(rawRoomId, playerId) {
    const room = this.rooms.get(this.roomId(rawRoomId));
    if (!room) return null;
    room.players.delete(playerId);
    if (!room.players.size) { this.rooms.delete(room.id); return null; }
    return room;
  }

  snapshot(room) {
    return { type: 'room', roomId: room.id, isReady: room.players.size === 2, players: [...room.players.values()] };
  }
}
