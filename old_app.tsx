import { useEffect, useState } from 'react'
import { Activity, ArrowRight, HeartPulse, RotateCcw, Sparkles } from 'lucide-react'
import Card from './Card'
import GameBoard from './GameBoard'
import {
  boardScore,
  cardCatalog,
  createGame,
  passTurn,
  playCard,
  takeCpuTurn,
  type GameState,
} from './game'

function ResultScreen({ game, onRestart }: { game: GameState; onRestart: () => void }) {
  const victory = game.result === 'victory'
  const draw = game.result === 'draw'
  return (
    <div className="result-overlay" role="dialog" aria-modal="true" aria-labelledby="result-title">
      <div className="result-panel">
        <div className={`result-mark ${victory ? 'result-win' : draw ? 'result-draw' : 'result-loss'}`}>
          {victory ? <Sparkles size={28} /> : <HeartPulse size={28} />}
        </div>
        <p className="eyebrow mt-6">MATCH COMPLETE · BEST OF 3</p>
        <h2 id="result-title" className="mt-2 font-serif text-4xl font-semibold text-ink">
          {victory ? 'Victory' : draw ? 'Draw' : 'Defeat'}
        </h2>
        <p className="mt-3 text-sm text-muted">YOU {game.playerRounds} — {game.cpuRounds} CPU</p>
        <button type="button" className="primary-button mt-8 w-full" onClick={onRestart}>
          <RotateCcw size={16} /> もう一度プレイ
        </button>
      </div>
    </div>
  )
}

function App() {
  const [game, setGame] = useState(createGame)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const playerScore = boardScore(game.playerBoard)
  const cpuScore = boardScore(game.cpuBoard)
  const isPlayerTurn = game.turn === 'player' && !game.playerPassed

  useEffect(() => {
    if (game.turn !== 'cpu') return
    const timeout = window.setTimeout(() => setGame((current) => takeCpuTurn(current)), 720)
    return () => window.clearTimeout(timeout)
  }, [game])

  useEffect(() => {
    if (!game.playerHand.some((card) => card.id === selectedId)) setSelectedId(null)
  }, [game.playerHand, selectedId])

  const restart = () => {
    setSelectedId(null)
    setGame(createGame())
  }

  const handlePlay = () => {
    if (!selectedId) return
    setGame((current) => playCard(current, selectedId))
  }

  return (
    <div className="min-h-screen text-ink">
      <header className="app-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-7">
          <a href="#top" className="brand-lockup" aria-label="ECG Gwent ホーム">
            <span className="brand-icon"><Activity size={21} strokeWidth={2.2} /></span>
            <span><strong>ECG</strong><span className="brand-divider">/</span><strong>GWENT</strong></span>
          </a>
          <button type="button" className="icon-button" onClick={restart} aria-label="新しいゲーム" title="新しいゲーム">
            <RotateCcw size={17} />
          </button>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-4 pb-10 pt-5 sm:px-7 sm:pt-8">
        <section className="mb-6 flex flex-col justify-between gap-5 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">SINGLE PLAYER · BEST OF 3 · CPU MATCH</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">リズムを読み、勝負を決める。</h1>
          </div>
          <div className="round-track" aria-label={`第${game.round}ラウンド / 全3ラウンド`}>
            {[1, 2, 3].map((round) => (
              <div key={round} className={`round-step ${round === game.round && game.turn !== 'finished' ? 'round-current' : round < game.round || game.turn === 'finished' && round === game.round ? 'round-done' : ''}`}>
                <span>{String(round).padStart(2, '0')}</span>
                <i />
              </div>
            ))}
          </div>
        </section>

        <section className="score-strip" aria-label="ラウンドスコア">
          <div className="score-side">
            <span className="score-label"><span className="status-dot player-dot" /> YOU</span>
            <span className="score-number">{playerScore}</span>
            <span className="round-wins">{game.playerRounds} <small>ROUND{game.playerRounds === 1 ? '' : 'S'}</small></span>
          </div>
          <div className="score-middle">
            <span className="score-caption">ROUND {String(game.round).padStart(2, '0')} / 03</span>
            <span className="vs-label">VS</span>
            <span className="turn-caption">{game.turn === 'cpu' ? 'CPU THINKING' : game.turn === 'finished' ? 'COMPLETE' : game.playerPassed ? 'YOU PASSED' : 'YOUR TURN'}</span>
          </div>
          <div className="score-side score-side-right">
            <span className="score-label">CPU <span className="status-dot cpu-dot" /></span>
            <span className="score-number">{cpuScore}</span>
            <span className="round-wins">{game.cpuRounds} <small>ROUND{game.cpuRounds === 1 ? '' : 'S'}</small></span>
          </div>
        </section>

        <GameBoard cpuHand={game.cpuHand} cpuBoard={game.cpuBoard} playerBoard={game.playerBoard} round={game.round} />

        <section className="hand-section" aria-labelledby="hand-title">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">YOUR HAND <span className="hand-count">{game.playerHand.length} CARDS</span></p>
              <h2 id="hand-title" className="mt-1 font-serif text-2xl font-semibold text-ink">手札を選ぶ</h2>
            </div>
            <div className="flex gap-2">
              <button type="button" className="secondary-button" onClick={() => setGame((current) => passTurn(current))} disabled={!isPlayerTurn}>
                パス
              </button>
              <button type="button" className="primary-button" onClick={handlePlay} disabled={!isPlayerTurn || !selectedId}>
                プレイする <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="hand-grid">
            {game.playerHand.map((card) => (
              <Card key={card.id} card={card} selected={card.id === selectedId} onClick={() => isPlayerTurn && setSelectedId(card.id === selectedId ? null : card.id)} />
            ))}
            {!game.playerHand.length && <p className="hand-empty">手札がありません。次のラウンドまでお待ちください。</p>}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
            <p className="status-message" aria-live="polite">{game.turn === 'cpu' ? <span className="thinking-pulse" /> : <span className="status-dot player-dot" />}{game.message}</p>
            <p className="catalog-note">ECG DECK <span>{cardCatalog.length} CARDS</span></p>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-6xl items-center justify-between px-4 pb-5 text-[10px] font-semibold tracking-widest text-muted sm:px-7">
        <span>ECG GWENT</span><span>READ THE RHYTHM</span>
      </footer>
      {game.result && <ResultScreen game={game} onRestart={restart} />}
    </div>
  )
}

export default App