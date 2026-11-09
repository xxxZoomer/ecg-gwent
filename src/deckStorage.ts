import {
  cardCatalog,
  DEFAULT_DECK_IDS,
  DECK_SIZE,
  STARTER_CARD_IDS,
} from './game'

const PROGRESS_STORAGE_KEY = 'ecg-gwent-player-progress-v1'

export interface PlayerProgress {
  ownedCardIds: string[]
  deckIds: string[]
}

function isCardIdList(value: unknown): value is string[] {
  return Array.isArray(value)
    && value.every((id): id is string => (
      typeof id === 'string' && cardCatalog.some((card) => card.id === id)
    ))
}

export function loadPlayerProgress(): PlayerProgress {
  const defaultProgress = {
    ownedCardIds: [...STARTER_CARD_IDS],
    deckIds: [...DEFAULT_DECK_IDS],
  }

  try {
    const savedProgress = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (savedProgress === null) return defaultProgress

    const parsed: unknown = JSON.parse(savedProgress)
    if (
      typeof parsed !== 'object'
      || parsed === null
      || !('ownedCardIds' in parsed)
      || !('deckIds' in parsed)
      || !isCardIdList(parsed.ownedCardIds)
      || !isCardIdList(parsed.deckIds)
      || parsed.ownedCardIds.length > cardCatalog.length
      || parsed.deckIds.length > DECK_SIZE
      || new Set(parsed.ownedCardIds).size !== parsed.ownedCardIds.length
      || new Set(parsed.deckIds).size !== parsed.deckIds.length
    ) {
      console.warn('保存データが不正なため、Starter Deckから開始します。')
      return defaultProgress
    }

    const ownedCardIds = [...new Set([...STARTER_CARD_IDS, ...parsed.ownedCardIds])]
    const deckIds = parsed.deckIds.filter((id) => ownedCardIds.includes(id))
    return {
      ownedCardIds,
      deckIds: deckIds.length ? deckIds : [...DEFAULT_DECK_IDS],
    }
  } catch (error) {
    console.error('プレイヤーの進行状況を読み込めませんでした。Starter Deckから開始します。', error)
    return defaultProgress
  }
}

export function savePlayerProgress(progress: PlayerProgress): void {
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('プレイヤーの進行状況を保存できませんでした。', error)
  }
}

export function addOwnedCard(cardId: string): PlayerProgress {
  const progress = loadPlayerProgress()
  if (!cardCatalog.some((card) => card.id === cardId) || progress.ownedCardIds.includes(cardId)) {
    return progress
  }

  const updatedProgress = {
    ...progress,
    ownedCardIds: [...progress.ownedCardIds, cardId],
  }
  savePlayerProgress(updatedProgress)
  return updatedProgress
}
