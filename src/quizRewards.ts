import { cardCatalog, type ECGCard } from './game'
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

export function getQuizCardReward(rhythm: ECGRhythm, ownedCardIds: string[]): ECGCard | undefined {
  const owned = new Set(ownedCardIds)
  const relatedReward = quizRewardCandidates[rhythm]
    ?.map((id) => cardCatalog.find((card) => card.id === id))
    .find((card): card is ECGCard => card !== undefined && !owned.has(card.id))
  return relatedReward ?? cardCatalog.find((card) => !owned.has(card.id))
}
