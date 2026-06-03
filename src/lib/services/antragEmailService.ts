import { prisma } from '@/lib/prisma'

export interface IncomingEmail {
  from: string
  subject: string
  text: string
  receivedAt: Date
}

export interface ProcessResult {
  success: boolean
  antragId?: string
  error?: string
}

export function formatNotizEintrag(email: IncomingEmail): string {
  const datum = email.receivedAt.toLocaleString('de-CH')
  return `\n---\n[${datum}] E-Mail von ${email.from}:\nBetreff: ${email.subject}\n\n${email.text}`
}

export function extrahiereAntragId(subject: string): string | null {
  const match = subject.match(/\[([a-z0-9]{20,30})\]/) || subject.match(/antrag[:\s]+([a-z0-9]{20,30})/i)
  return match?.[1] ?? null
}

export async function processIncomingEmail(email: IncomingEmail): Promise<ProcessResult> {
  const antragId = extrahiereAntragId(email.subject)
  if (!antragId) {
    return { success: false, error: 'Keine Antrag-ID im Betreff gefunden' }
  }

  const antrag = await prisma.antrag.findUnique({ where: { id: antragId } })
  if (!antrag) {
    return { success: false, error: `Antrag ${antragId} nicht gefunden` }
  }

  // Das MVP-Datenmodell fuehrt keinen Kommunikationsverlauf mehr auf dem Antrag.
  formatNotizEintrag(email)
  return {
    success: false,
    antragId,
    error: 'E-Mail-Verarbeitung ist im MVP des Self-Service-Portals nicht aktiv.',
  }
}
