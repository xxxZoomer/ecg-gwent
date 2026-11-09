import { Activity } from 'lucide-react'
import { getCardEffect, getCardImpact, getCardRole, type ECGCard } from './game'

interface CardProps {
  card: ECGCard
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
  highlighted?: boolean
  variant?: 'hand' | 'board'
  faceDown?: boolean
}

const cardSynergies: Record<string, string> = {
  afib: 'VTと相性◎ · 手札を妨害して継続ダメージへ',
  ablation: 'AFカウンター · 解除成功で2 HP回復',
  flutter: 'VTなどと併用 · 継続ダメージを重ねる',
  psvt: 'VTと相性◎ · 複数の継続ダメージを重ねる',
  vtach: 'AFと相性◎ · 妨害中に毎ターン3ダメージ',
  amiodarone: 'VTカウンター · 解除成功で2 HP回復',
  hyperkalemia: 'VFへ進行 · 電解質軍は再使用でカウント短縮',
  vfib: '注意 · 相手のAEDで解除される',
  aed: 'VFカウンター · 解除成功で4 HP回復',
  stemi: 'NSTEMIと相性◎ · 虚血ダメージを重ねる',
  nstemi: 'STEMIと相性◎ · 虚血ダメージを重ねる',
  'calcium-gluconate': '高K解除＋2 HP回復 · 次の高K VFも予防',
  'insulin-glucose': '高K解除 · 成功時2 HP回復',
  'heart-failure': '長期戦向き · 相手のドローを妨害',
  'diuretic-therapy': '心不全対策 · 解除成功で3 HP回復',
  hypokalemia: 'VTなどと併用 · 継続ダメージを重ねる',
  'potassium-replacement': '低K解除 · 成功時2 HP回復',
  revascularization: '虚血カウンター · 解除成功で3 HP回復',
  wpw: 'VTなどと併用 · 継続ダメージを重ねる',
  brugada: '即時3ダメージ · 低HPの相手への追撃',
  rbbb: '継続ダメージを重ねてHPを削る',
  lbbb: '継続ダメージを重ねてHPを削る',
  'complete-av-block': 'VTなどと併用 · 継続ダメージを重ねる',
  'long-qt': 'VTなどと併用 · 継続ダメージを重ねる',
}

function Waveform({ card }: { card: ECGCard }) {
  return (
    <svg className={`card-wave wave-${card.color}`} viewBox="0 0 160 60" role="img" aria-label={`${card.name}の心電図波形`}>
      <path d="M0 32 H160" className="wave-baseline" />
      <path d={card.waveform} className="wave-line" />
    </svg>
  )
}

function CardContent({ card, compact }: { card: ECGCard; compact: boolean }) {
  const role = getCardRole(card)
  return (
    <>
      <div className="card-header">
        <div className="min-w-0">
          {!compact && <span className="card-family">{({
            ARRHYTHMIA: '不整脈軍',
            VENTRICULAR: '不整脈軍',
            CONDUCTION: '不整脈軍',
            CHANNEL: '不整脈軍',
            ELECTROLYTE: '電解質軍',
            ISCHEMIA: '虚血軍',
            'HEART FAILURE': '心不全軍',
          } as Record<string, string>)[card.family] ?? card.family}</span>}
          <h3 className="mt-1 text-sm font-bold text-ink">{card.name}</h3>
        </div>
        <div className="card-badges">
          <span className={`card-role role-${role.toLowerCase()}`}>{role}</span>
          <span className="power-badge">{card.power}</span>
        </div>
      </div>
      {!compact && <Waveform card={card} />}
      <span className="card-impact">{getCardImpact(card)}</span>
      {!compact && <div className="card-findings">
        <span className="findings-label">ECG FINDINGS · {card.lead}</span>
        <span>{card.findings}</span>
      </div>}
      {!compact && <span className="card-status-effect">{getCardEffect(card)}</span>}
      {!compact && cardSynergies[card.id] && (
        <span className="card-synergy" aria-label={`カード相性: ${cardSynergies[card.id]}`}>
          <strong>SYNERGY</strong>{cardSynergies[card.id]}
        </span>
      )}
    </>
  )
}

export default function Card({ card, onClick, selected = false, disabled = false, highlighted = false, variant = 'hand', faceDown = false }: CardProps) {
  if (faceDown) {
    return <div className="cpu-card-back" role="img" aria-label="CPUの伏せ札"><Activity size={13} aria-hidden="true" /></div>
  }

  const className = `playing-card card-${card.color} ${variant === 'board' ? 'board-card' : ''} ${selected ? 'is-selected' : ''} ${highlighted ? 'is-last-played' : ''}`
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={selected} disabled={disabled} className={className} title={getCardEffect(card)}>
        <CardContent card={card} compact={variant === 'board'} />
      </button>
    )
  }

  return <div className={className} title={getCardEffect(card)}><CardContent card={card} compact={variant === 'board'} /></div>
}