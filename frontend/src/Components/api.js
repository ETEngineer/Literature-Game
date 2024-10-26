import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Backend server URL

export function createRoom(playerName, callback) {
  socket.emit("createRoom", { playerName }, callback);
}

export function joinRoom(roomId, playerName, callback) {
  socket.emit("joinRoom", { roomId, playerName }, callback);
}

export function requestCard(
  roomId,
  fromPlayerId,
  toPlayerId,
  requestedCard,
  callback
) {
  socket.emit(
    "requestCard",
    { roomId, fromPlayerId, toPlayerId, requestedCard },
    callback
  );
}

export function declareSet(roomId, playerId, setCards, callback) {
  socket.emit("declareSet", { roomId, playerId, setCards }, callback);
}

export function onRoomUpdate(callback) {
  socket.on("roomUpdate", callback);
}

export function disconnect() {
  socket.disconnect();
}
