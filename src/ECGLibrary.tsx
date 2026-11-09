import { useState } from 'react'
import ECGWaveformDisplay from './ECGWaveformDisplay'
import { ecgData, ecgLibrary } from './ecgData'
import { cardCatalog, getBattleCardLabel, getCardRole } from './game'
import type { ECGRhythm } from './types'

interface ECGLibraryProps {
  ownedCardIds: string[]
}

export default function ECGLibrary({ ownedCardIds }: ECGLibraryProps) {
  const [selectedRhythm, setSelectedRhythm] = useState<ECGRhythm>('NSR')
  const waveform = ecgData[selectedRhythm]
  const owned = new Set(ownedCardIds)

  return (
    <section className="ecg-library-page" aria-labelledby="ecg-library-page-title">
      <header className="ecg-library-page-heading">
        <div>
          <p className="eyebrow">ECG LIBRARY · STUDY MODE</p>
          <h1 id="ecg-library-page-title">ECG Library</h1>
          <p>波形を選択して、心電図の特徴と診断のポイントを確認できます。</p>
        </div>
        <div className="ecg-library-counts">
          <span className="ecg-library-count">{ecgLibrary.length} 波形</span>
          <span className="ecg-library-count">Collection {ownedCardIds.length} / {cardCatalog.length}</span>
        </div>
      </header>

      <section className="card-collection" aria-labelledby="card-collection-title">
        <header>
          <h2 id="card-collection-title">カードコレクション</h2>
          <span>{ownedCardIds.length} / {cardCatalog.length} 獲得</span>
        </header>
        <ul>
          {cardCatalog.map((card) => {
            const unlocked = owned.has(card.id)
            return (
              <li key={card.id} className={unlocked ? 'is-unlocked' : 'is-locked'}>
                <span aria-hidden="true">{unlocked ? '✅' : '🔒'}</span>
                <strong>{getBattleCardLabel(card)}</strong>
                <small className={`card-role role-${getCardRole(card).toLowerCase()}`}>{getCardRole(card)}</small>
                <span className="collection-status">{unlocked ? '獲得済み' : 'Quizで解放'}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="ecg-library-layout">
        <nav className="ecg-library-list" aria-label="波形一覧">
          {ecgLibrary.map((entry) => (
            <button
              type="button"
              key={entry.rhythm}
              className="ecg-library-item"
              aria-current={selectedRhythm === entry.rhythm ? 'true' : undefined}
              onClick={() => setSelectedRhythm(entry.rhythm)}
            >
              <span className="ecg-library-item-title">
                <strong>{entry.rhythm}</strong>
                <small className="ecg-difficulty" data-difficulty={entry.difficulty}>{entry.difficulty}</small>
              </span>
              <span>{entry.label}</span>
            </button>
          ))}
        </nav>

        <article className={`ecg-library-detail rhythm-${selectedRhythm.toLowerCase()}`} aria-labelledby="ecg-library-detail-title">
          <header className="ecg-library-detail-heading">
            <div>
              <p className="eyebrow">{selectedRhythm} · {waveform.difficulty}</p>
              <h2 id="ecg-library-detail-title">{waveform.label}</h2>
            </div>
            <p className="ecg-library-heart-rate"><span>HR</span>{waveform.heartRate}</p>
          </header>
          <div className="ecg-library-wave">
            <ECGWaveformDisplay
              rhythm={selectedRhythm}
              ariaLabel={`${waveform.label}: ${waveform.description}`}
            />
          </div>
          <p className="ecg-wave-description">{waveform.description}</p>
          <div className="ecg-wave-features" aria-label="波形の特徴">
            {waveform.features.map((feature) => <span key={feature}>{feature}</span>)}
          </div>
          <section className="ecg-library-notes" aria-labelledby="ecg-library-notes-title">
            <h3 id="ecg-library-notes-title">教育メモ</h3>
            <ul>{waveform.educationNotes.map((note) => <li key={note}>{note}</li>)}</ul>
          </section>
        </article>
      </div>
    </section>
  )
}
