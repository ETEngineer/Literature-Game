import React, { useState } from "react";
import GameRoom from "./Components/GameRoom";
import { createRoom, joinRoom } from "./Components/api";

function App() {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const handleCreateRoom = () => {
    createRoom(playerName, ({ roomId, player }) => {
      setRoomId(roomId);
      setGameStarted(true);
    });
  };

  const handleJoinRoom = () => {
    joinRoom(roomId, playerName, ({ error, player }) => {
      if (error) alert(error);
      else setGameStarted(true);
    });
  };

  return (
    <div>
      {!gameStarted ? (
        <div>
          <h1>Welcome to the Literature Card Game</h1>
          <label>
            Player Name:
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </label>
          <div>
            <button onClick={handleCreateRoom} disabled={!playerName}>
              Create Room
            </button>
            <label>
              Room ID:
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </label>
            <button onClick={handleJoinRoom} disabled={!playerName || !roomId}>
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <GameRoom playerName={playerName} roomId={roomId} />
      )}
    </div>
  );
}

export default App;
