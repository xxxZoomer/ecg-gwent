import { useState } from "react";
import GameBoard from "./GameBoard";
import { createGame } from "./game";
export default function App() {
  const [gameState] = useState(() => createGame("ARRHYTHMIA"));
  void gameState;

  return (
    <main className="app-shell is-battle-mode">
      <GameBoard
        cpuHand={[]}
        cpuDeckCount={gameState.cpuDeck.length}
        cpuDiscardCount={gameState.cpuDiscard.length}
        cpuBoard={gameState.cpuBoard}
        playerBoard={gameState.playerBoard}
        playerHand={gameState.playerHand}
        playerHandCount={gameState.playerHand.length}
        playerDeckCount={gameState.playerDeck.length}
        playerDiscardCount={gameState.playerDiscard.length}
        playerHealth={gameState.playerHealth}
        cpuHealth={gameState.cpuHealth}
        playerStatuses={gameState.playerStatuses}
        cpuStatuses={gameState.cpuStatuses}
        battleLog={gameState.battleLog}
        rhythm="NSR"
        playerFaction={gameState.playerFaction}
        cpuFaction={gameState.cpuFaction}
      />
    </main>
  );
}