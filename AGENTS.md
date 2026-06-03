# AGENTS.md – Projektkontext

> Angepasst von: Björn, 2026-06-03
> Coding-Regeln und Stack-Details: siehe KILO_INSTRUCTIONS.md

## Projektbeschreibung

Dieses Projekt ist das Self-Service-Portal des Prototyp-Gesamtsystems für einen digitalen Antrags- und Genehmigungsprozess. Antragstellende erfassen im Portal Anträge und sehen Statusinformationen ein.

Das Self-Service-Portal ist gemäss `docs/project/architecture/gesamtarchitektur.dsl` eine neu gebaute Komponente. Es erstellt Anträge über die Backend API und ruft dort Statusinformationen ab. Stammdaten und Budgetinformationen werden im Gesamtsystem über einen ERP-API-Mock gelesen; Status- und Entscheidbenachrichtigungen werden über einen E-Mail-Mock abgebildet.

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
- Antrag im Self-Service-Portal erfassen
- Antragsstatus im Self-Service-Portal einsehen
- Rollenbasierter Zugriff für Antragstellende und administrative Demo-Nutzung
- Anbindung an die Backend API für Antragserstellung und Statusabfrage
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

Demo-Entitäten im Starter-Kit (als Muster, anpassen/ersetzen):
- `Antrag`: id, titel, beschreibung, status (ENTWURF/EINGEREICHT/GENEHMIGT/ABGELEHNT), ersteller
- `Person`: id, vorname, nachname, email, telefon, adresse

## Entwicklungsstand

siehe `TASKS.md`

## Team

Demo-Projekt für die Live-Vorführung am Hackathon 2 des CAS Prozessdigitalisierung.
