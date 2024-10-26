import React, { useState, useEffect } from "react";
import {
  createRoom,
  joinRoom,
  requestCard,
  declareSet,
  onRoomUpdate,
  disconnect,
} from "./api.js";

const GameRoom = ({ playerName, roomId }) => {
  const [gameState, setGameState] = useState(null);
  const [selectedCard, setSelectedCard] = useState("");
  const [targetPlayer, setTargetPlayer] = useState("");

  useEffect(() => {
    onRoomUpdate((state) => setGameState(state));

    // Clean up on component unmount
    return () => disconnect();
  }, []);

  const handleRequestCard = () => {
    const fromPlayerId = gameState.players.find(
      (p) => p.playerName === playerName
    ).playerId;
    const toPlayerId = gameState.players.find(
      (p) => p.playerName === targetPlayer
    ).playerId;

    requestCard(roomId, fromPlayerId, toPlayerId, selectedCard, (response) => {
      if (response.error) alert(response.error);
      else setSelectedCard(""); // Reset after successful request
    });
  };

  const handleDeclareSet = () => {
    const playerId = gameState.players.find(
      (p) => p.playerName === playerName
    ).playerId;
    const setCards = prompt(
      "Enter the cards for your set (comma-separated):"
    ).split(",");

    declareSet(roomId, playerId, setCards, (response) => {
      if (response.error) alert(response.error);
    });
  };

  if (!gameState) return <div>Loading game...</div>;

  const player = gameState.players.find((p) => p.playerName === playerName);

  return (
    <div>
      <h1>Literature Card Game</h1>
      <h2>Room ID: {roomId}</h2>
      <h3>
        Player: {playerName} (Team {player.team})
      </h3>

      <div>
        <h3>Your Hand</h3>
        <div>
          {player.hand.map((card, idx) => (
            <button key={idx} onClick={() => setSelectedCard(card)}>
              {card}
            </button>
          ))}
        </div>
        <p>Selected Card: {selectedCard || "None"}</p>
      </div>

      <div>
        <h3>Players</h3>
        <ul>
          {gameState.players.map((p) => (
            <li key={p.playerId}>
              {p.playerName} (Team {p.team}) - Cards: {p.handSize}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Actions</h3>
        <label>
          Request Card From:
          <select
            onChange={(e) => setTargetPlayer(e.target.value)}
            value={targetPlayer}
          >
            <option value="">Select Player</option>
            {gameState.players
              .filter((p) => p.playerId !== player.playerId)
              .map((p) => (
                <option key={p.playerId} value={p.playerName}>
                  {p.playerName}
                </option>
              ))}
          </select>
        </label>
        <button
          onClick={handleRequestCard}
          disabled={!selectedCard || !targetPlayer}
        >
          Request Card
        </button>

        <button onClick={handleDeclareSet}>Declare Set</button>
      </div>

      <div>
        <h3>Game State</h3>
        <p>Current Turn: {gameState.players[gameState.turnIndex].playerName}</p>
        <h4>Completed Sets</h4>
        <ul>
          {gameState.setsCompleted.map((set, idx) => (
            <li key={idx}>
              Team {set.team}: {set.setCards.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameRoom;
