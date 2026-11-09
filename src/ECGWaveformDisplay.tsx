import { useId } from 'react'
import { ecgData } from './ecgData'
import type { ECGRhythm } from './types'

interface ECGWaveformDisplayProps {
  rhythm: ECGRhythm
  ariaLabel: string
  showMarkers?: boolean
}

export default function ECGWaveformDisplay({
  rhythm,
  ariaLabel,
  showMarkers = true,
}: ECGWaveformDisplayProps) {
  const waveform = ecgData[rhythm]
  const patternId = useId().replace(/:/g, '')
  const smallGridId = `${patternId}-small-grid`
  const largeGridId = `${patternId}-large-grid`

  return (
    <svg
      className="ecg-monitor-wave"
      viewBox="0 0 640 120"
      width="100%"
      height="180"
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio="none"
      style={{ display: 'block', background: '#f3faf4' }}
    >
      <defs>
        <pattern id={smallGridId} width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#e4eee5" strokeWidth="0.7" />
        </pattern>
        <pattern id={largeGridId} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill={`url(#${smallGridId})`} />
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d3e4d7" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="640" height="120" fill={`url(#${largeGridId})`} />
      <path d="M0 64 H640" fill="none" stroke="#a9c5b0" strokeDasharray="3 4" strokeWidth="1" />
      <path className="ecg-monitor-trace" d={waveform.path} fill="none" stroke="#23865d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      {showMarkers && waveform.markers?.map((marker) => (
        <g key={marker.label} className="ecg-wave-marker">
          <line x1={marker.x} y1={marker.labelY + 3} x2={marker.x} y2={marker.y} />
          <text x={marker.x} y={marker.labelY} textAnchor="middle">{marker.label}</text>
        </g>
      ))}
    </svg>
  )
}
