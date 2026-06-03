// Seed-Datei: Erstellt Demo-Nutzer und Testdaten
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { auth } from '../src/lib/auth'
 
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Lösche bestehende Daten...')
  await prisma.antrag.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('Erstelle Benutzer...')
  // Admin-Benutzer
  await auth.api.signUpEmail({
    body: { email: 'admin@example.com', password: 'a', name: 'Admin Benutzer' }
  })
  await prisma.user.update({
    where: { email: 'admin@example.com' },
    data: { role: 'admin' }
  })

  // Antragsteller
  await auth.api.signUpEmail({
    body: { email: 'applicant@example.com', password: 'a', name: 'Test Antragsteller' }
  })
  // role bleibt 'user_applicant' (Default)

  // Prüfer
  await auth.api.signUpEmail({
    body: { email: 'reviewer@example.com', password: 'a', name: 'Test Prüfer' }
  })
  await prisma.user.update({
    where: { email: 'reviewer@example.com' },
    data: { role: 'user_reviewer' }
  })

  const applicant = await prisma.user.findUniqueOrThrow({ where: { email: 'applicant@example.com' } })
  console.log('Erstelle Demo-Anträge...')
  await prisma.antrag.createMany({
    data: [
      {
        titel: 'CAS Prozessdigitalisierung',
        anbieter: 'ZHAW School of Management and Law',
        startdatum: new Date('2026-09-01'),
        enddatum: new Date('2026-12-15'),
        kostenChf: 5900,
        kostenstelle: 'WB-1000',
        begruendung:
          'Die Weiterbildung staerkt unsere Faehigkeiten in Prozessanalyse, Automatisierung und digitaler Zusammenarbeit.',
        bemerkung: 'Unterlagen fuer die Demo sind bereits vorbereitet.',
        status: 'EINGEREICHT',
        erstellerId: applicant.id,
      },
      {
        titel: 'Lean Six Sigma Green Belt',
        anbieter: 'Akademie Nordstern',
        startdatum: new Date('2026-10-10'),
        enddatum: new Date('2027-01-20'),
        kostenChf: 3200,
        kostenstelle: 'OPS-204',
        begruendung:
          'Die Weiterbildung hilft dabei, Prozessqualitaet messbar zu verbessern und Verschwendung im Tagesgeschaeft zu reduzieren.',
        bemerkung: undefined,
        status: 'GENEHMIGT',
        erstellerId: applicant.id,
      },
      {
        titel: 'Workshop Service Design Grundlagen',
        anbieter: 'Institut Morgenrot',
        startdatum: new Date('2026-11-05'),
        enddatum: undefined,
        kostenChf: 780,
        kostenstelle: 'INNO-315',
        begruendung:
          'Der Workshop unterstuetzt die nutzerzentrierte Weiterentwicklung des Self-Service-Portals und verbessert unsere Interviewmethoden.',
        bemerkung: 'Termin ist reserviert, Einreichung folgt nach letzter Ruecksprache.',
        status: 'ENTWURF',
        erstellerId: applicant.id,
      },
    ]
  })

  console.log('✓ Seed abgeschlossen')
  console.log('  Admin:      admin@example.com / a')
  console.log('  Applicant:  applicant@example.com / a')
  console.log('  Reviewer:   reviewer@example.com / a')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
