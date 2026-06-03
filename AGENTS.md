# AGENTS.md – Projektkontext

> Angepasst von: Björn, 2026-06-03
> Coding-Regeln und Stack-Details: siehe KILO_INSTRUCTIONS.md

## Projektbeschreibung

Dieses Projekt ist das Self-Service-Portal des Prototyp-Gesamtsystems für einen digitalen Antrags- und Genehmigungsprozess. Antragstellende erfassen im Portal Anträge und sehen Statusinformationen ein.

Das Self-Service-Portal ist gemäss `docs/project/architecture/gesamtarchitektur.dsl` eine neu gebaute Komponente. In der Zielarchitektur kommuniziert es mit einer separaten Backend API. Für dieses Starter-Kit-Repo und das MVP wird diese Trennung jedoch bewusst nicht umgesetzt: Die lokale Next.js-Backend-Logik im Self-Service-Portal übernimmt Formularverarbeitung, Validierung, Statuslogik und Persistenz direkt über Server Actions, optionale Route Handlers und Prisma/SQLite. Stammdaten und Budgetinformationen über einen ERP-API-Mock sowie Status- und Entscheidbenachrichtigungen über einen E-Mail-Mock bleiben Architekturkontext bzw. spätere Ausbaustufen.

Annahme: Dieses Repo bildet nur das Self-Service-Portal ab. Backend API, Fall-Cockpit, Workflow-/Regel-Worker, ERP-API-Mock und E-Mail-Mock sind Architekturkontext bzw. abhängige Systeme, aber nicht zwingend vollständig in diesem Repo implementiert.

## Stack-Entscheidungen

> Vollständige Stack-Tabelle und Coding-Konventionen: `KILO_INSTRUCTIONS.md`

Kerntechnologien: Next.js 16 · shadcn/ui · Prisma 7 + SQLite · Better Auth · OpenAI/OpenRouter/together.ai · Resend

**Verboten:** Supabase, DaisyUI, LangChain, Prisma Migrations.

## Rollenkonzept

| Rolle | Bezeichnung | Beschreibung |
|---|---|---|
| `admin` | Administrator | Benutzerverwaltung, Systemkonfiguration, volle Rechte |
| `user_applicant` | Antragstellerin | Hauptnutzerin des Self-Service-Portals; kann Anträge erfassen und den Status einsehen |
| `user_reviewer` | Sachbearbeitung / Prüfer | Rolle aus dem Starter-Kit; fachlich eher dem Fall-Cockpit zugeordnet |

Annahme: Die Teamleitung aus der Gesamtarchitektur wird in diesem Starter-Kit-Rollenmodell vorerst nicht als eigene technische Rolle geführt.

## Scope des Prototypen

**Im Scope:**
- Weiterbildungsantrag im Self-Service-Portal mit MVP-Pflichtfeldern erfassen
- Antrag als `ENTWURF` speichern und als `EINGEREICHT` einreichen
- Status eigener Anträge im Self-Service-Portal einsehen
- Rollenbasierter Zugriff für Antragstellende und administrative Demo-Nutzung
- Lokale Next.js-Backend-Logik für Formularverarbeitung, Validierung und Statuslogik
- Berücksichtigung der Architekturabhängigkeiten zu ERP-API-Mock und E-Mail-Mock gemäss DSL
- Lokaler Betrieb via VS Code Port Forwarding

**Ausserhalb des Scope:**
- Fallbearbeitung im Fall-Cockpit
- Automatische Prozessverarbeitung im Workflow-/Regel-Worker
- Mobile-Optimierung
- Produktions-Deployment mit echten Benutzerdaten
- Komplexe externe API-Integrationen

## Testing-Ansatz

- **Vitest** für Unit Tests (Zod-Schemas, Validierungslogik)
- **Playwright** für E2E Tests (Login, CRUD-Flows)
- PIV-Loop: Plan → Implement → **du führst `npm run test` aus** → Document → bei Verdacht Reflect Rules → Commit
  - Unit Tests laufen automatisch als Teil des Validate-Schritts
  - E2E Tests (`npm run test:e2e`) werden nur auf explizite Anfrage ausgeführt (benötigen laufenden Dev-Server)

## Datenmodell

Annahme: Das zentrale Prozessobjekt ist ein Antrag bzw. Fall mit Status. Die Gesamtarchitektur nennt Demo-Anträge, Fallstatus, Kommentare, Audit-Einträge und Testdaten, legt aber keine detaillierten Portal-Felder fest.

Aktuelle fachliche Zielrichtung gemäss PRD `docs/project/prds/self-service-portal-v002.md`:
- `Weiterbildungsantrag` als zentrales Prozessobjekt mit MVP-Feldern `titel`, `anbieter`, `startdatum`, optional `enddatum`, `kostenChf`, `kostenstelle`, `begruendung`, optional `bemerkung`
- Statusmodell mit mindestens `ENTWURF`, `EINGEREICHT`, `IN_RUECKFRAGE`, `GENEHMIGT`, `ABGELEHNT`, `ZURUECKGEZOGEN`

Starter-Kit-Demo-Entitäten wie generischer `Antrag`, `Person`, KI-Demo- oder Upload-Bezüge gelten nur als Übergangsbasis und sollen bei Planung und Umsetzung nicht das fachliche Zielmodell verdrängen.

## Entwicklungsstand

siehe `TASKS.md`

## Team

Demo-Projekt für die Live-Vorführung am Hackathon 2 des CAS Prozessdigitalisierung.
