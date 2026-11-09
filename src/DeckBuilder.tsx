import Card from './Card'
import {
  cardCatalog,
  DECK_SIZE,
  getDeckCategoryCounts,
  getDeckDiagnosis,
  MIN_DECK_SIZE,
  type ECGCard,
} from './game'

interface DeckBuilderProps {
  deck: ECGCard[]
  ownedCardIds: string[]
  onToggleCard: (card: ECGCard) => void
}

export default function DeckBuilder({ deck, ownedCardIds, onToggleCard }: DeckBuilderProps) {
  const selectedIds = new Set(deck.map((card) => card.id))
  const ownedIds = new Set(ownedCardIds)
  const counts = getDeckCategoryCounts(deck)

  return (
    <section className="deck-builder" aria-labelledby="deck-builder-title">
      <header className="deck-builder-heading">
        <div>
          <p className="eyebrow">DECK BUILDER</p>
          <h1 id="deck-builder-title">デッキを編集</h1>
          <p>獲得済みカードから5〜20枚を選びます。同じカードは1枚までです。</p>
        </div>
        <strong className="deck-size-count">{deck.length} / {DECK_SIZE} 枚</strong>
      </header>
      <section className="deck-diagnosis" aria-live="polite">
        <h2>デッキ診断</h2>
        <dl>
          <div><dt>攻撃</dt><dd>{counts.attack}</dd></div>
          <div><dt>治療</dt><dd>{counts.treatment}</dd></div>
          <div><dt>補助</dt><dd>{counts.support}</dd></div>
        </dl>
        <p>{deck.length < MIN_DECK_SIZE ? `Battleには最低${MIN_DECK_SIZE}枚必要です。` : getDeckDiagnosis(deck)}</p>
        <small>推奨構成：攻撃10・治療5・補助5。治療はHEALとCOUNTER、補助はCONTROLとCOMBOです。</small>
      </section>
      <div className="deck-builder-grid">
        {cardCatalog.map((card) => {
          const selected = selectedIds.has(card.id)
          const unlocked = ownedIds.has(card.id)
          return (
            <div className={`deck-builder-card${unlocked ? '' : ' is-locked'}`} key={card.id}>
              <Card
                card={card}
                selected={selected}
                disabled={!unlocked || (!selected && deck.length >= DECK_SIZE)}
                onClick={() => unlocked && onToggleCard(card)}
              />
              {!unlocked && <span className="deck-card-lock">🔒 Quizで解放</span>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
