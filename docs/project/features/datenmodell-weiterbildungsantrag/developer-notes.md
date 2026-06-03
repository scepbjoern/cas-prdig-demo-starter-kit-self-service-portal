# Developer Notes: Datenmodell Weiterbildungsantrag

## Überblick

Dieses Feature hebt das bisher generische Starter-Kit-Modell `Antrag` fachlich auf einen Weiterbildungsantrag an. Neben Prisma und Seed wurden auch Zod-Validierung, Status-Helper, Server Actions, Route Handlers, Formular- und Anzeige-Pfade sowie Unit-Tests auf den neuen Stand gebracht.

## Referenzen

- Plan: `docs/project/features/datenmodell-weiterbildungsantrag/plan-v002.md`
- PRD: `docs/project/prds/self-service-portal-v002.md`
- Relevante Guides: `KILO_INSTRUCTIONS.md`, `AGENTS.md`

## Betroffene Dateien

| Datei | Zweck / Änderung |
|---|---|
| `prisma/schema.prisma` | `AntragStatus` erweitert und `Antrag` auf Weiterbildungsfelder umgestellt |
| `prisma/seed.ts` | Fiktive Seed-Daten fuer Weiterbildungsantraege |
| `src/lib/schemas/antrag.ts` | Zentrale Normalisierung und Zod-Validierung fuer Formular- und API-Daten |
| `src/lib/antrag-status.ts` | Labels, Badge-Varianten und Transitionen fuer das neue Enum |
| `src/app/(app)/antraege/actions.ts` | Server Actions fuer Create, Update, Submit, Delete mit neuem Feldmodell |
| `src/components/antraege/antrag-form.tsx` | Formular fuer Titel, Anbieter, Datum, Kosten, Kostenstelle, Begruendung, Bemerkung |
| `src/app/(app)/antraege/neu/page.tsx` | Erstellseite fuer Weiterbildungsantraege |
| `src/app/(app)/antraege/[id]/bearbeiten/page.tsx` | Default-Werte und Bearbeiten-Flow fuer das neue Modell |
| `src/app/(app)/antraege/page.tsx` | Listenansicht mit Anbieter und Startdatum |
| `src/app/(app)/antraege/[id]/page.tsx` | Detailansicht ohne alte Demo-Felder und ohne Entscheidungs-UI |
| `src/app/(app)/antraege/[id]/antrag-actions.tsx` | Nur noch Submit- und Delete-Aktionen im MVP-Flow |
| `src/app/api/antraege/route.ts` | API-Create/List mit derselben Parsing-Logik wie Server Actions |
| `src/app/api/antraege/[id]/route.ts` | API-Detail/Update/Delete mit neuem Feldmodell |
| `src/lib/services/antragEmailService.ts` | MVP-konforme Nicht-aktiv-Rueckgabe statt Schreiben in `notizen` |
| `src/app/(app)/page.tsx` | Dashboard-Texte fuer Weiterbildungsantraege |
| `__tests__/unit/schemas/antrag.test.ts` | Unit-Tests fuer Feldregeln und Normalisierung |
| `__tests__/unit/antrag-status.test.ts` | Unit-Tests fuer alle Statuswerte und Transitionen |
| `__tests__/unit/services/antragEmailService.test.ts` | Test fuer kontrollierte MVP-Rueckgabe des E-Mail-Service |

## Architektur und Datenfluss

Das Feature bleibt im bestehenden Starter-Kit-Muster: UI-Formular in `src/components/antraege/antrag-form.tsx`, schreibende DB-Operationen ueber Server Actions in `src/app/(app)/antraege/actions.ts`, optionale API-Grenze ueber Route Handlers in `src/app/api/antraege/**/route.ts` und Persistenz ueber Prisma/SQLite.

Wichtig ist die zentrale Parsing-Schicht in [antrag.ts](/Users/bjoer/Documents/repos/cas-prdig-demo-starter-kit-self-service-portal/src/lib/schemas/antrag.ts). `normalizeAntragInput(...)` vereinheitlicht rohe FormData-/JSON-Werte, bevor Zod validiert. Dadurch verwenden Server Actions und Route Handlers dieselben Feldregeln fuer Texte, optionale Werte, Datum und `kostenChf`.

## Rollen und Berechtigungen

- `user_applicant` darf eigene Antraege erstellen, als `ENTWURF` speichern, bearbeiten und spaeter einreichen.
- `admin` darf alle Antraege lesen und eigene Demo-Antraege anlegen, aber im MVP keine fremden Bearbeitungs- oder Entscheidungsaktionen ausfuehren.
- `user_reviewer` bleibt technisch vorhanden, bekommt im Portal-MVP aber keine aktive Entscheidungs-UI.

Die Rollenpruefung laeuft weiter ueber `requireSession`, `requireRole` und `getSession` aus `src/lib/auth-helpers.ts`.

## Datenmodell und Persistenz

Das Prisma-Modell heisst technisch weiterhin `Antrag`, bildet fachlich aber einen Weiterbildungsantrag ab. Relevante Felder:

- `titel`
- `anbieter`
- `startdatum`
- `enddatum?`
- `kostenChf`
- `kostenstelle`
- `begruendung`
- `bemerkung?`
- `status`

Das Status-Enum umfasst:

- `ENTWURF`
- `EINGEREICHT`
- `IN_RUECKFRAGE`
- `GENEHMIGT`
- `ABGELEHNT`
- `ZURUECKGEZOGEN`

Fuer dieses Feature wurden auch Seed-Daten angepasst. Nach Schema-Aenderungen gilt weiterhin die Projektregel:

1. `npx prisma generate`
2. `npm run db:reset`

Prisma Migrations werden nicht verwendet.

## Validierung und Tests

| Prüfung | Ergebnis / Hinweis |
|---|---|
| `npx prisma generate` | Erfolgreich |
| `npm run db:reset` | Erfolgreich, Seed auf fiktive Weiterbildungsantraege umgestellt |
| Manuelle Formularpruefung | Neuer Antrag konnte als `ENTWURF` gespeichert werden |
| Manuelle Smoke-Checks | Detail, Bearbeiten, Liste und Dashboard laufen mit dem neuen Modell |
| `npm run test` | Erfolgreich, 63 Tests gruen |
| `npm run build` | Erfolgreich |

## Betriebs- und Setup-Hinweise

- Fuer Demo- oder Lokalbetrieb sollten Seed-Daten ueber `npm run db:reset` neu geladen werden, wenn sich das Schema geaendert hat.
- Better-Auth-Warnungen zu `BETTER_AUTH_SECRET` oder `BETTER_AUTH_URL` wurden waehrend der Umsetzung bewusst nicht als Feature-Blocker behandelt.
- Nicht relevant: Es wurden keine neuen ENV-Variablen oder externen Provider fuer dieses Feature eingefuehrt.

## Wartungshinweise

- Das Formular arbeitet im Browser mit String-Werten und serialisiert vor dem Submit wieder in `FormData`. Die serverseitige Fachvalidierung bleibt trotzdem in `src/lib/schemas/antrag.ts`.
- `antragUpdateSchema` ist absichtlich vollstaendig statt partiell, damit Formular- und API-Pfade denselben Feldsatz benutzen.
- Der E-Mail-Service bleibt technisch vorhanden, fuehrt im MVP aber keine Mutation mehr auf dem Antrag aus.
- Die Route `src/app/(app)/antraege/[id]/page.tsx` ist bereits auf das neue Feldmodell gezogen; weitere Folgefeatures sollten dort keine alten Demo-Felder wieder einfuehren.

## Bekannte Einschränkungen

- Nicht relevant fuer dieses Feature: Es gibt keine offenen Build- oder Test-Blocker.
- Weiterhin nicht umgesetzt sind Medium-/Extended-Themen wie Rueckfragen, Zurueckziehen, Benachrichtigungen oder ERP-Budgetdaten.
