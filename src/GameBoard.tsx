import { Activity } from 'lucide-react'
import Card from './Card'
import ECGMonitor from './ECGMonitor'
import {
  battleFactions,
  type BattleFaction,
  type BattleLogEntry,
  type BattleStatus,
  type ECGCard,
  type GameState,
} from './game'
import type { ECGRhythm } from './types'

const comboGuides: {
  faction: BattleFaction
  steps: { title: string; detail: string }[]
  strategy: string
}[] = [
  {
    faction: 'ARRHYTHMIA',
    steps: [
      { title: 'AF', detail: '相手の手札を捨てさせる' },
      { title: 'VT', detail: '毎ターン3ダメージ' },
      { title: 'VF', detail: '即時・継続ダメージ＋行動不能' },
    ],
    strategy: '手札を妨害している間に継続ダメージを重ね、VFで一気に攻める。',
  },
  {
    faction: 'ELECTROLYTE',
    steps: [
      { title: '高K', detail: 'VFまでのカウントを付与' },
      { title: 'QRS延長', detail: '高Kが進行したときの波形サイン' },
      { title: 'VF', detail: 'カウント終了で発症' },
    ],
    strategy: 'ゲームでは高Kを再使用すると、電解質軍の能力でVFカウントを短縮できる。',
  },
  {
    faction: 'ISCHEMIA',
    steps: [
      { title: 'STEMI', detail: '即時＋継続ダメージ' },
      { title: 'NSTEMI', detail: '虚血ダメージを追加' },
      { title: '虚血を累積', detail: '継続ダメージでHPを削る' },
    ],
    strategy: 'STEMIとNSTEMIで虚血を重ね、相手のHPを継続的に削る。',
  },
  {
    faction: 'HEART FAILURE',
    steps: [
      { title: '心不全', detail: '継続ダメージ＋相手のドローを阻害' },
      { title: '自動回復', detail: '自分のターン開始時に1 HP回復' },
      { title: '長期戦', detail: '回復しながら相手のHPを削る' },
    ],
    strategy: '心不全の継続圧力と勢力能力の回復で、耐久戦に持ち込む。',
  },
]

const counterGuides = [
  { status: 'AF', card: 'アブレーション', effect: 'AF解除 · 成功時2 HP回復' },
  { status: 'VT', card: 'アミオダロン', effect: 'VT解除 · 成功時2 HP回復' },
  { status: 'VF', card: 'AED', effect: 'VF解除 · 成功時4 HP回復' },
  { status: '高K', card: 'カルシウム製剤', effect: '高K解除 · 成功時2 HP回復＋VF予防' },
  { status: '虚血', card: '再灌流', effect: '虚血解除 · 成功時3 HP回復' },
  { status: '心不全', card: '利尿薬', effect: '心不全解除 · 成功時3 HP回復' },
]

interface GameBoardProps {
  cpuHand: ECGCard[]
  cpuDeckCount: number
  cpuDiscardCount: number
  cpuBoard: ECGCard[]
  playerBoard: ECGCard[]
  playerHand: ECGCard[]
  playerHandCount: number
  playerDeckCount: number
  playerDiscardCount: number
  playerHealth: number
  cpuHealth: number
  turnNumber: GameState['turnNumber']
  turn: GameState['turn']
  playerStatuses: BattleStatus[]
  cpuStatuses: BattleStatus[]
  battleLog: BattleLogEntry[]
  rhythm: ECGRhythm
  playerFaction: BattleFaction
  cpuFaction: BattleFaction
}

function getStatusDescription(status: BattleStatus): string {
  const remainingTurns = status.turnsRemaining === Infinity ? '残り∞ターン' : `残り${status.turnsRemaining}ターン`
  switch (status.id) {
    case 'atrial-fibrillation':
      return `混乱 · 手札を1枚ランダムに失う · ${remainingTurns}`
    case 'atrial-flutter':
      return `毎ターン1ダメージ · ${remainingTurns}`
    case 'ventricular-tachycardia':
      return `毎ターン3ダメージ · ${remainingTurns}`
    case 'ventricular-fibrillation':
      return `行動不能 · AEDで解除 · ${remainingTurns}`
    case 'vf-complication':
      return `毎ターン開始時${status.damageAtTurnStart}ダメージ · ${remainingTurns}`
    case 'hyperkalemia':
      return `VF発症まで${status.turnsRemaining}ターン`
    default:
      if (status.kind === 'damage') {
        const timings = [
          status.damageAtTurnStart > 0 && `ターン開始時${status.damageAtTurnStart}ダメージ`,
          status.damageAtTurnEnd > 0 && `ターン終了時${status.damageAtTurnEnd}ダメージ`,
        ].filter(Boolean).join('・')
        return `${timings || 'ダメージなし'} · ${remainingTurns}`
      }
      if (status.kind === 'stun') return `行動不能 · ${remainingTurns}`
      return `${status.label} · ${remainingTurns}`
  }
}

function ActiveStatusColumn({ title, statuses }: { title: string; statuses: BattleStatus[] }) {
  return (
    <div className="active-status-column">
      <h3>{title}</h3>
      {statuses.length ? (
        <div className="active-status-list">
          {statuses.map((status) => (
            <article className={`active-status-card active-status-${status.kind}`} key={status.id}>
              <strong>{status.label}</strong>
              <span>{getStatusDescription(status)}</span>
            </article>
          ))}
        </div>
      ) : (
        <p className="active-status-none">状態異常なし</p>
      )}
    </div>
  )
}

function CombatantInfo({
  side,
  faction,
  health,
  handCount,
  deckCount,
  discardCount,
}: {
  side: 'cpu' | 'player'
  faction: BattleFaction
  health: number
  handCount: number
  deckCount: number
  discardCount: number
}) {
  const isCpu = side === 'cpu'
  const title = isCpu ? 'CPU' : 'あなた'
  const factionInfo = battleFactions.find((entry) => entry.id === faction)
  const healthPercent = Math.max(0, Math.min(100, health / 30 * 100))

  return (
    <div className="combatant-info">
      <div className="combatant-heading">
        <div>
          <span className="board-kicker">{isCpu ? 'OPPONENT' : 'YOUR SIDE'}</span>
          <h2>{title}</h2>
        </div>
      </div>
      {factionInfo && (
        <div className="combatant-faction">
          <strong>{factionInfo.name}</strong>
          <span>{factionInfo.ability}</span>
        </div>
      )}
      <div className="health-readout">
        <span>VITALITY</span>
        <strong>{health}<small> / 30</small></strong>
      </div>
      <div className="health-track" role="progressbar" aria-label={`${title}のHP`} aria-valuenow={health} aria-valuemin={0} aria-valuemax={30}>
        <span style={{ width: `${healthPercent}%` }} />
      </div>
      <dl className="combatant-card-counts">
        <div><dt>手札</dt><dd>{handCount}</dd></div>
        <div><dt>山札</dt><dd>{deckCount}</dd></div>
        <div><dt>捨札</dt><dd>{discardCount}</dd></div>
      </dl>
    </div>
  )
}

function CombatantField({ side, cards, statuses }: { side: 'cpu' | 'player'; cards: ECGCard[]; statuses: BattleStatus[] }) {
  const isCpu = side === 'cpu'
  const lastCardId = cards[cards.length - 1]?.id
  return (
    <section className={`combatant-field ${isCpu ? 'cpu-field' : 'player-field'}`} aria-label={isCpu ? 'CPU FIELD' : 'PLAYER FIELD'}>
      <div className="field-heading">
        <h3>{isCpu ? 'CPU FIELD' : 'PLAYER FIELD'}</h3>
        <span>{cards.length} cards</span>
      </div>
      <div className={`combatant-cards ${isCpu ? 'cpu-field-cards' : 'player-field-cards'}`}>
        {cards.length
          ? cards.map((card) => <Card key={card.id} card={card} variant="board" highlighted={card.id === lastCardId} />)
          : <p className="empty-board"><Activity size={15} />フィールドは空です</p>}
      </div>
      <ActiveStatusColumn title={isCpu ? 'CPUの状態異常' : 'プレイヤーの状態異常'} statuses={statuses} />
    </section>
  )
}

function BattleLog({ entries }: { entries: BattleLogEntry[] }) {
  return (
    <section className="battle-log" aria-labelledby="battle-log-title" aria-live="polite">
      <header className="battle-log-heading">
        <div>
          <p className="eyebrow">BATTLE RECORD · LATEST 10</p>
          <h2 id="battle-log-title">Battle Log</h2>
        </div>
        <span>{entries.length} / 10</span>
      </header>
      {entries.length ? (
        <ol className="battle-log-list">
          {entries.map((entry) => (
            <li className={`battle-log-entry ${entry.actor === 'cpu' ? 'log-cpu' : 'log-player'}`} key={entry.id}>
              <div className="battle-log-entry-heading">
                <span>Turn {entry.turn}</span>
                <strong>{entry.title}</strong>
              </div>
              {entry.details.length
                ? <ul>{entry.details.map((detail, index) => <li key={`${entry.id}-${index}`}>{detail}</li>)}</ul>
                : <p>状態変化なし</p>}
            </li>
          ))}
        </ol>
      ) : <p className="battle-log-empty">カードを使うと、行動と戦況の変化が時系列で記録されます。</p>}
    </section>
  )
}

function ComboGuide({ playerFaction }: { playerFaction: BattleFaction }) {
  return (
    <section className="combo-guide" aria-labelledby="combo-guide-title">
      <header className="combo-guide-heading">
        <div>
          <p className="board-kicker">STRATEGY GUIDE</p>
          <h2 id="combo-guide-title">推奨コンボ</h2>
        </div>
        <p>勢力の能力を活かした勝ち筋</p>
      </header>
      <div className="combo-guide-grid">
        {comboGuides.map((guide) => {
          const faction = battleFactions.find((entry) => entry.id === guide.faction)
          const isSelected = guide.faction === playerFaction
          return (
            <article className={`combo-guide-route${isSelected ? ' is-selected' : ''}`} key={guide.faction}>
              <header>
                <h3>{faction?.name}</h3>
                {isSelected && <span>あなたの勢力</span>}
              </header>
              <ol className="combo-guide-steps">
                {guide.steps.map((step, index) => (
                  <li key={step.title}>
                    {index > 0 && <span className="combo-guide-arrow" aria-hidden="true">↓</span>}
                    <div className="combo-guide-step">
                      <strong>{step.title}</strong>
                      <span>{step.detail}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <p>{guide.strategy}</p>
            </article>
          )
        })}
      </div>
      <p className="combo-guide-note">現在のカード効果と勢力能力に基づく例です。</p>
    </section>
  )
}

function CounterGuide() {
  return (
    <section className="counter-guide" aria-labelledby="counter-guide-title">
      <header className="counter-guide-heading">
        <div>
          <p className="board-kicker">DEFEND · CLEAR · RECOVER</p>
          <h2 id="counter-guide-title">解除・カウンター</h2>
        </div>
        <p>相手の攻めを止めて、HPを立て直す</p>
      </header>
      <div className="counter-guide-grid">
        {counterGuides.map((guide) => (
          <article className="counter-guide-item" key={guide.status}>
            <strong>{guide.status}<span>解除</span></strong>
            <div>
              <b>{guide.card}</b>
              <span>{guide.effect}</span>
            </div>
          </article>
        ))}
      </div>
      <p className="counter-guide-note">解除札は対応する状態異常がある時に有効。インスリン＋ブドウ糖も高Kを解除し、カルシウム製剤はVF予防にも使えます。</p>
    </section>
  )
}

function WinProgress({ cpuHealth, cpuStatuses, cpuFaction }: {
  cpuHealth: number
  cpuStatuses: BattleStatus[]
  cpuFaction: BattleFaction
}) {
  const hyperkalemia = cpuStatuses.find((status) => status.id === 'hyperkalemia')
  const vf = cpuStatuses.find((status) => status.id === 'ventricular-fibrillation')
  const nextTurnDamage = cpuStatuses.reduce((total, status) => total + status.damageAtTurnStart, 0)
  const damageAfterFactionAbility = Math.max(0, nextTurnDamage - Number(cpuFaction === 'HEART FAILURE'))
  const vfBlocked = cpuStatuses.some((status) => status.id === 'membrane-stabilized')
  const remainingHealth = Math.max(0, cpuHealth)
  let headline = `CPUの残りHP：${remainingHealth}。攻撃や継続ダメージを重ねよう。`
  let advice = 'VT・VFなどの攻撃を狙い、相手HPを0にする。'

  if (hyperkalemia) {
    headline = vfBlocked
      ? `高KのVF発症まで${hyperkalemia.turnsRemaining}ターン（カルシウムで防御中）`
      : `VF発症まで${hyperkalemia.turnsRemaining}ターン`
    advice = vfBlocked
      ? 'カルシウムの防御が残っている間はVFを防がれる。継続ダメージも重ねよう。'
      : 'VFが発症する前に、相手のHPを削り切れるか確認しよう。'
  } else if (vf) {
    headline = `CPUはVFで行動不能 · 残り${vf.turnsRemaining}ターン`
    advice = '行動不能の間に、VTなどの継続ダメージを重ねてHPを0にしよう。'
  } else if (nextTurnDamage > 0) {
    headline = `次回CPUターン開始時に継続ダメージ ${nextTurnDamage}`
    advice = damageAfterFactionAbility >= remainingHealth
      ? '次回のダメージで勝利圏内。相手の回復・解除カードには注意。'
      : `継続ダメージを維持しつつ、あと${remainingHealth} HPを削ろう。`
  } else if (remainingHealth <= 10) {
    headline = `勝利目前 · CPUの残りHP ${remainingHealth}`
    advice = '手札の攻撃カードでとどめを狙おう。'
  }

  return (
    <section className="win-progress" aria-labelledby="win-progress-title">
      <div className="win-progress-copy">
        <p className="board-kicker">PATH TO VICTORY</p>
        <h2 id="win-progress-title">勝利への近さ</h2>
        <strong>{headline}</strong>
        <p>{advice}</p>
      </div>
      <div className="win-progress-meter">
        <div className="win-progress-label">
          <span>CPU VITALITY</span>
          <strong>{remainingHealth} / 30</strong>
        </div>
        <div className="win-progress-track" role="progressbar" aria-label="CPUの残りHP" aria-valuenow={remainingHealth} aria-valuemin={0} aria-valuemax={30}>
          <span style={{ width: `${Math.min(100, remainingHealth / 30 * 100)}%` }} />
        </div>
      </div>
    </section>
  )
}

export default function GameBoard({
  cpuHand,
  cpuDeckCount,
  cpuDiscardCount,
  cpuBoard,
  playerBoard,
  playerHand,
  playerHandCount,
  playerDeckCount,
  playerDiscardCount,
  playerHealth,
  cpuHealth,
  turnNumber,
  turn,
  playerStatuses,
  cpuStatuses,
  battleLog,
  rhythm,
  playerFaction,
  cpuFaction,
}: GameBoardProps) {
  return (
    <section className="battlefield battle-arena" aria-label="状態異常バトル">
      <dl className="game-status-bar" aria-label="ゲーム状況">
        <div className="game-status-item is-cpu">
          <dt>CPU HP</dt>
          <dd>{cpuHealth}<small> / 30</small></dd>
        </div>
        <div className="game-status-item is-player">
          <dt>PLAYER HP</dt>
          <dd>{playerHealth}<small> / 30</small></dd>
        </div>
        <div className="game-status-item">
          <dt>現在ターン</dt>
          <dd>第{turnNumber}ターン</dd>
        </div>
        <div className="game-status-item">
          <dt>現在の手番</dt>
          <dd className={`game-status-turn is-${turn}`} aria-live="polite">
            {turn === 'player' ? 'PLAYER TURN' : turn === 'cpu' ? 'CPU TURN' : 'GAME OVER'}
          </dd>
        </div>
      </dl>
      <section className="combatant-panel cpu-combatant" aria-label="CPUの戦況">
        <CombatantInfo
          side="cpu"
          faction={cpuFaction}
          health={cpuHealth}
          handCount={cpuHand.length}
          deckCount={cpuDeckCount}
          discardCount={cpuDiscardCount}
        />
      </section>
      <CombatantField side="cpu" cards={cpuBoard} statuses={cpuStatuses} />
      <div className="battle-ecg-monitor" aria-label="補助 ECG 波形">
        <ECGMonitor rhythm={rhythm} interactive={false} altarMode showDiagnosis />
      </div>
      <CombatantField side="player" cards={playerBoard} statuses={playerStatuses} />
      <section className="combatant-panel player-combatant" aria-label="プレイヤーの戦況">
        <CombatantInfo
          side="player"
          faction={playerFaction}
          health={playerHealth}
          handCount={playerHandCount}
          deckCount={playerDeckCount}
          discardCount={playerDiscardCount}
        />
        <section className="player-hand-area">
          <h3>HAND</h3>
          <div className="player-hand-cards">
            {playerHand.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </div>
        </section>
        <details className="strategy-guides">
          <summary>戦略・ログ</summary>
          <div className="strategy-guides-content">
            <BattleLog entries={battleLog} />
            <CounterGuide />
            <ComboGuide playerFaction={playerFaction} />
            <WinProgress cpuHealth={cpuHealth} cpuStatuses={cpuStatuses} cpuFaction={cpuFaction} />
          </div>
        </details>
      </section>
    </section>
  )
}
