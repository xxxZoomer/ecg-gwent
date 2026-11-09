import cards from './data/cards.json'
import type {
  BattleFaction,
  BattleLogEntry,
  BattleStatus,
  CardRole,
  ECGCard,
  GameState,
  PlayerSide,
} from './game/types'

export type {
  BattleFaction,
  BattleLogEntry,
  BattleStatus,
  CardRole,
  ECGCard,
  GameState,
  MatchResult,
  PlayerSide,
  StatusKind,
} from './game/types'

export const battleFactions: {
  id: BattleFaction
  name: string
  ability: string
  description: string
}[] = [
  { id: 'ARRHYTHMIA', name: '不整脈軍', ability: 'AFの手札妨害を強化', description: 'AFで相手の手札を2枚捨てさせる。' },
  { id: 'ELECTROLYTE', name: '電解質軍', ability: '高Kコンボ', description: '高Kを重ねるとVFまでのカウントを1短縮。' },
  { id: 'ISCHEMIA', name: '虚血軍', ability: '即時ダメージ強化', description: '虚血カード使用時、追加で1ダメージ。' },
  { id: 'HEART FAILURE', name: '心不全軍', ability: '毎ターン自己回復', description: '自分のターン開始時に1 HP回復。' },
]

export const DECK_SIZE = 20
export const MIN_DECK_SIZE = 5
export const STARTER_CARD_IDS = ['afib', 'vtach', 'stemi', 'hyperkalemia', 'aed']
export const DEFAULT_DECK_IDS = STARTER_CARD_IDS

const INITIAL_HEALTH = 30
const MAX_HEALTH = 30
const MAX_HAND_SIZE = 12
const MAX_BOARD_CARDS = 22
const MAX_BATTLE_LOG_ENTRIES = 10
export const MAX_MULLIGAN_EXCHANGES = 3

export const cardCatalog: ECGCard[] = cards

const cardEffects: Record<string, string> = {
  afib: 'AF · 混乱。相手の手札を1枚ランダムに捨てさせる（不整脈軍は2枚）',
  ablation: 'COUNTER · 自分のAFを解除し、2 HP回復',
  flutter: 'AFL · 毎ターン1ダメージ',
  torsades: 'TdP · QT延長中の相手には即時4ダメージ、それ以外には2ダメージ。さらに毎ターン4ダメージを2ターン継続',
  sss: '洞機能不全 · 1ダメージを2ターン継続',
  mobitz1: 'Mobitz I · 1ダメージを2ターン継続',
  mobitz2: 'Mobitz II · 2ダメージを2ターン継続',
  junctional: '接合部調律 · 1ダメージを2ターン継続',
  psvt: '不整脈軍 · 2ダメージを2ターン継続',
  vtach: 'VT · 毎ターン3ダメージ',
  amiodarone: 'COUNTER · 自分のVTを解除し、2 HP回復',
  vfib: 'VF · 付与時4ダメージ + 毎ターン4ダメージを2ターン。AEDで解除',
  hyperkalemia: '高K · 2ターン後にVF',
  hypokalemia: '電解質軍 · 2ダメージを2ターン継続',
  'insulin-glucose': 'カウンター · 自分の高K状態を解除し、2 HP回復',
  'calcium-gluconate': 'カウンター · 高Kを解除して2 HP回復。高Kによる次のVFも防ぐ',
  'potassium-replacement': 'カウンター · 自分の低K状態を解除し、2 HP回復',
  stemi: '虚血軍 · 3ダメージ + 虚血2ダメージを3ターン',
  nstemi: '虚血軍 · 虚血1ダメージを3ターン（重ね掛け可）',
  wellens: 'Wellens · 虚血2ダメージを2ターン継続（再灌流で解除）',
  prinzmetal: '冠攣縮 · 即時2ダメージ + 虚血2ダメージを2ターン継続',
  'old-mi': '陳旧性心筋梗塞 · 1ダメージを3ターン継続',
  shock: '心原性ショック · 即時2ダメージ + 毎ターン3ダメージを2ターン継続',
  hypercalcemia: '高Ca · 即時3ダメージ',
  hypocalcemia: '低Ca · QT延長を付与し、2ダメージを2ターン継続',
  revascularization: 'カウンター · 自分の虚血を解除し、3 HP回復',
  'heart-failure': '心不全軍 · 心不全ダメージを付与（重ね掛け可）',
  'diuretic-therapy': 'カウンター · 自分の心不全を解除し、3 HP回復',
  aed: 'カウンター · 自分のVFを解除し、4 HP回復',
  wpw: '不整脈軍 · 3ダメージを2ターン継続',
  brugada: '不整脈軍 · 3ダメージ',
  rbbb: '不整脈軍 · 1ダメージを2ターン継続',
  lbbb: '不整脈軍 · 1ダメージを2ターン継続',
  'complete-av-block': '不整脈軍 · 2ダメージを2ターン継続',
  'long-qt': '不整脈軍 · 2ダメージを2ターン継続',
}

const cardRoles: Record<string, CardRole> = {
  afib: 'CONTROL',
  ablation: 'COUNTER',
  flutter: 'ATTACK',
  torsades: 'ATTACK',
  sss: 'ATTACK',
  mobitz1: 'ATTACK',
  mobitz2: 'ATTACK',
  junctional: 'ATTACK',
  psvt: 'ATTACK',
  vtach: 'ATTACK',
  amiodarone: 'COUNTER',
  vfib: 'CONTROL',
  hyperkalemia: 'COMBO',
  hypokalemia: 'ATTACK',
  'insulin-glucose': 'COUNTER',
  'calcium-gluconate': 'COUNTER',
  'potassium-replacement': 'COUNTER',
  stemi: 'ATTACK',
  nstemi: 'ATTACK',
  wellens: 'ATTACK',
  prinzmetal: 'ATTACK',
  'old-mi': 'ATTACK',
  shock: 'ATTACK',
  hypercalcemia: 'ATTACK',
  hypocalcemia: 'ATTACK',
  revascularization: 'HEAL',
  'heart-failure': 'CONTROL',
  'diuretic-therapy': 'HEAL',
  aed: 'COUNTER',
  wpw: 'ATTACK',
  brugada: 'ATTACK',
  rbbb: 'ATTACK',
  lbbb: 'ATTACK',
  'complete-av-block': 'CONTROL',
  'long-qt': 'ATTACK',
}

export function getDeckCategoryCounts(deck: ECGCard[]): {
  attack: number
  treatment: number
  support: number
} {
  return deck.reduce((counts, card) => {
    const role = getCardRole(card)
    if (role === 'ATTACK') counts.attack += 1
    else if (role === 'HEAL' || role === 'COUNTER') counts.treatment += 1
    else counts.support += 1
    return counts
  }, { attack: 0, treatment: 0, support: 0 })
}

export function getDeckDiagnosis(deck: ECGCard[]): string {
  const counts = getDeckCategoryCounts(deck)
  const warnings = [
    counts.attack < 10 && '攻撃カードが不足しています',
    counts.treatment < 5 && '治療カードが不足しています',
    counts.support < 5 && '補助カードが不足しています',
  ].filter(Boolean)
  return warnings.length ? warnings.join('。') : '推奨バランスです'
}

export function getCardRole(card: ECGCard): CardRole {
  return cardRoles[card.id] ?? 'ATTACK'
}

export function getCardEffect(card: ECGCard): string {
  return cardEffects[card.id] ?? '直接ダメージ'
}

export function getCardImpact(card: ECGCard): string {
  const impacts: Record<string, string> = {
    afib: '手札1枚破壊',
    ablation: 'AF解除 + 2回復',
    flutter: '継続1ダメージ',
    torsades: '即時2/4 + 継続4ダメージ',
    sss: '継続1ダメージ',
    mobitz1: '継続1ダメージ',
    mobitz2: '継続2ダメージ',
    junctional: '継続1ダメージ',
    psvt: '継続2ダメージ',
    vtach: '継続3ダメージ',
    amiodarone: 'VT解除 + 2回復',
    vfib: '即時4 + 継続4ダメージ',
    hyperkalemia: 'VF発症まで2ターン',
    hypokalemia: '継続2ダメージ',
    'insulin-glucose': '高K解除 + 2回復',
    'calcium-gluconate': '高K解除 + 2回復',
    'potassium-replacement': '低K解除 + 2回復',
    stemi: '即時3 + 継続2ダメージ',
    nstemi: '継続1ダメージ',
    wellens: '継続2ダメージ',
    prinzmetal: '即時2 + 継続2ダメージ',
    'old-mi': '継続1ダメージ',
    shock: '即時2 + 継続3ダメージ',
    hypercalcemia: '即時3ダメージ',
    hypocalcemia: '継続2ダメージ',
    revascularization: '虚血解除 + 3回復',
    'heart-failure': '継続1ダメージ',
    'diuretic-therapy': '心不全解除 + 3回復',
    aed: 'VF解除 + 4回復',
    wpw: '継続3ダメージ',
    brugada: '即時3ダメージ',
    rbbb: '継続1ダメージ',
    lbbb: '継続1ダメージ',
    'complete-av-block': '継続2ダメージ',
    'long-qt': '継続2ダメージ',
  }
  return impacts[card.id] ?? getCardEffect(card)
}

export function getBattleCardLabel(card: ECGCard): string {
  const labels: Record<string, string> = {
    afib: 'AF',
    ablation: 'アブレーション',
    flutter: 'AFL',
    torsades: 'TdP',
    sss: '洞不全',
    mobitz1: 'Mobitz I',
    mobitz2: 'Mobitz II',
    junctional: '接合部調律',
    psvt: 'PSVT',
    vtach: 'VT',
    amiodarone: 'アミオダロン',
    vfib: 'VF',
    hyperkalemia: '高K',
    hypokalemia: '低K',
    stemi: 'STEMI',
    nstemi: 'NSTEMI',
    wellens: 'Wellens',
    prinzmetal: '冠攣縮',
    'old-mi': '陳旧性MI',
    shock: '心原性ショック',
    hypercalcemia: '高Ca',
    hypocalcemia: '低Ca',
    aed: 'AED',
    'insulin-glucose': 'インスリン＋ブドウ糖',
    'calcium-gluconate': 'カルシウム製剤',
    'potassium-replacement': 'K補充',
    revascularization: '再灌流',
    'diuretic-therapy': '利尿療法',
    'heart-failure': '心不全',
    wpw: 'WPW',
    brugada: 'Brugada',
    rbbb: 'RBBB',
    lbbb: 'LBBB',
    'complete-av-block': '完全房室ブロック',
    'long-qt': 'QT延長',
  }
  return labels[card.id] ?? card.name
}

export function isCardPlayable(state: GameState, side: PlayerSide, card: ECGCard): boolean {
  if (state.turn !== side) return false
  const statuses = side === 'player' ? state.playerStatuses : state.cpuStatuses
  const isStunned = statuses.some((status) => status.kind === 'stun')
  if (card.id === 'aed') return isStunned
  if (isStunned) return false
  const requiredStatus: Record<string, string> = {
    ablation: 'atrial-fibrillation',
    amiodarone: 'ventricular-tachycardia',
    'insulin-glucose': 'hyperkalemia',
    'potassium-replacement': 'hypokalemia',
    revascularization: 'ischemia',
    'diuretic-therapy': 'heart-failure',
  }
  const statusId = requiredStatus[card.id]
  return !statusId || statuses.some((status) => status.id === statusId)
}

function shuffle(deck: ECGCard[]): ECGCard[] {
  const shuffled = [...deck]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}

function createCpuDeck(faction: BattleFaction): ECGCard[] {
  const excludedByFaction: Record<BattleFaction, string[]> = {
    ARRHYTHMIA: ['stemi', 'nstemi', 'hyperkalemia', 'hypokalemia'],
    ELECTROLYTE: ['stemi', 'nstemi', 'heart-failure', 'diuretic-therapy'],
    ISCHEMIA: ['hyperkalemia', 'hypokalemia', 'heart-failure', 'diuretic-therapy'],
    'HEART FAILURE': ['stemi', 'nstemi', 'hyperkalemia', 'hypokalemia'],
  }
  return shuffle(cardCatalog.filter((card) => !excludedByFaction[faction].includes(card.id)))
}

const defaultPlayerDeck = DEFAULT_DECK_IDS
  .map((id) => cardCatalog.find((card) => card.id === id))
  .filter((card): card is ECGCard => card !== undefined)

export function createGame(
  playerFaction: BattleFaction = 'ARRHYTHMIA',
  playerDeckCards: ECGCard[] = defaultPlayerDeck,
): GameState {
  if (
    playerDeckCards.length < MIN_DECK_SIZE
    || playerDeckCards.length > DECK_SIZE
    || new Set(playerDeckCards.map((card) => card.id)).size !== playerDeckCards.length
  ) {
    throw new Error(`Player deck must contain ${MIN_DECK_SIZE}-${DECK_SIZE} unique cards.`)
  }
  const availableCpuFactions = battleFactions.filter((faction) => faction.id !== playerFaction)
  const cpuFaction = availableCpuFactions[Math.floor(Math.random() * availableCpuFactions.length)].id
  const playerDeck = shuffle(playerDeckCards)
  const cpuDeck = createCpuDeck(cpuFaction)
  return {
    playerFaction,
    cpuFaction,
    turnNumber: 1,
    battleLog: [],
    playerHand: playerDeck.slice(0, Math.min(9, playerDeck.length)),
    cpuHand: cpuDeck.slice(0, 9),
    playerDeck: playerDeck.slice(9),
    cpuDeck: cpuDeck.slice(9),
    playerDiscard: [],
    cpuDiscard: [],
    playerBoard: [],
    cpuBoard: [],
    playerHealth: INITIAL_HEALTH,
    cpuHealth: INITIAL_HEALTH,
    playerStatuses: [],
    cpuStatuses: [],
    turn: 'player',
    result: null,
    message: '相手のHPを0にすると勝利。',
  }
}

export function exchangeMulliganCards(state: GameState, cardIds: string[]): GameState {
  if (state.turn !== 'player' || cardIds.length === 0 || state.playerDeck.length === 0) return state

  const selectedIds = new Set(cardIds)
  const cardsToExchange = state.playerHand.filter((card) => selectedIds.has(card.id))
  const exchangeCount = Math.min(cardsToExchange.length, state.playerDeck.length)
  if (exchangeCount === 0) return state

  const exchangedCards = cardsToExchange.slice(0, exchangeCount)
  const exchangedIds = new Set(exchangedCards.map((card) => card.id))
  const shuffledDeck = shuffle(state.playerDeck)
  const replacementCards = shuffledDeck.slice(0, exchangeCount)
  const remainingDeck = shuffledDeck.slice(exchangeCount)
  let replacementIndex = 0
  const playerHand = state.playerHand.map((card) => (
    exchangedIds.has(card.id) ? replacementCards[replacementIndex++] : card
  ))
  return {
    ...state,
    playerHand,
    playerDeck: shuffle([...remainingDeck, ...exchangedCards]),
  }
}

function finishIfDefeated(state: GameState): GameState {
  if (state.playerHealth <= 0 && state.cpuHealth <= 0) {
    return { ...state, playerHealth: 0, cpuHealth: 0, turn: 'finished', result: 'defeat', message: '相打ち！今回は敗北です。' }
  }
  if (state.cpuHealth <= 0) {
    return { ...state, cpuHealth: 0, turn: 'finished', result: 'victory', message: '相手を撃破した！' }
  }
  if (state.playerHealth <= 0) {
    return { ...state, playerHealth: 0, turn: 'finished', result: 'defeat', message: 'あなたは力尽きた……' }
  }
  return state
}

function appendBattleLog(
  before: GameState,
  after: GameState,
  actor: PlayerSide,
  title: string,
  cardName?: string,
): GameState {
  const details: string[] = []
  if (cardName) details.push(`${actor === 'player' ? 'Player' : 'CPU'}が${cardName}を使用`)

  for (const side of ['player', 'cpu'] as const) {
    const sideName = side === 'player' ? 'プレイヤー' : 'CPU'
    const beforeStatuses = before[side === 'player' ? 'playerStatuses' : 'cpuStatuses']
    const afterStatuses = after[side === 'player' ? 'playerStatuses' : 'cpuStatuses']
    const beforeIds = new Set(beforeStatuses.map((status) => status.id))
    const afterIds = new Set(afterStatuses.map((status) => status.id))

    for (const status of afterStatuses) {
      const duration = status.turnsRemaining === Infinity ? '解除まで継続' : `残り${status.turnsRemaining}ターン`
      const effect = [
        status.damageAtTurnStart > 0 && `ターン開始時${status.damageAtTurnStart}ダメージ`,
        status.damageAtTurnEnd > 0 && `ターン終了時${status.damageAtTurnEnd}ダメージ`,
        status.kind === 'stun' && '行動不能',
        status.kind === 'countdown' && `VF発症まで${status.turnsRemaining}ターン`,
      ].filter(Boolean).join('・')
      if (!beforeIds.has(status.id)) {
        details.push(`${sideName}に状態異常付与：${status.label} · ${effect || status.kind} · ${duration}`)
      }
      else {
        const previous = beforeStatuses.find((candidate) => candidate.id === status.id)
        if (previous && previous.turnsRemaining !== status.turnsRemaining && status.turnsRemaining !== Infinity) {
          details.push(`${sideName}の${status.label}：残り${status.turnsRemaining}ターン`)
        }
      }
    }
    for (const status of beforeStatuses) {
      if (!afterIds.has(status.id)) details.push(`${sideName}の状態異常解除：${status.label}`)
    }

    const healthKey = side === 'player' ? 'playerHealth' : 'cpuHealth'
    const previousHealth = before[healthKey]
    const currentHealth = after[healthKey]
    const difference = currentHealth - previousHealth
    if (difference < 0) {
      const damageStatuses = beforeStatuses.filter((status) => status.damageAtTurnStart > 0 || status.damageAtTurnEnd > 0)
      const causes = damageStatuses.map((status) => status.label).join('、')
      const reason = cardName ? `カード効果（${cardName}）` : causes ? `継続効果（${causes}）` : '効果'
      details.push(`${reason}で${sideName}に${Math.abs(difference)}ダメージ（HP ${previousHealth} → ${currentHealth}）`)
    }
    if (difference > 0) details.push(`${sideName}が${difference}回復（HP ${previousHealth} → ${currentHealth}）`)
  }

  const handKey = actor === 'player' ? 'playerHand' : 'cpuHand'
  const priorHandIds = new Set(before[handKey].map((card) => card.id))
  const drawnCards = after[handKey].filter((card) => !priorHandIds.has(card.id))
  if (drawnCards.length) details.push(`${actor === 'player' ? 'プレイヤー' : 'CPU'}がドロー：${drawnCards.map((card) => card.name).join('、')}`)

  for (const side of ['player', 'cpu'] as const) {
    const discardKey = side === 'player' ? 'playerDiscard' : 'cpuDiscard'
    const discardedCards = after[discardKey].slice(before[discardKey].length)
    if (discardedCards.length) {
      details.push(`${side === 'player' ? 'プレイヤー' : 'CPU'}が捨て札：${discardedCards.map((card) => card.name).join('、')}`)
    }
  }

  const id = (before.battleLog[before.battleLog.length - 1]?.id ?? 0) + 1
  const entry: BattleLogEntry = { id, turn: before.turnNumber, actor, title, details }
  return { ...after, battleLog: [...after.battleLog, entry].slice(-MAX_BATTLE_LOG_ENTRIES) }
}

function addOrStackStatus(
  statuses: BattleStatus[],
  status: BattleStatus,
  maxDamage = 8,
): BattleStatus[] {
  const existing = statuses.find((candidate) => candidate.id === status.id)
  if (!existing) return [...statuses, status]
  return statuses.map((candidate) => candidate.id === status.id
    ? {
      ...status,
      damageAtTurnStart: Math.min(maxDamage, candidate.damageAtTurnStart + status.damageAtTurnStart),
      damageAtTurnEnd: Math.min(maxDamage, candidate.damageAtTurnEnd + status.damageAtTurnEnd),
      turnsRemaining: Math.max(candidate.turnsRemaining, status.turnsRemaining),
    }
    : candidate)
}

function addStatus(state: GameState, side: PlayerSide, status: BattleStatus, maxDamage = 8): GameState {
  const key = side === 'player' ? 'playerStatuses' : 'cpuStatuses'
  return { ...state, [key]: addOrStackStatus(state[key], status, maxDamage) }
}

function removeStatuses(state: GameState, side: PlayerSide, ids: string[]): GameState {
  const key = side === 'player' ? 'playerStatuses' : 'cpuStatuses'
  return { ...state, [key]: state[key].filter((status) => !ids.includes(status.id)) }
}

function removeStatusesAndHeal(state: GameState, side: PlayerSide, ids: string[], amount: number): GameState {
  const statuses = state[side === 'player' ? 'playerStatuses' : 'cpuStatuses']
  const removed = statuses.some((status) => ids.includes(status.id))
  const cleared = removeStatuses(state, side, ids)
  return removed ? heal(cleared, side, amount) : cleared
}

function dealDamage(state: GameState, side: PlayerSide, damage: number): GameState {
  const key = side === 'player' ? 'playerHealth' : 'cpuHealth'
  return { ...state, [key]: state[key] - damage }
}

function heal(state: GameState, side: PlayerSide, amount: number): GameState {
  const key = side === 'player' ? 'playerHealth' : 'cpuHealth'
  return { ...state, [key]: Math.min(MAX_HEALTH, state[key] + amount) }
}

function addDamageStatus(
  state: GameState,
  target: PlayerSide,
  id: string,
  label: string,
  damage: number,
  turns: number,
  maxDamage = 8,
  damageOnApply = 0,
  damageAtTurnEnd = 0,
): GameState {
  let next = state
  if (damageOnApply > 0) next = dealDamage(next, target, damageOnApply)
  return addStatus(next, target, {
    id,
    label,
    turnsRemaining: turns,
    damageAtTurnStart: damage,
    damageAtTurnEnd,
    kind: 'damage',
  }, maxDamage)
}

function addVf(state: GameState, target: PlayerSide, fromHyperkalemia = true): GameState {
  const shieldIndex = state[target === 'player' ? 'playerStatuses' : 'cpuStatuses']
    .findIndex((status) => status.id === 'membrane-stabilized')
  if (fromHyperkalemia && shieldIndex >= 0) {
    const key = target === 'player' ? 'playerStatuses' : 'cpuStatuses'
    return {
      ...state,
      [key]: state[key].filter((status) => status.id !== 'membrane-stabilized'),
      message: 'カルシウムが高KによるVFを防いだ。',
    }
  }
  const withDamage = addDamageStatus(state, target, 'vf-complication', 'VF · 致死性不整脈', 4, 2, 8, 4)
  return addStatus(withDamage, target, {
    id: 'ventricular-fibrillation',
    label: 'VF',
    turnsRemaining: 1,
    damageAtTurnStart: 0,
    damageAtTurnEnd: 0,
    kind: 'stun',
  })
}

function applySupportCard(state: GameState, actor: PlayerSide, card: ECGCard): GameState {
  switch (card.id) {
    case 'ablation':
      return removeStatusesAndHeal(state, actor, ['atrial-fibrillation'], 2)
    case 'amiodarone':
      return removeStatusesAndHeal(state, actor, ['ventricular-tachycardia'], 2)
    case 'aed':
      return removeStatusesAndHeal(state, actor, ['ventricular-fibrillation', 'vf-complication'], 4)
    case 'insulin-glucose':
      return removeStatusesAndHeal(state, actor, ['hyperkalemia'], 2)
    case 'calcium-gluconate': {
      const cleared = removeStatusesAndHeal(state, actor, ['hyperkalemia'], 2)
      return addStatus(cleared, actor, {
        id: 'membrane-stabilized',
        label: '心筋膜を一時安定化',
        turnsRemaining: Infinity,
        damageAtTurnStart: 0,
        damageAtTurnEnd: 0,
        kind: 'ward',
      })
    }
    case 'potassium-replacement':
      return removeStatusesAndHeal(state, actor, ['hypokalemia'], 2)
    case 'revascularization':
      return removeStatusesAndHeal(state, actor, ['ischemia'], 3)
    case 'diuretic-therapy':
      return removeStatusesAndHeal(state, actor, ['heart-failure'], 3)
    default:
      return state
  }
}

function applyCardEffect(state: GameState, actor: PlayerSide, card: ECGCard): GameState {
  const target: PlayerSide = actor === 'player' ? 'cpu' : 'player'
  const targetHandKey = target === 'player' ? 'playerHand' : 'cpuHand'
  let next = state

  if (['aed', 'ablation', 'amiodarone', 'insulin-glucose', 'calcium-gluconate', 'potassium-replacement', 'revascularization', 'diuretic-therapy'].includes(card.id)) {
    next = applySupportCard(next, actor, card)
  } else {
    switch (card.id) {
      case 'afib': {
        const targetHand = next[targetHandKey]
        const targetDiscardKey = target === 'player' ? 'playerDiscard' : 'cpuDiscard'
        const discardCount = state[actor === 'player' ? 'playerFaction' : 'cpuFaction'] === 'ARRHYTHMIA' ? 2 : 1
        let remainingHand = targetHand
        for (let count = 0; count < discardCount && remainingHand.length > 0; count += 1) {
          const discarded = Math.floor(Math.random() * remainingHand.length)
          remainingHand = remainingHand.filter((_, index) => index !== discarded)
        }
        if (remainingHand.length !== targetHand.length) {
          const discardedCards = targetHand.filter((card) => !remainingHand.some((remaining) => remaining.id === card.id))
          next = {
            ...next,
            [targetHandKey]: remainingHand,
            [targetDiscardKey]: [...next[targetDiscardKey], ...discardedCards],
          }
        }
        next = addStatus(next, target, {
          id: 'atrial-fibrillation',
          label: 'AF · 混乱',
          turnsRemaining: 2,
          damageAtTurnStart: 0,
          damageAtTurnEnd: 0,
          kind: 'confusion',
        })
        break
      }
      case 'flutter':
        next = addDamageStatus(next, target, 'atrial-flutter', 'AFL', 1, 2, 1)
        break
      case 'torsades': {
        const statusesKey = target === 'player' ? 'playerStatuses' : 'cpuStatuses'
        const hasProlongedQt = next[statusesKey].some((status) => status.id === 'long-qt')
        next = addDamageStatus(next, target, 'torsades', 'TdP', 4, 2, 8, hasProlongedQt ? 4 : 2)
        break
      }
      case 'sss':
        next = addDamageStatus(next, target, 'sick-sinus-syndrome', '洞機能不全', 1, 2, 2)
        break
      case 'mobitz1':
        next = addDamageStatus(next, target, 'mobitz-i', 'Mobitz I', 1, 2, 2)
        break
      case 'mobitz2':
        next = addDamageStatus(next, target, 'mobitz-ii', 'Mobitz II', 2, 2, 4)
        break
      case 'junctional':
        next = addDamageStatus(next, target, 'junctional-rhythm', '接合部調律', 1, 2, 2)
        break
      case 'psvt':
        next = addDamageStatus(next, target, 'psvt', 'PSVT', 2, 2, 4)
        break
      case 'vtach':
        next = addDamageStatus(next, target, 'ventricular-tachycardia', 'VT', 3, 2, 3)
        break
      case 'vfib':
        next = addVf(next, target, false)
        break
      case 'hyperkalemia': {
        const statusesKey = target === 'player' ? 'playerStatuses' : 'cpuStatuses'
        const existingHyperkalemia = next[statusesKey].find((status) => status.id === 'hyperkalemia')
        if (!existingHyperkalemia) {
          next = addStatus(next, target, {
            id: 'hyperkalemia',
            label: '高K',
            turnsRemaining: 2,
            damageAtTurnStart: 0,
            damageAtTurnEnd: 0,
            kind: 'countdown',
          })
        } else if (state[actor === 'player' ? 'playerFaction' : 'cpuFaction'] === 'ELECTROLYTE') {
          if (existingHyperkalemia.turnsRemaining <= 1) {
            next = removeStatuses(next, target, ['hyperkalemia'])
            next = addVf(next, target)
          } else {
            next = {
              ...next,
              [statusesKey]: next[statusesKey].map((status) => status.id === 'hyperkalemia'
                ? { ...status, turnsRemaining: status.turnsRemaining - 1 }
                : status),
            }
          }
        }
        break
      }
      case 'hypokalemia':
        next = addDamageStatus(next, target, 'hypokalemia', '低K', 2, 2, 4)
        break
      case 'stemi':
        next = dealDamage(next, target, 3 + (state[actor === 'player' ? 'playerFaction' : 'cpuFaction'] === 'ISCHEMIA' ? 1 : 0))
        next = addDamageStatus(next, target, 'ischemia', 'STEMI · 虚血', 2, 3, 8)
        break
      case 'nstemi':
        if (state[actor === 'player' ? 'playerFaction' : 'cpuFaction'] === 'ISCHEMIA') next = dealDamage(next, target, 1)
        next = addDamageStatus(next, target, 'ischemia', '虚血', 1, 3, 8)
        break
      case 'wellens':
        next = addDamageStatus(next, target, 'ischemia', 'Wellens · 虚血', 2, 2, 8)
        break
      case 'prinzmetal':
        next = dealDamage(next, target, 2)
        next = addDamageStatus(next, target, 'ischemia', '冠攣縮 · 虚血', 2, 2, 8)
        break
      case 'old-mi':
        next = addDamageStatus(next, target, 'old-mi', '陳旧性心筋梗塞', 1, 3, 3)
        break
      case 'shock':
        next = addDamageStatus(next, target, 'cardiogenic-shock', '心原性ショック', 3, 2, 6, 2)
        break
      case 'hypercalcemia':
        next = dealDamage(next, target, 3)
        break
      case 'hypocalcemia':
        next = addDamageStatus(next, target, 'long-qt', 'QT延長 · 低Ca', 2, 2, 4)
        break
      case 'heart-failure':
        next = addDamageStatus(next, target, 'heart-failure', '心不全 · ドロー阻害', 1, 3, 3)
        break
      case 'wpw':
        next = addDamageStatus(next, target, 'wpw', 'WPW', 3, 2, 6)
        break
      case 'brugada':
        next = dealDamage(next, target, 3)
        break
      case 'rbbb':
      case 'lbbb':
        next = addDamageStatus(next, target, `bundle-${card.id}`, '脚ブロック', 1, 2, 2)
        break
      case 'complete-av-block':
        next = addDamageStatus(next, target, 'complete-av-block', '完全房室ブロック', 2, 2, 4)
        break
      case 'long-qt':
        next = addDamageStatus(next, target, 'long-qt', 'QT延長', 2, 2, 4)
        break
      default:
        next = dealDamage(next, target, Math.max(1, Math.round(card.power / 3)))
    }
  }

  const actorName = actor === 'player' ? 'あなた' : 'CPU'
  const support = ['aed', 'ablation', 'amiodarone', 'insulin-glucose', 'calcium-gluconate', 'potassium-replacement', 'revascularization', 'diuretic-therapy'].includes(card.id)
  return finishIfDefeated({
    ...next,
    message: `${actorName}が${card.name}を使用。${support ? '治療・カウンターを発動。' : getCardEffect(card)}。`,
  })
}

function startTurn(state: GameState, side: PlayerSide): { state: GameState; stunned: boolean } {
  const statusesKey = side === 'player' ? 'playerStatuses' : 'cpuStatuses'
  const healthKey = side === 'player' ? 'playerHealth' : 'cpuHealth'
  const handKey = side === 'player' ? 'playerHand' : 'cpuHand'
  const deckKey = side === 'player' ? 'playerDeck' : 'cpuDeck'
  const statuses = state[statusesKey]
  const damage = statuses.reduce((total, status) => total + status.damageAtTurnStart, 0)
  const heartFailure = statuses.some((status) => status.id === 'heart-failure')
  let hyperkalemiaTriggered = false
  let next: GameState = {
    ...state,
    [healthKey]: state[healthKey] - damage,
    [statusesKey]: statuses.flatMap((status) => {
      if (status.id === 'hyperkalemia') {
        if (status.turnsRemaining <= 1) {
          hyperkalemiaTriggered = true
          return []
        }
        return [{ ...status, turnsRemaining: status.turnsRemaining - 1 }]
      }
      if (status.kind === 'stun' || status.turnsRemaining === Infinity) return [status]
      if (status.turnsRemaining <= 1) return []
      return [{ ...status, turnsRemaining: status.turnsRemaining - 1 }]
    }),
  }
  const faction = state[side === 'player' ? 'playerFaction' : 'cpuFaction']
  if (faction === 'HEART FAILURE') next = heal(next, side, 1)
  if (hyperkalemiaTriggered) next = addVf(next, side)
  const stunned = next[statusesKey].some((status) => status.kind === 'stun')
  const vfTriggered = hyperkalemiaTriggered && stunned
  next = finishIfDefeated(next)
  if (next.turn === 'finished') {
    return { state: appendBattleLog(state, next, side, `${side === 'player' ? 'プレイヤー' : 'CPU'}のターン開始`), stunned }
  }

  const hand = next[handKey]
  const deck = next[deckKey]
  let drawMessage: string
  if (heartFailure) {
    drawMessage = '心不全のドロー阻害中。'
  } else if (hand.length >= MAX_HAND_SIZE) {
    drawMessage = '手札上限のためドローなし。'
  } else if (deck.length === 0) {
    drawMessage = '山札が空でドローできない。'
  } else {
    const [drawn, ...remainingDeck] = deck
    if (drawn) {
      next = { ...next, [handKey]: [...hand, drawn], [deckKey]: remainingDeck }
      drawMessage = '1枚ドロー。'
    } else {
      drawMessage = '山札が空でドローできない。'
    }
  }

  const sideName = side === 'player' ? 'あなた' : 'CPU'
  const started = {
    ...next,
    turn: side,
    message: `${sideName}のターン開始。${drawMessage}${faction === 'HEART FAILURE' ? '心不全軍の能力で1 HP回復。' : ''}${damage ? `持続効果で${damage}ダメージ。` : ''}${hyperkalemiaTriggered ? (vfTriggered ? '高Kのカウントが終了し、VFが発生。' : 'カルシウムが高KによるVFを防いだ。') : ''}${heartFailure ? '心不全のドロー阻害中。' : ''}${stunned ? 'VFで行動不能。AEDで解除。' : ''}`,
  } satisfies GameState
  return {
    state: appendBattleLog(state, started, side, `${sideName}のターン開始`),
    stunned,
  }
}

function finishTurn(state: GameState, side: PlayerSide): GameState {
  if (state.turn === 'finished') return state
  const statusesKey = side === 'player' ? 'playerStatuses' : 'cpuStatuses'
  const remainingStatuses = state[statusesKey].flatMap((status) => (
    status.kind === 'stun' && status.turnsRemaining !== Infinity
      ? status.turnsRemaining <= 1 ? [] : [{ ...status, turnsRemaining: status.turnsRemaining - 1 }]
      : [status]
  ))
  const withUpdatedStatuses = { ...state, [statusesKey]: remainingStatuses }
  const statuses = state[side === 'player' ? 'playerStatuses' : 'cpuStatuses']
  const damage = statuses.reduce((total, status) => total + status.damageAtTurnEnd, 0)
  return finishIfDefeated(damage === 0 ? withUpdatedStatuses : dealDamage(withUpdatedStatuses, side, damage))
}

function useCard(state: GameState, side: PlayerSide, card: ECGCard): GameState {
  const handKey = side === 'player' ? 'playerHand' : 'cpuHand'
  const boardKey = side === 'player' ? 'playerBoard' : 'cpuBoard'
  const hand = state[handKey].filter((candidate) => candidate.id !== card.id)
  const board = [...state[boardKey], card].slice(-MAX_BOARD_CARDS)
  const next = {
    ...state,
    [handKey]: hand,
    [boardKey]: board,
    turn: side === 'player' ? 'cpu' as const : 'player' as const,
  }
  const result = finishTurn(applyCardEffect(next, side, card), side)
  return appendBattleLog(state, result, side, `${side === 'player' ? 'Player' : 'CPU'}: ${getBattleCardLabel(card)}を使用`, getBattleCardLabel(card))
}

export function playCard(state: GameState, cardId: string): GameState {
  if (state.turn !== 'player') return state
  const card = state.playerHand.find((candidate) => candidate.id === cardId)
  if (!card || !isCardPlayable(state, 'player', card)) return state
  return useCard(state, 'player', card)
}

export function passTurn(state: GameState): GameState {
  if (state.turn !== 'player') return state
  const stunned = state.playerStatuses.some((status) => status.kind === 'stun')
  const result = finishTurn({
    ...state,
    turn: 'cpu',
    message: stunned ? 'VFで行動できず、ターンを終了した。AEDで解除できる。' : 'カードを温存してターンを終了した。',
  }, 'player')
  return appendBattleLog(state, result, 'player', stunned ? 'Player: VFで行動不能・ターン終了' : 'Player: ターン終了')
}

function chooseCpuCard(state: GameState): ECGCard | undefined {
  const cpuHand = state.cpuHand
  if (state.cpuStatuses.some((status) => status.kind === 'stun')) {
    return cpuHand.find((card) => card.id === 'aed')
  }
  if (state.cpuStatuses.some((status) => status.id === 'atrial-fibrillation')) {
    const ablation = cpuHand.find((card) => card.id === 'ablation')
    if (ablation) return ablation
  }
  if (state.cpuStatuses.some((status) => status.id === 'ventricular-tachycardia')) {
    const amiodarone = cpuHand.find((card) => card.id === 'amiodarone')
    if (amiodarone) return amiodarone
  }
  if (state.cpuStatuses.some((status) => status.id === 'hyperkalemia')) {
    const calcium = cpuHand.find((card) => card.id === 'calcium-gluconate')
    if (calcium) return calcium
    const counter = cpuHand.find((card) => card.id === 'insulin-glucose')
    if (counter) return counter
  }
  if (state.cpuStatuses.some((status) => status.id === 'ventricular-fibrillation')) {
    const aed = cpuHand.find((card) => card.id === 'aed')
    if (aed) return aed
  }
  if (state.cpuStatuses.some((status) => status.id === 'heart-failure')) {
    const diuretic = cpuHand.find((card) => card.id === 'diuretic-therapy')
    if (diuretic) return diuretic
  }
  if (state.cpuStatuses.some((status) => status.id === 'ischemia')) {
    const revascularization = cpuHand.find((card) => card.id === 'revascularization')
    if (revascularization) return revascularization
  }
  if (state.cpuStatuses.some((status) => status.id === 'hypokalemia')) {
    const potassium = cpuHand.find((card) => card.id === 'potassium-replacement')
    if (potassium) return potassium
  }
  if (!state.playerStatuses.some((status) => status.id === 'hyperkalemia' || status.id === 'ventricular-fibrillation')) {
    const hyperkalemia = cpuHand.find((card) => card.id === 'hyperkalemia')
    if (hyperkalemia) return hyperkalemia
  }
  return [...cpuHand].sort((first, second) => second.power - first.power)[0]
}

function beginPlayerTurn(state: GameState): GameState {
  const playerStart = startTurn({ ...state, turnNumber: state.turnNumber + 1 }, 'player')
  return playerStart.state.turn === 'finished'
    ? playerStart.state
    : { ...playerStart.state, turn: 'player' }
}

export function takeCpuTurn(state: GameState): GameState {
  if (state.turn !== 'cpu') return state

  const cpuStart = startTurn(state, 'cpu')
  if (cpuStart.state.turn === 'finished') return cpuStart.state

  if (cpuStart.stunned && !cpuStart.state.cpuHand.some((card) => card.id === 'aed')) {
    const skipped = finishTurn({ ...cpuStart.state, message: 'CPUはVFで行動不能。AEDがないためターンを失った。' }, 'cpu')
    return beginPlayerTurn(appendBattleLog(cpuStart.state, skipped, 'cpu', 'VFで行動不能・CPUターン終了'))
  }

  const card = chooseCpuCard(cpuStart.state)
  if (!card) {
    const skipped = { ...cpuStart.state, turn: 'player' as const, message: 'CPUはカードを出せず、ターンを終了した。' }
    return beginPlayerTurn(appendBattleLog(cpuStart.state, skipped, 'cpu', 'CPU: ターン終了（カードなし）'))
  }

  const afterCpuCard = useCard(cpuStart.state, 'cpu', card)
  if (afterCpuCard.turn === 'finished') return afterCpuCard
  return beginPlayerTurn(afterCpuCard)
}
