import { AntragStatus } from '@/generated/prisma/enums'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export const ANTRAG_STATUS_LABEL: Record<AntragStatus, string> = {
  ENTWURF: 'Entwurf',
  EINGEREICHT: 'Eingereicht',
  IN_RUECKFRAGE: 'In Rueckfrage',
  GENEHMIGT: 'Genehmigt',
  ABGELEHNT: 'Abgelehnt',
  ZURUECKGEZOGEN: 'Zurueckgezogen',
}

export const ANTRAG_STATUS_VARIANT: Record<AntragStatus, BadgeVariant> = {
  ENTWURF: 'secondary',
  EINGEREICHT: 'default',
  IN_RUECKFRAGE: 'secondary',
  GENEHMIGT: 'outline',
  ABGELEHNT: 'destructive',
  ZURUECKGEZOGEN: 'outline',
}

export const ANTRAG_STATUS_TRANSITIONS: Record<AntragStatus, AntragStatus[]> = {
  ENTWURF: ['EINGEREICHT'],
  EINGEREICHT: ['IN_RUECKFRAGE', 'GENEHMIGT', 'ABGELEHNT'],
  IN_RUECKFRAGE: ['EINGEREICHT', 'GENEHMIGT', 'ABGELEHNT', 'ZURUECKGEZOGEN'],
  GENEHMIGT: [],
  ABGELEHNT: [],
  ZURUECKGEZOGEN: [],
}
