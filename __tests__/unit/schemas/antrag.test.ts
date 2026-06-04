import { describe, it, expect } from 'vitest'
import { antragCreateSchema, antragUpdateSchema, normalizeAntragInput } from '@/lib/schemas/antrag'

describe('antragCreateSchema', () => {
  it('akzeptiert gültigen Weiterbildungsantrag', () => {
    const result = antragCreateSchema.safeParse(
      normalizeAntragInput({
        titel: 'CAS Prozessdigitalisierung',
        anbieter: 'ZHAW School of Management and Law',
        startdatum: '2026-09-01',
        enddatum: '2026-12-15',
        kostenChf: '5900',
        kostenstelle: 'WB-1000',
        begruendung:
          'Die Weiterbildung staerkt die Faehigkeiten in Prozessanalyse und digitaler Zusammenarbeit deutlich.',
        bemerkung: 'Optionaler Hinweis',
      })
    )
    expect(result.success).toBe(true)
  })

  it('normalisiert leere optionale Felder zu undefined', () => {
    const result = normalizeAntragInput({
      titel: 'CAS Prozessdigitalisierung',
      anbieter: 'ZHAW School of Management and Law',
      startdatum: '2026-09-01',
      enddatum: '',
      kostenChf: '5900',
      kostenstelle: 'WB-1000',
      begruendung:
        'Die Weiterbildung staerkt die Faehigkeiten in Prozessanalyse und digitaler Zusammenarbeit deutlich.',
      bemerkung: null,
    })

    expect(result.enddatum).toBeUndefined()
    expect(result.bemerkung).toBeUndefined()
  })

  it('lehnt Enddatum vor Startdatum ab', () => {
    const result = antragCreateSchema.safeParse(
      normalizeAntragInput({
        titel: 'CAS Prozessdigitalisierung',
        anbieter: 'ZHAW School of Management and Law',
        startdatum: '2026-09-01',
        enddatum: '2026-08-01',
        kostenChf: '5900',
        kostenstelle: 'WB-1000',
        begruendung:
          'Die Weiterbildung staerkt die Faehigkeiten in Prozessanalyse und digitaler Zusammenarbeit deutlich.',
        bemerkung: '',
      })
    )
    expect(result.success).toBe(false)
  })

  it('lehnt leeren Titel ab', () => {
    const result = antragCreateSchema.safeParse(
      normalizeAntragInput({
        titel: '',
        anbieter: 'ZHAW School of Management and Law',
        startdatum: '2026-09-01',
        kostenChf: '5900',
        kostenstelle: 'WB-1000',
        begruendung:
          'Die Weiterbildung staerkt die Faehigkeiten in Prozessanalyse und digitaler Zusammenarbeit deutlich.',
        bemerkung: '',
      })
    )
    expect(result.success).toBe(false)
  })

  it('lehnt ungueltige Kosten ab', () => {
    const result = antragCreateSchema.safeParse(
      normalizeAntragInput({
        titel: 'CAS Prozessdigitalisierung',
        anbieter: 'ZHAW School of Management and Law',
        startdatum: '2026-09-01',
        kostenChf: '-1',
        kostenstelle: 'WB-1000',
        begruendung:
          'Die Weiterbildung staerkt die Faehigkeiten in Prozessanalyse und digitaler Zusammenarbeit deutlich.',
        bemerkung: '',
      })
    )
    expect(result.success).toBe(false)
  })
  it('ein vollstaendiger Datensatz fuer den Direkt-Einreichen-Fluss ist valide', () => {
    const antragFromDb = {
      titel: 'CAS Prozessdigitalisierung',
      anbieter: 'ZHAW School of Management and Law',
      startdatum: new Date('2026-09-01'),
      enddatum: new Date('2026-12-15'),
      kostenChf: 5900,
      kostenstelle: 'WB-1000',
      begruendung: 'Die Weiterbildung staerkt die Faehigkeiten in Prozessanalyse und digitaler Zusammenarbeit deutlich.',
      bemerkung: 'Optionaler Hinweis',
    }
    const result = antragCreateSchema.safeParse(normalizeAntragInput(antragFromDb))
    expect(result.success).toBe(true)
  })

  it('ein Datensatz mit zu kurzer Begruendung wird vom Re-Validate abgelehnt', () => {
    const antragFromDb = {
      titel: 'CAS Prozessdigitalisierung',
      anbieter: 'ZHAW School of Management and Law',
      startdatum: new Date('2026-09-01'),
      kostenChf: 5900,
      kostenstelle: 'WB-1000',
      begruendung: 'Zu kurz',
    }
    const result = antragCreateSchema.safeParse(normalizeAntragInput(antragFromDb))
    expect(result.success).toBe(false)
  })
})

describe('antragUpdateSchema', () => {
  it('akzeptiert vollständige Aktualisierung mit den neuen Feldern', () => {
    const result = antragUpdateSchema.safeParse(
      normalizeAntragInput({
        titel: 'Aktualisierter Titel',
        anbieter: 'Neuer Anbieter',
        startdatum: '2026-09-01',
        enddatum: '2026-12-15',
        kostenChf: '1234.50',
        kostenstelle: 'WB-2000',
        begruendung:
          'Die Weiterbildung bleibt fachlich sinnvoll und entspricht den neuen Anforderungen.',
        bemerkung: 'Update',
      })
    )
    expect(result.success).toBe(true)
  })

  it('lehnt fehlende Pflichtfelder ab', () => {
    const result = antragUpdateSchema.safeParse({
      titel: 'Aktualisierter Titel',
    })
    expect(result.success).toBe(false)
  })
})
