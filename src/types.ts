export type ECGRhythm =
  | 'NSR'
  | 'Af'
  | 'AFL'
  | 'PSVT'
  | 'VT'
  | 'VF'
  | 'PAC'
  | 'PVC'
  | 'MobitzI'
  | 'MobitzII'
  | 'CompleteAVBlock'
  | 'RBBB'
  | 'LBBB'
  | 'STEMI'
  | 'Hyperkalemia'
  | 'Hypokalemia'

export enum CardType {
  Rhythm = 'Rhythm',
  Treatment = 'Treatment',
  Device = 'Device',
  Support = 'Support',
}

export enum CardRarity {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

export interface Card {
  id: string
  name: string
  type: CardType
  rarity: CardRarity
  cost: number
  effect: string
  flavorText: string
  image?: string
}
