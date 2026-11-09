import { cardCatalog } from './game'
import type { Card } from './types'
import type { ECGRhythm } from './types'

const quizRewardCandidates: Partial<Record<ECGRhythm, string[]>> = {
  Af: ['afib', 'ablation'],
  AFL: ['flutter'],
  PSVT: ['psvt'],
  VT: ['vtach', 'amiodarone'],
  VF: ['vfib', 'aed'],
  PAC: ['afib', 'flutter'],
  PVC: ['vtach', 'vfib'],
  MobitzI: ['complete-av-block'],
  MobitzII: ['complete-av-block'],
  CompleteAVBlock: ['complete-av-block'],
  RBBB: ['rbbb'],
  LBBB: ['lbbb'],
  STEMI: ['stemi', 'revascularization'],
  Hyperkalemia: ['hyperkalemia', 'insulin-glucose', 'calcium-gluconate'],
  Hypokalemia: ['hypokalemia', 'potassium-replacement'],
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

export function getQuizCardRewards(rhythm: ECGRhythm, ownedCardIds: string[], count = 3): Card[] {
  const owned = new Set(ownedCardIds)
  const relatedIds = quizRewardCandidates[rhythm] ?? []
  const related = relatedIds
    .map((id) => cardCatalog.find((card) => card.id === id))
    .filter((card): card is (typeof cardCatalog)[number] => card !== undefined && !owned.has(card.id))
  const relatedIdsSet = new Set(related.map((card) => card.id))
  const remaining = shuffled(cardCatalog.filter((card) => !owned.has(card.id) && !relatedIdsSet.has(card.id)))
  return [...related, ...remaining].slice(0, count)
}

export function getQuizCardReward(rhythm: ECGRhythm, ownedCardIds: string[]): Card | undefined {
  return getQuizCardRewards(rhythm, ownedCardIds, 1)[0]
}
