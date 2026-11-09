import { useState } from 'react'
import Card from './Card'
import { MAX_MULLIGAN_EXCHANGES, type ECGCard } from './game'

interface MulliganPhaseProps {
  hand: ECGCard[]
  exchangeCardsAvailable: number
  onExchange: (cardIds: string[]) => void
  onStartBattle: () => void
}

export default function MulliganPhase({
  hand,
  exchangeCardsAvailable,
  onExchange,
  onStartBattle,
}: MulliganPhaseProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [exchangesRemaining, setExchangesRemaining] = useState(MAX_MULLIGAN_EXCHANGES)

  const toggleSelection = (cardId: string) => {
    setSelectedIds((selected) => (
      selected.includes(cardId)
        ? selected.filter((id) => id !== cardId)
        : [...selected, cardId]
    ))
  }

  const exchangeSelectedCards = () => {
    if (!selectedIds.length || exchangesRemaining === 0) return
    onExchange(selectedIds)
    setSelectedIds([])
    setExchangesRemaining((remaining) => remaining - 1)
  }

  return (
    <section className="mulligan-phase" aria-labelledby="mulligan-title">
      <header className="mulligan-heading">
        <div>
          <p className="eyebrow">MULLIGAN PHASE</p>
          <h2 id="mulligan-title">初期手札を整える</h2>
          <p>交換したいカードを選択してください。交換したカードは山札に戻ります。</p>
        </div>
        <strong className="mulligan-remaining">残り交換回数：{exchangesRemaining}</strong>
      </header>
      <div className="hand-grid mulligan-hand">
        {hand.map((card) => (
          <Card
            key={card.id}
            card={card}
            selected={selectedIds.includes(card.id)}
            onClick={() => toggleSelection(card.id)}
          />
        ))}
      </div>
      <footer className="mulligan-actions">
        <span>選択中：{selectedIds.length}枚</span>
        <div>
          <button
            type="button"
            className="secondary-button"
            onClick={exchangeSelectedCards}
            disabled={!selectedIds.length || exchangesRemaining === 0 || exchangeCardsAvailable === 0}
          >
            選択したカードを交換
          </button>
          <button type="button" className="primary-button" onClick={onStartBattle}>
            戦闘開始
          </button>
        </div>
      </footer>
      {exchangeCardsAvailable === 0 && (
        <p className="mulligan-no-cards">交換できる山札カードがありません。デッキを増やすと交換できるようになります。</p>
      )}
    </section>
  )
}
