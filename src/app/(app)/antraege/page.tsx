import { requireSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ANTRAG_STATUS_LABEL, ANTRAG_STATUS_VARIANT, ANTRAG_STATUS_MVP } from '@/lib/antrag-status'
import { AntragStatus } from '@/generated/prisma/enums'
import Link from 'next/link'
import Form from 'next/form'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { X } from 'lucide-react'
import type { Role } from '@/lib/auth-helpers'

export default async function AntraegePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; suche?: string }>
}) {
  const session = await requireSession()
  const role = session.user.role as Role

  const { status, suche } = await searchParams

  const validStatus = status && Object.values(AntragStatus).includes(status as AntragStatus)
    ? (status as AntragStatus)
    : undefined

  const validSuche = suche && suche.trim() !== '' ? suche.trim() : undefined

  // Aufbau der Prisma-Query
  const where: any = {}

  if (role === 'user_applicant') {
    where.erstellerId = session.user.id
  }

  if (validStatus) {
    where.status = validStatus
  }

  if (validSuche) {
    where.titel = {
      contains: validSuche,
    }
  }

  const antraege = await prisma.antrag.findMany({
    where,
    include: { ersteller: { select: { name: true } } },
    orderBy: { erstelltAm: 'desc' },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Weiterbildungsantraege</h1>
        {(role === 'user_applicant' || role === 'admin') && (
          <Button asChild>
            <Link href="/antraege/neu">Neuer Antrag</Link>
          </Button>
        )}
      </div>

      {/* Filter und Suche */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-2 border-b border-border/40 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mr-1">Status:</span>
          <Button
            asChild
            variant={!validStatus ? 'default' : 'outline'}
            size="sm"
            className="h-8 rounded-full"
          >
            <Link href={{ pathname: '/antraege', query: validSuche ? { suche: validSuche } : {} }}>
              Alle
            </Link>
          </Button>
          {ANTRAG_STATUS_MVP.map((s) => {
            const isActive = validStatus === s
            return (
              <Button
                key={s}
                asChild
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className="h-8 rounded-full"
              >
                <Link
                  href={{
                    pathname: '/antraege',
                    query: {
                      status: s,
                      ...(validSuche ? { suche: validSuche } : {}),
                    },
                  }}
                >
                  {ANTRAG_STATUS_LABEL[s]}
                </Link>
              </Button>
            )
          })}
        </div>

        <Form action="/antraege" className="flex items-center gap-2 w-full md:w-auto max-w-sm">
          {validStatus && <input type="hidden" name="status" value={validStatus} />}
          <Input
            type="text"
            name="suche"
            placeholder="Titel suchen..."
            defaultValue={validSuche || ''}
            className="h-8"
          />
          <Button type="submit" size="sm" className="h-8">
            Suchen
          </Button>
        </Form>
      </div>

      {/* Aktive Filter visualisieren */}
      {(validStatus || validSuche) && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground bg-muted/40 p-2 rounded-lg border">
          <span>Gefiltert nach:</span>
          {validStatus && (
            <Badge variant="secondary" className="gap-1 rounded-sm px-1.5 py-0.5">
              Status: {ANTRAG_STATUS_LABEL[validStatus]}
            </Badge>
          )}
          {validSuche && (
            <Badge variant="secondary" className="gap-1 rounded-sm px-1.5 py-0.5">
              Suche: &quot;{validSuche}&quot;
            </Badge>
          )}
          <Button asChild variant="ghost" size="sm" className="h-6 px-2 text-xs ml-auto">
            <Link href="/antraege" className="flex items-center gap-1">
              <X className="h-3 w-3" />
              Zurücksetzen
            </Link>
          </Button>
        </div>
      )}

      {antraege.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          {validStatus || validSuche ? 'Keine Anträge gefunden.' : 'Noch keine Anträge vorhanden.'}
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Anbieter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Kosten</TableHead>
                <TableHead>Startdatum</TableHead>
                <TableHead>Erstellt am</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {antraege.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.titel}</TableCell>
                  <TableCell>{a.anbieter}</TableCell>
                  <TableCell>
                    <Badge variant={ANTRAG_STATUS_VARIANT[a.status as AntragStatus]}>
                      {ANTRAG_STATUS_LABEL[a.status as AntragStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell>{a.kostenChf.toFixed(2)} CHF</TableCell>
                  <TableCell>
                    {format(new Date(a.startdatum), 'dd.MM.yyyy', { locale: de })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(a.erstelltAm), 'dd.MM.yyyy', { locale: de })}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/antraege/${a.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
