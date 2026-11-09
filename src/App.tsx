import GameBoard from "./GameBoard";

export default function App() {
  return (
    <GameBoard
      cpuHand={[]}
      cpuDeckCount={20}
      cpuDiscardCount={0}
      cpuBoard={[]}
      playerBoard={[]}
      playerHandCount={5}
      playerDeckCount={15}
      playerDiscardCount={0}
      playerHealth={30}
      cpuHealth={30}
      playerStatuses={[]}
      cpuStatuses={[]}
      battleLog={[]}
      rhythm="NSR"
      playerFaction="ARRHYTHMIA"
      cpuFaction="ISCHEMIA"
    />
  );
}