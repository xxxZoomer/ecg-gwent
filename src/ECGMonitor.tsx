import { useState } from 'react'
import { ecgData, ecgLibrary, ecgRhythms } from './ecgData'
import ECGWaveformDisplay from './ECGWaveformDisplay'
import type { ECGRhythm } from './types'

interface ECGMonitorProps {
  rhythm: ECGRhythm
  interactive?: boolean
  showDiagnosis?: boolean
  diagnosisActive?: boolean
}

export default function ECGMonitor({
  rhythm,
  interactive = true,
  showDiagnosis = true,
  diagnosisActive = false,
}: ECGMonitorProps) {
  const [selectedRhythm, setSelectedRhythm] = useState(rhythm)
  const displayRhythm = interactive ? selectedRhythm : rhythm
  const waveform = ecgData[displayRhythm]

  return (
    <section
      className={`ecg-monitor rhythm-${displayRhythm.toLowerCase()}`}
      aria-label={showDiagnosis ? `${waveform.label} ECG monitor` : 'ECG monitor'}
      style={{ overflow: 'hidden', border: '1px solid #dbe3dd', borderRadius: 12, background: '#f7fbf7' }}
    >
      <div className="ecg-monitor-heading" style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '12px 16px', color: '#172d2a' }}>
        <strong>ECG Monitor</strong>
        {!showDiagnosis && (
          <span className="ecg-monitor-status">
            {diagnosisActive ? '診断対象 · 波形を確認' : '現在の波形'}
          </span>
        )}
        {showDiagnosis && (
          <>
            <span className="ecg-monitor-label">{displayRhythm}</span>
            <span className="ecg-monitor-name">{waveform.label}</span>
            <span className="ecg-difficulty" data-difficulty={waveform.difficulty}>{waveform.difficulty}</span>
          </>
        )}
      </div>
      {showDiagnosis && <div className="ecg-vitals" aria-label="波形の心拍数">
        <span>HR</span><strong>{waveform.heartRate}</strong>
      </div>}
      <ECGWaveformDisplay
        rhythm={displayRhythm}
        ariaLabel={showDiagnosis ? `${waveform.label}: ${waveform.description}` : 'ECG waveform for diagnosis'}
      />
      {showDiagnosis && <>
        <div className="ecg-wave-features" aria-label="Waveform features">
          {waveform.features.map((feature) => <span key={feature}>{feature}</span>)}
        </div>
        <p className="ecg-wave-description">{waveform.description}</p>
        <section className="ecg-education-notes" aria-labelledby="ecg-notes-title">
          <h3 id="ecg-notes-title">教育メモ</h3>
          <ul>
            {waveform.educationNotes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </section>
      </>}
      {interactive && <section className="ecg-library" aria-labelledby="ecg-library-title">
        <div className="ecg-test-panel-heading">
          <strong id="ecg-library-title">ECGライブラリ</strong>
          <span>収録 {ecgLibrary.length} 波形 · 表示中 {ecgRhythms.indexOf(displayRhythm) + 1} / {ecgLibrary.length}</span>
        </div>
        <div className="ecg-rhythm-buttons" role="group" aria-label="心電図波形を選択">
          {ecgLibrary.map((entry) => (
            <button
              type="button"
              key={entry.rhythm}
              className="ecg-rhythm-button"
              aria-pressed={displayRhythm === entry.rhythm}
              onClick={() => setSelectedRhythm(entry.rhythm)}
            >
              <span>{entry.rhythm}</span>
              <small>{entry.difficulty}</small>
            </button>
          ))}
        </div>
      </section>}
    </section>
  )
}
