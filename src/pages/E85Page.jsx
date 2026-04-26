import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/E85.css'

const E_PUMP = 0.10
const E_E85  = 0.83

const TARGETS = [
  { label: 'E30', value: 0.30 },
  { label: 'E40', value: 0.40 },
  { label: 'E50', value: 0.50 },
  { label: 'E60', value: 0.60 },
  { label: 'E70', value: 0.70 },
]

export default function E85Page() {
  const [tankSize,      setTankSize]      = useState('')
  const [milesToEmpty,  setMilesToEmpty]  = useState('')
  const [mpg,           setMpg]           = useState('')
  const [currentEth,    setCurrentEth]    = useState('')
  const [targetBlend,   setTargetBlend]   = useState('0.3')
  const [result,        setResult]        = useState(null)
  const [error,         setError]         = useState('')

  function calculate() {
    const T         = parseFloat(tankSize)
    const mte       = parseFloat(milesToEmpty)
    const mpgVal    = parseFloat(mpg)
    const E_current = parseFloat(currentEth) / 100
    const E_target  = parseFloat(targetBlend)

    if ([T, mte, mpgVal, E_current].some(v => isNaN(v)) || currentEth === '') {
      setError('Please fill in all fields.')
      setResult(null)
      return
    }

    const C     = mte / mpgVal
    const space = T - C

    if (C > T) {
      setError('Calculated fuel level exceeds tank size. Check your inputs.')
      setResult(null)
      return
    }

    if (E_current > E_target) {
      setError('Your current ethanol % is already above target. Fill with pump gas (E10) to dilute.')
      setResult(null)
      return
    }

    const X = (T * E_target - C * E_current - space * E_PUMP) / (E_E85 - E_PUMP)
    const Y = space - X

    if (X > space) {
      const targetLabel = TARGETS.find(t => t.value === E_target)?.label ?? `${E_target * 100}%`
      setError(`Not enough tank space to reach ${targetLabel} in one fill. Burn more fuel first, then recalculate.`)
      setResult(null)
      return
    }

    setError('')
    setResult({
      gallonsInTank: C.toFixed(2),
      e85ToAdd:      Math.max(0, X).toFixed(2),
      pumpGasToAdd:  Math.max(0, Y).toFixed(2),
      targetLabel:   TARGETS.find(t => t.value === E_target)?.label,
    })
  }

  return (
    <>
      <Header brand={{ type: 'text', text: 'E85 Calc' }} />
      <main className="e85-page container">
        <h1 className="e85-title">E85 Mix Calculator</h1>

        <div className="e85-disclaimer">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>
            California 91 octane is <strong>E10</strong> (10% ethanol).
            California E85 varies <strong>70–85%</strong> ethanol seasonally — this calculator assumes <strong>83%</strong>.
            Results are estimates.
          </p>
        </div>

        <div className="e85-form">
          <div className="e85-field">
            <label htmlFor="tankSize">Tank Capacity (gal)</label>
            <input
              id="tankSize"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 13.2"
              value={tankSize}
              onChange={e => setTankSize(e.target.value)}
            />
          </div>

          <div className="e85-row">
            <div className="e85-field">
              <label htmlFor="milesToEmpty">Miles to Empty</label>
              <input
                id="milesToEmpty"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 80"
                value={milesToEmpty}
                onChange={e => setMilesToEmpty(e.target.value)}
              />
            </div>
            <div className="e85-field">
              <label htmlFor="mpg">Current MPG</label>
              <input
                id="mpg"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 22"
                value={mpg}
                onChange={e => setMpg(e.target.value)}
              />
            </div>
          </div>

          <div className="e85-row">
            <div className="e85-field">
              <label htmlFor="currentEth">Current Ethanol %</label>
              <input
                id="currentEth"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 10"
                min="0"
                max="85"
                value={currentEth}
                onChange={e => setCurrentEth(e.target.value)}
              />
            </div>
            <div className="e85-field">
              <label htmlFor="targetBlend">Target Blend</label>
              <select
                id="targetBlend"
                value={targetBlend}
                onChange={e => setTargetBlend(e.target.value)}
              >
                {TARGETS.map(t => (
                  <option key={t.label} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button className="e85-btn" onClick={calculate}>Calculate</button>
        </div>

        {error && (
          <div className="e85-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="e85-result">
            <div className="e85-result-row muted">
              <span>Fuel in tank</span>
              <span>{result.gallonsInTank} gal</span>
            </div>

            <div className="e85-result-divider" />

            <div className="e85-result-row">
              <span>Add 91 (E10)</span>
              <span>{result.pumpGasToAdd} gal</span>
            </div>
            
            <div className="e85-result-row accent">
              <span>Add E85</span>
              <span>{result.e85ToAdd} gal</span>
            </div>
            <div className="e85-result-divider" />

            <div className="e85-result-row muted">
              <span>Result</span>
              <span>Full tank · {result.targetLabel}</span>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
