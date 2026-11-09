import type { Card } from '../types'

export interface ECGCard extends Card {
  subtitle: string
  family: string
  power: number
  lead: string
  findings: string
  color: string
  waveform: string
}
export type MatchResult = 'victory' | 'defeat'
export type PlayerSide = 'player' | 'cpu'
export type StatusKind = 'damage' | 'stun' | 'ward' | 'confusion' | 'countdown'
export type CardRole = 'ATTACK' | 'CONTROL' | 'COMBO' | 'HEAL' | 'COUNTER'
export type BattleFaction = 'ARRHYTHMIA' | 'ELECTROLYTE' | 'ISCHEMIA' | 'HEART FAILURE'

export interface BattleStatus {
  id: string
  label: string
  turnsRemaining: number
  damageAtTurnStart: number
  damageAtTurnEnd: number
  kind: StatusKind
}

export interface BattleLogEntry {
  id: number
  turn: number
  actor: PlayerSide
  title: string
  details: string[]
}

export interface GameState {
  playerFaction: BattleFaction
  cpuFaction: BattleFaction
  turnNumber: number
  battleLog: BattleLogEntry[]
  playerHand: ECGCard[]
  cpuHand: ECGCard[]
  playerDeck: ECGCard[]
  cpuDeck: ECGCard[]
  playerDiscard: ECGCard[]
  cpuDiscard: ECGCard[]
  playerBoard: ECGCard[]
  cpuBoard: ECGCard[]
  playerHealth: number
  cpuHealth: number
  playerStatuses: BattleStatus[]
  cpuStatuses: BattleStatus[]
  turn: 'player' | 'cpu' | 'finished'
  result: MatchResult | null
  message: string
}
