import { describe, it, expect } from 'vitest'
import { ANTRAG_STATUS_LABEL, ANTRAG_STATUS_TRANSITIONS, ANTRAG_STATUS_VARIANT } from '@/lib/antrag-status'

describe('ANTRAG_STATUS_LABEL', () => {
  it('hat deutsche Labels für alle Status', () => {
    expect(ANTRAG_STATUS_LABEL.ENTWURF).toBeTruthy()
    expect(ANTRAG_STATUS_LABEL.EINGEREICHT).toBeTruthy()
    expect(ANTRAG_STATUS_LABEL.IN_RUECKFRAGE).toBeTruthy()
    expect(ANTRAG_STATUS_LABEL.GENEHMIGT).toBeTruthy()
    expect(ANTRAG_STATUS_LABEL.ABGELEHNT).toBeTruthy()
    expect(ANTRAG_STATUS_LABEL.ZURUECKGEZOGEN).toBeTruthy()
  })
})

describe('ANTRAG_STATUS_VARIANT', () => {
  it('hat Varianten für alle Status', () => {
    expect(ANTRAG_STATUS_VARIANT.ENTWURF).toBeTruthy()
    expect(ANTRAG_STATUS_VARIANT.EINGEREICHT).toBeTruthy()
    expect(ANTRAG_STATUS_VARIANT.IN_RUECKFRAGE).toBeTruthy()
    expect(ANTRAG_STATUS_VARIANT.GENEHMIGT).toBeTruthy()
    expect(ANTRAG_STATUS_VARIANT.ABGELEHNT).toBeTruthy()
    expect(ANTRAG_STATUS_VARIANT.ZURUECKGEZOGEN).toBeTruthy()
  })
})

describe('ANTRAG_STATUS_TRANSITIONS', () => {
  it('erlaubt Einreichen eines Entwurfs', () => {
    expect(ANTRAG_STATUS_TRANSITIONS.ENTWURF).toContain('EINGEREICHT')
  })

  it('erlaubt Rueckfrage aus eingereichtem Antrag', () => {
    expect(ANTRAG_STATUS_TRANSITIONS.EINGEREICHT).toContain('IN_RUECKFRAGE')
  })

  it('erlaubt Genehmigen eines eingereichten Antrags', () => {
    expect(ANTRAG_STATUS_TRANSITIONS.EINGEREICHT).toContain('GENEHMIGT')
  })

  it('erlaubt Ablehnen eines eingereichten Antrags', () => {
    expect(ANTRAG_STATUS_TRANSITIONS.EINGEREICHT).toContain('ABGELEHNT')
  })

  it('erlaubt Rueckzug aus Rueckfrage', () => {
    expect(ANTRAG_STATUS_TRANSITIONS.IN_RUECKFRAGE).toContain('ZURUECKGEZOGEN')
  })

  it('erlaubt keine Übergänge von GENEHMIGT', () => {
    expect(ANTRAG_STATUS_TRANSITIONS.GENEHMIGT).toHaveLength(0)
  })

  it('erlaubt keine Übergänge von ZURUECKGEZOGEN', () => {
    expect(ANTRAG_STATUS_TRANSITIONS.ZURUECKGEZOGEN).toHaveLength(0)
  })
})
