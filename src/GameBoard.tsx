import { Activity, ArrowRight } from 'lucide-react'
import Card from './Card'
import type { ECGCard } from './game'

interface GameBoardProps {
  cpuHand: ECGCard[]
  cpuBoard: ECGCard[]
  playerBoard: ECGCard[]
  round: number
}

export default function GameBoard({ cpuHand, cpuBoard, playerBoard, round }: GameBoardProps) {
  return (
    <section className="battlefield" aria-label="対戦ボード">
      <div className="board-side">
        <div className="board-heading">
          <div><span className="board-kicker">OPPONENT</span><h2>CPU</h2></div>
          <span className="board-total">{cpuBoard.reduce((score, card) => score + card.power, 0)}<small> PTS</small></span>
        </div>
        <div className="cpu-hand-row" aria-label={`CPUの手札 ${cpuHand.length}枚`}>
          <span className="cpu-hand-label">CPU HAND</span>
          <div className="cpu-hand-cards">
            {cpuHand.map((card) => <Card key={card.id} card={card} faceDown />)}
            {!cpuHand.length && <span className="cpu-hand-empty">手札なし</span>}
          </div>
          <span className="cpu-hand-count">{cpuHand.length}</span>
        </div>
        <div className="board-cards">
          {cpuBoard.length
            ? cpuBoard.map((card) => <Card key={card.id} card={card} variant="board" />)
            : <p className="empty-board"><Activity size={17} />カードが出ていません</p>}
        </div>
      </div>

      <div className="battle-divider"><span>ROUND {round}</span><ArrowRight size={14} /></div>

      <div className="board-side player-board-side">
        <div className="board-heading">
          <div><span className="board-kicker">YOUR FIELD</span><h2>あなた</h2></div>
          <span className="board-total">{playerBoard.reduce((score, card) => score + card.power, 0)}<small> PTS</small></span>
        </div>
        <div className="board-cards">
          {playerBoard.length
            ? playerBoard.map((card) => <Card key={card.id} card={card} variant="board" />)
            : <p className="empty-board"><Activity size={17} />カードをプレイして盤面を作ろう</p>}
        </div>
      </div>
    </section>
  )
}