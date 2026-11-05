import { Activity } from 'lucide-react'
import type { ECGCard } from './game'

interface CardProps {
  card: ECGCard
  onClick?: () => void
  selected?: boolean
  variant?: 'hand' | 'board'
  faceDown?: boolean
}

function Waveform({ card }: { card: ECGCard }) {
  return (
    <svg className={`card-wave wave-${card.color}`} viewBox="0 0 160 60" role="img" aria-label={`${card.name}の心電図波形`}>
      <path d="M0 32 H160" className="wave-baseline" />
      <path d={card.waveform} className="wave-line" />
    </svg>
  )
}

function CardContent({ card }: { card: ECGCard }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="card-family">{card.family}</span>
          <h3 className="mt-1 text-sm font-bold text-ink">{card.name}</h3>
        </div>
        <span className="power-badge">{card.power}</span>
      </div>
      <Waveform card={card} />
      <div className="card-findings">
        <span className="findings-label">ECG FINDINGS · {card.lead}</span>
        <span>{card.findings}</span>
      </div>
    </>
  )
}

export default function Card({ card, onClick, selected = false, variant = 'hand', faceDown = false }: CardProps) {
  if (faceDown) {
    return <div className="cpu-card-back" role="img" aria-label="CPUの伏せ札"><Activity size={13} aria-hidden="true" /></div>
  }

  const className = `playing-card card-${card.color} ${variant === 'board' ? 'board-card' : ''} ${selected ? 'is-selected' : ''}`

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={selected} className={className}>
        <CardContent card={card} />
      </button>
    )
  }

  return <div className={className}><CardContent card={card} /></div>
}