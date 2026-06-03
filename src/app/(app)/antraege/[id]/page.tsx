import { requireSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { ANTRAG_STATUS_LABEL, ANTRAG_STATUS_VARIANT } from '@/lib/antrag-status'
import { SubmitButton, DeleteButton } from './antrag-actions'
import type { Role } from '@/lib/auth-helpers'
import type { AntragStatus } from '@/generated/prisma/enums'

export default async function AntragDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await requireSession()
  const role = session.user.role as Role

  const antrag = await prisma.antrag.findUnique({
    where: { id },
    include: { ersteller: { select: { name: true, email: true } } },
  })

  if (!antrag) notFound()

  const isOwner = antrag.erstellerId === session.user.id
  const isAdmin = role === 'admin'
  const status = antrag.status as AntragStatus

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/antraege">
            <ChevronLeft className="h-4 w-4" />
            Zurück
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{antrag.titel}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Details</span>
            <Badge variant={ANTRAG_STATUS_VARIANT[status]}>
              {ANTRAG_STATUS_LABEL[status]}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Anbieter</p>
              <p className="font-medium">{antrag.anbieter}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Kostenstelle</p>
              <p className="font-medium">{antrag.kostenstelle}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Startdatum</p>
              <p className="font-medium">{format(new Date(antrag.startdatum), 'dd.MM.yyyy', { locale: de })}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Enddatum</p>
              <p className="font-medium">
                {antrag.enddatum ? format(new Date(antrag.enddatum), 'dd.MM.yyyy', { locale: de }) : 'Offen'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Kosten in CHF</p>
              <p className="font-medium">{antrag.kostenChf.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Ersteller</p>
              <p className="font-medium">{antrag.ersteller.name}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Begruendung</p>
            <p className="mt-1 whitespace-pre-wrap text-foreground">{antrag.begruendung}</p>
          </div>
          {antrag.bemerkung && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Bemerkung</p>
              <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{antrag.bemerkung}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            <span>Ersteller</span>
            <span>{antrag.ersteller.email}</span>
            <span>Erstellt am</span>
            <span>{format(new Date(antrag.erstelltAm), 'dd.MM.yyyy HH:mm', { locale: de })}</span>
            <span>Aktualisiert</span>
            <span>{format(new Date(antrag.aktualisiertAm), 'dd.MM.yyyy HH:mm', { locale: de })}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {status === 'ENTWURF' && (isOwner || isAdmin) && (
          <SubmitButton id={antrag.id} />
        )}

        {status === 'ENTWURF' && (isOwner || isAdmin) && (
          <Button asChild variant="outline">
            <Link href={`/antraege/${antrag.id}/bearbeiten`}>Bearbeiten</Link>
          </Button>
        )}
        {(isAdmin || (isOwner && status === 'ENTWURF')) && (
          <DeleteButton id={antrag.id} />
        )}
      </div>
    </div>
  )
}
