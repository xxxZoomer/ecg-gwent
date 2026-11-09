import { useEffect, useState } from 'react'
import { HeartPulse } from 'lucide-react'
import { ecgData, ecgLibrary, ecgRhythms } from './ecgData'
import ECGWaveformDisplay from './ECGWaveformDisplay'
import type { ECGRhythm } from './types'

interface ECGMonitorProps {
  rhythm: ECGRhythm
  interactive?: boolean
  altarMode?: boolean
  showDiagnosis?: boolean
  diagnosisActive?: boolean
}

export default function ECGMonitor({
  rhythm,
  interactive = true,
  altarMode = false,
  showDiagnosis = true,
  diagnosisActive = false,
}: ECGMonitorProps) {
  const [selectedRhythm, setSelectedRhythm] = useState(rhythm)
  useEffect(() => setSelectedRhythm(rhythm), [rhythm])
  const displayRhythm = interactive || altarMode ? selectedRhythm : rhythm
  const waveform = ecgData[displayRhythm]
  const altarRhythms: { rhythm: ECGRhythm; label: string }[] = [
    { rhythm: 'NSR', label: 'NSR' },
    { rhythm: 'Af', label: 'AF' },
    { rhythm: 'PSVT', label: 'SVT' },
    { rhythm: 'VT', label: 'VT' },
    { rhythm: 'VF', label: 'VF' },
    { rhythm: 'CompleteAVBlock', label: 'AV BLOCK' },
  ]
  const monitorVitals: Record<string, { heartRate: string; bloodPressure: string; oxygen: string }> = {
    NSR: { heartRate: '76', bloodPressure: '120/80', oxygen: '98%' },
    Af: { heartRate: '118', bloodPressure: '108/72', oxygen: '96%' },
    AFL: { heartRate: '150', bloodPressure: '110/74', oxygen: '96%' },
    PSVT: { heartRate: '188', bloodPressure: '94/62', oxygen: '95%' },
    VT: { heartRate: '170', bloodPressure: '78/48', oxygen: '88%' },
    VF: { heartRate: '—', bloodPressure: '—', oxygen: '—' },
    MobitzI: { heartRate: '54', bloodPressure: '108/70', oxygen: '97%' },
    MobitzII: { heartRate: '42', bloodPressure: '102/66', oxygen: '96%' },
    CompleteAVBlock: { heartRate: '38', bloodPressure: '96/60', oxygen: '95%' },
  }
  const vitals = monitorVitals[displayRhythm] ?? {
    heartRate: waveform.heartRate,
    bloodPressure: '118/76',
    oxygen: '97%',
  }
  const rhythmName = displayRhythm === 'Af'
    ? 'AF'
    : displayRhythm === 'PSVT'
      ? 'SVT'
      : displayRhythm === 'CompleteAVBlock' || displayRhythm === 'MobitzI' || displayRhythm === 'MobitzII'
        ? 'AV BLOCK'
        : displayRhythm

  return (
    <section
      className={`ecg-monitor rhythm-${displayRhythm.toLowerCase()}`}
      aria-label={showDiagnosis ? `${waveform.label} ECG monitor` : 'ECG monitor'}
      style={{ overflow: 'hidden', border: '1px solid #dbe3dd', borderRadius: 12, background: '#f7fbf7' }}
    >
      <div className="ecg-monitor-heading" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', color: '#172d2a' }}>
        <span className="ecg-monitor-seal" aria-hidden="true"><HeartPulse size={19} strokeWidth={1.6} /></span>
        <div className="ecg-monitor-title">
          <strong>Heart Altar</strong>
          <small>VITALIS OBSERVATORIUM</small>
        </div>
        {!showDiagnosis && (
          <span className="ecg-monitor-status">
            {diagnosisActive ? '診断対象 · 波形を確認' : '現在の波形'}
          </span>
        )}
        {showDiagnosis && (
          <>
            <span className="ecg-monitor-label">{rhythmName}</span>
            <span className="ecg-monitor-name">{waveform.label}</span>
            <span className="ecg-difficulty" data-difficulty={waveform.difficulty}>{waveform.difficulty}</span>
          </>
        )}
      </div>
      <ECGWaveformDisplay
        rhythm={displayRhythm}
        ariaLabel={showDiagnosis ? `${waveform.label}: ${waveform.description}` : 'ECG waveform for diagnosis'}
      />
      {showDiagnosis && <dl className="altar-vitals" aria-label="現在のバイタル">
        <div className="altar-rhythm"><dt>現在のリズム</dt><dd>{rhythmName}</dd></div>
        <div><dt>心拍数</dt><dd>{vitals.heartRate}<small>{vitals.heartRate === '—' ? '' : ' BPM'}</small></dd></div>
        <div><dt>血圧</dt><dd>{vitals.bloodPressure}<small>{vitals.bloodPressure === '—' ? '' : ' mmHg'}</small></dd></div>
        <div><dt>酸素飽和度</dt><dd>{vitals.oxygen}</dd></div>
      </dl>}
      {altarMode && <div className="altar-rhythm-controls" role="group" aria-label="リズムを選択">
        {altarRhythms.map((entry) => (
          <button
            type="button"
            key={entry.rhythm}
            aria-pressed={displayRhythm === entry.rhythm}
            onClick={() => setSelectedRhythm(entry.rhythm)}
          >
            {entry.label}
          </button>
        ))}
      </div>}
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
