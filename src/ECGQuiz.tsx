import { useState } from 'react'
import ECGWaveformDisplay from './ECGWaveformDisplay'
import { ecgData, ecgRhythms } from './ecgData'
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
  const [finished, setFinished] = useState(false)
  const [rewardMessage, setRewardMessage] = useState<string | null>(null)
  const question = questions[questionIndex]

  const restart = () => {
    setQuestions(createQuestions())
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setFinished(false)
    setRewardMessage(null)
  }

  const answer = (rhythm: ECGRhythm) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(rhythm)
    if (rhythm === question.rhythm) {
      setScore((current) => current + 1)
      setRewardMessage(onCorrectAnswer(question.rhythm))
    } else {
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
