import { AntragStatus } from '@/generated/prisma/enums'
import { z } from 'zod'

type AntragRawInput = {
  titel?: unknown
  anbieter?: unknown
  startdatum?: unknown
  enddatum?: unknown
  kostenChf?: unknown
  kostenstelle?: unknown
  begruendung?: unknown
  bemerkung?: unknown
}

function normalizeRequiredText(value: unknown) {
  if (value === null) {
    return undefined
  }

  if (typeof value !== 'string') {
    return value
  }

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function normalizeOptionalText(value: unknown) {
  if (value === null) {
    return undefined
  }

  if (typeof value !== 'string') {
    return value
  }

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function normalizeRequiredDate(value: unknown) {
  if (value === null) {
    return undefined
  }

  if (value instanceof Date) {
    return value
  }

  if (typeof value !== 'string') {
    return value
  }

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function normalizeOptionalDate(value: unknown) {
  if (value === null) {
    return undefined
  }

  if (value instanceof Date) {
    return value
  }

  if (typeof value !== 'string') {
    return value
  }

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
}

function normalizeKostenChf(value: unknown) {
  if (value === null) {
    return undefined
  }

  if (typeof value === 'number') {
    return value
  }

  if (typeof value !== 'string') {
    return value
  }

  const normalized = value.trim()
  if (normalized.length === 0) {
    return undefined
  }

  return Number(normalized.replace(',', '.'))
}

export function normalizeAntragInput<T extends AntragRawInput>(input: T) {
  return {
    titel: normalizeRequiredText(input.titel),
    anbieter: normalizeRequiredText(input.anbieter),
    startdatum: normalizeRequiredDate(input.startdatum),
    enddatum: normalizeOptionalDate(input.enddatum),
    kostenChf: normalizeKostenChf(input.kostenChf),
    kostenstelle: normalizeRequiredText(input.kostenstelle),
    begruendung: normalizeRequiredText(input.begruendung),
    bemerkung: normalizeOptionalText(input.bemerkung),
  }
}

const requiredDateSchema = z.coerce.date({
  error: 'Startdatum ist erforderlich',
})

const optionalDateSchema = z
  .preprocess((value) => normalizeOptionalDate(value), z.coerce.date({ error: 'Enddatum ist ungueltig' }).optional())

const antragBaseSchema = z
  .object({
    titel: z.preprocess(
      (value) => normalizeRequiredText(value),
      z
        .string({ error: 'Titel ist erforderlich' })
        .min(3, 'Titel muss mindestens 3 Zeichen lang sein')
        .max(120, 'Titel darf maximal 120 Zeichen lang sein')
    ),
    anbieter: z.preprocess(
      (value) => normalizeRequiredText(value),
      z
        .string({ error: 'Anbieter ist erforderlich' })
        .min(2, 'Anbieter muss mindestens 2 Zeichen lang sein')
        .max(120, 'Anbieter darf maximal 120 Zeichen lang sein')
    ),
    startdatum: z.preprocess((value) => normalizeRequiredDate(value), requiredDateSchema),
    enddatum: optionalDateSchema,
    kostenChf: z.preprocess(
      (value) => normalizeKostenChf(value),
      z
        .number({ error: 'Kosten in CHF sind erforderlich' })
        .min(0, 'Kosten in CHF duerfen nicht negativ sein')
        .max(50000, 'Kosten in CHF duerfen maximal 50000 betragen')
    ),
    kostenstelle: z.preprocess(
      (value) => normalizeRequiredText(value),
      z
        .string({ error: 'Kostenstelle ist erforderlich' })
        .min(2, 'Kostenstelle muss mindestens 2 Zeichen lang sein')
        .max(50, 'Kostenstelle darf maximal 50 Zeichen lang sein')
    ),
    begruendung: z.preprocess(
      (value) => normalizeRequiredText(value),
      z
        .string({ error: 'Begruendung ist erforderlich' })
        .min(20, 'Begruendung muss mindestens 20 Zeichen lang sein')
        .max(2000, 'Begruendung darf maximal 2000 Zeichen lang sein')
    ),
    bemerkung: z.preprocess(
      (value) => normalizeOptionalText(value),
      z.string().max(2000, 'Bemerkung darf maximal 2000 Zeichen lang sein').optional()
    ),
  })
  .refine(
    (values) => !values.enddatum || values.enddatum >= values.startdatum,
    {
      path: ['enddatum'],
      message: 'Enddatum darf nicht vor dem Startdatum liegen',
    }
  )

export const antragCreateSchema = antragBaseSchema
export const antragUpdateSchema = antragBaseSchema

export const antragIdSchema = z.string().cuid()

export const antragStatusSchema = z.object({
  status: z.nativeEnum(AntragStatus),
})

export type AntragCreateValues = z.infer<typeof antragCreateSchema>
export type AntragUpdateValues = z.infer<typeof antragUpdateSchema>
