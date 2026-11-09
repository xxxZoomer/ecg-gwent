import { useState } from 'react'
import { HeartPulse } from 'lucide-react'
import ECGWaveformDisplay from './ECGWaveformDisplay'
import { ecgData, ecgRhythms } from './ecgData'
import { addOwnedCard, loadPlayerProgress } from './deckStorage'
import { getQuizCardRewards } from './quizRewards'
import type { Card } from './types'
import type { ECGRhythm } from './types'

interface QuizQuestion {
  rhythm: ECGRhythm
  choices: ECGRhythm[]
}

interface ECGQuizProps {
  onCorrectAnswer: (rhythm: ECGRhythm) => string
}

function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function createQuestions(): QuizQuestion[] {
  return shuffled(ecgRhythms).slice(0, 10).map((rhythm) => ({
    rhythm,
    choices: shuffled([
      rhythm,
      ...shuffled(ecgRhythms.filter((option) => option !== rhythm)).slice(0, 3),
    ]),
  }))
}

export default function ECGQuiz({ onCorrectAnswer }: ECGQuizProps) {
  const [questions, setQuestions] = useState(createQuestions)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<ECGRhythm | null>(null)
  const [score, setScore] = useState(0)
  const [correctStreak, setCorrectStreak] = useState(0)
  const [finished, setFinished] = useState(false)
  const [rewardMessage, setRewardMessage] = useState<string | null>(null)
  const [ownedCardIds, setOwnedCardIds] = useState(() => loadPlayerProgress().ownedCardIds)
  const [rewardCards, setRewardCards] = useState<Card[]>([])
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null)
  const question = questions[questionIndex]

  const restart = () => {
    setQuestions(createQuestions())
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setCorrectStreak(0)
    setFinished(false)
    setRewardMessage(null)
    setRewardCards([])
    setSelectedRewardId(null)
  }

  const answer = (rhythm: ECGRhythm) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(rhythm)
    if (rhythm === question.rhythm) {
      setScore((current) => current + 1)
      setRewardMessage(onCorrectAnswer(question.rhythm))
      const nextStreak = correctStreak + 1
      if (nextStreak === 3) {
        setCorrectStreak(0)
        const rewards = getQuizCardRewards(question.rhythm, ownedCardIds)
        if (rewards.length === 3) {
          setRewardCards(rewards)
          setSelectedRewardId(null)
        } else {
          setRewardMessage('重複しないカード報酬を3枚用意できませんでした。')
        }
      } else {
        setCorrectStreak(nextStreak)
      }
    } else {
      setCorrectStreak(0)
      setRewardMessage(null)
    }
  }

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      setFinished(true)
      return
    }
    setQuestionIndex((current) => current + 1)
    setSelectedAnswer(null)
    setRewardMessage(null)
  }

  const revealReward = (card: Card) => {
    if (selectedRewardId !== null) return
    const progress = addOwnedCard(card.id)
    setOwnedCardIds(progress.ownedCardIds)
    setSelectedRewardId(card.id)
  }

  const closeReward = () => {
    setRewardCards([])
    setSelectedRewardId(null)
    nextQuestion()
  }

  if (rewardCards.length > 0) {
    const selectedReward = rewardCards.find((card) => card.id === selectedRewardId)

    return (
      <section className="ecg-quiz quiz-reward-screen" aria-labelledby="quiz-reward-title">
        <p className="eyebrow">ECG ACADEMY · CARD REWARD</p>
        <h2 id="quiz-reward-title">{selectedReward ? 'カードを獲得しました' : '連続正解の報酬'}</h2>
        <p className="quiz-reward-intro">
          {selectedReward ? '選んだカードがコレクションに加わりました。' : '裏向きのカードを1枚選んでください。'}
        </p>
        <div className="quiz-reward-cards">
          {rewardCards.map((card, index) => {
            const isRevealed = card.id === selectedRewardId
            return (
              <button
                type="button"
                key={card.id}
                className={`quiz-reward-card${isRevealed ? ' is-revealed' : ''}`}
                aria-label={isRevealed ? `獲得カード: ${card.name}` : `報酬カード ${index + 1} を選ぶ`}
                aria-pressed={isRevealed}
                disabled={selectedRewardId !== null}
                onClick={() => revealReward(card)}
              >
                {isRevealed ? (
                  <span className="quiz-reward-card-face">
                    <small>{card.type} · {card.rarity}</small>
                    <strong>{card.name}</strong>
                    <span>{card.effect}</span>
                    <em>{card.flavorText}</em>
                  </span>
                ) : (
                  <span className="quiz-reward-card-back" aria-hidden="true">
                    <HeartPulse size={32} strokeWidth={1.4} />
                    <strong>ECG</strong>
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {selectedReward && (
          <button type="button" className="primary-button quiz-reward-continue" onClick={closeReward}>
            クイズへ戻る
          </button>
        )}
      </section>
    )
  }

  if (finished) {
    return (
      <section className="ecg-quiz quiz-results" aria-labelledby="quiz-result-title">
        <p className="eyebrow">ECG QUIZ · COMPLETE</p>
        <h2 id="quiz-result-title">10問終了</h2>
        <p className="quiz-final-score">{score}<span> / 10 問正解</span></p>
        <button type="button" className="primary-button" onClick={restart}>もう一度挑戦</button>
      </section>
    )
  }

  return (
    <section className="ecg-quiz" aria-labelledby="quiz-title">
      <div className="quiz-heading">
        <div>
          <p className="eyebrow">ECG QUIZ · DIAGNOSIS TRAINING</p>
          <h2 id="quiz-title">波形を診断する</h2>
        </div>
        <div className="quiz-score" aria-live="polite">
          <span>正解数</span><strong>{score}</strong>
        </div>
      </div>

      <div className="quiz-progress" aria-label={`全10問中 ${questionIndex + 1}問目`}>
        <span>QUESTION {String(questionIndex + 1).padStart(2, '0')} / 10</span>
        <div><i style={{ width: `${((questionIndex + 1) / 10) * 100}%` }} /></div>
      </div>

      <div className={`quiz-wave rhythm-${question.rhythm.toLowerCase()}`}>
        <ECGWaveformDisplay
          rhythm={question.rhythm}
          ariaLabel={`第${questionIndex + 1}問の心電図波形`}
          showMarkers={false}
        />
      </div>

      <fieldset className="quiz-choices" disabled={selectedAnswer !== null}>
        <legend>この波形の診断はどれですか？</legend>
        {question.choices.map((choice, index) => {
          const isCorrect = choice === question.rhythm
          const isSelected = choice === selectedAnswer
          const stateClass = selectedAnswer === null
            ? ''
            : isCorrect ? ' is-correct' : isSelected ? ' is-incorrect' : ''
          return (
            <button
              type="button"
              key={choice}
              className={`quiz-choice${stateClass}`}
              aria-pressed={isSelected}
              onClick={() => answer(choice)}
            >
              <span className="quiz-choice-index">{String.fromCharCode(65 + index)}</span>
              <span><strong>{choice}</strong><small>{ecgData[choice].label}</small></span>
            </button>
          )
        })}
      </fieldset>

      {selectedAnswer !== null && (
        <div className="quiz-feedback" aria-live="polite">
          <strong>{selectedAnswer === question.rhythm ? '正解です' : `不正解 — 正解は ${question.rhythm}（${ecgData[question.rhythm].label}）`}</strong>
          {rewardMessage && <p className="quiz-card-reward">{rewardMessage}</p>}
          <ul>{ecgData[question.rhythm].educationNotes.map((note) => <li key={note}>{note}</li>)}</ul>
          <button type="button" className="primary-button" onClick={nextQuestion}>
            {questionIndex === questions.length - 1 ? '結果を見る' : '次の問題へ'}
          </button>
        </div>
      )}
    </section>
  )
}
