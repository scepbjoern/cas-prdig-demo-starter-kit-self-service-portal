# Feature Plan: Antrag erfassen, als Entwurf speichern und einreichen

> Zielpfad fuer den finalen Plan (nach Plan-Mode-Ende):
> `docs/project/features/antrag-erfassen-und-einreichen/plan-v001.md`
>
> Diese Plan-Mode-Datei dient als Reviewer- und Schreibvorlage. Sie wird beim
> tatsaechlichen Ausfuehren des `/plan-feature`-Skills nach Plan-Mode in die
> obige Zielpfad-Struktur kopiert und `TASKS.md` entsprechend aktualisiert.

## Status

**Feature-Status:** planned  
**Erstellt:** 2026-06-04  
**Plan-Version:** v001  
**Quelle:** User Request `/plan-feature Antrag erfassen, als Entwurf speichern und einreichen`, PRD `docs/project/prds/self-service-portal-v002.md` (US-1 bis US-4, MVP-Prioritaet 2), Foundation-Feature `docs/project/features/datenmodell-weiterbildungsantrag/plan-v002.md`  
**Confidence Score:** 8/10 - Datenmodell, Zod-Schema, Form-Komponente und Server Actions existieren bereits aus dem Foundation-Feature. Das Feature ist primaer eine UX- und Robustheits-Verfeinerung mit klarem Scope. Punkt fuer mittlere Unsicherheit: E2E-Tests gegen Better-Auth-Login bringen Setup-Aufwand und sind in diesem Repo noch nicht stark erprobt.

## Feature Metadata

| Feld | Wert |
|---|---|
| Feature-Typ | Enhancement (auf Foundation aus `datenmodell-weiterbildungsantrag`) |
| Plan-Version | v001 |
| Komplexitaet | Medium |
| Primaer betroffene Systeme | UI (Formular, Dialoge) / Server Actions / Tests (Vitest + Playwright) |
| Abhaengigkeiten | Prisma 7 + SQLite (bereits aktuell), Better Auth, Zod, React Hook Form, sonner, shadcn/ui Dialog; keine neuen npm-Pakete; keine Prisma-Schema-Aenderung |

## Plan-Aenderungshistorie

| Version | Datum | Anlass | Kurzbeschreibung |
|---|---|---|---|
| v001 | 2026-06-04 | Initiale Planung | Erster Feature-Plan fuer den UX-Fluss "Erfassen, als Entwurf speichern und einreichen" inklusive Re-Validierung beim Einreichen und Playwright-E2E |

Bei spaeteren Aenderungen ergaenzen `/integrate-feature-plan-review` oder `/update-feature-plan` neue Zeilen, ohne alte Eintraege zu entfernen.

## Feature Description

Dieses Feature liefert den fachlichen Kern-Flow des Self-Service-Portals: Eine Antragstellerin kann einen Weiterbildungsantrag erfassen, ihn entweder als Entwurf speichern oder direkt verbindlich einreichen. Aus einem bestehenden Entwurf heraus kann sie ihn weiter bearbeiten und am Ende einreichen. Beim Einreichen wird der Antrag konsistent gegen das vollstaendige Zod-Schema revalidiert, bevor der Status auf `EINGEREICHT` gesetzt wird.

Das Feature baut bewusst auf der bereits umgesetzten Foundation (`datenmodell-weiterbildungsantrag` v002) auf. Es ergaenzt vor allem den Direkt-Einreichen-Pfad inklusive Bestaetigungsdialog, haertet die `submitAntrag`-Server-Action durch eine Re-Validierung und sichert das Verhalten ueber Unit- und E2E-Tests ab.

## User Story

```text
Als Antragstellerin
moechte ich einen Weiterbildungsantrag erfassen, als Entwurf speichern oder direkt einreichen koennen,
damit ich meine Weiterbildung strukturiert beantragen und den Antrag ohne Umweg in den Pruefungsprozess geben kann.
```

Erweiterte Nutzersicht:

- US-1: Als Antragstellerin moechte ich einen Weiterbildungsantrag erfassen koennen.
- US-2: Als Antragstellerin moechte ich klare Pflichtfeld-Validierung und Fehlermeldungen sehen.
- US-3: Als Antragstellerin moechte ich meinen Antrag als Entwurf speichern koennen.
- US-4: Als Antragstellerin moechte ich meinen Antrag verbindlich einreichen koennen.

## Problem Statement

Aktuell ist im Repo zwar das Datenmodell vollstaendig und das Formular speichert einen Antrag als `ENTWURF`. Es fehlen aber drei MVP-relevante Aspekte:

1. **Direkter Einreichen-Pfad aus dem Formular:** Antragstellende muessen aktuell erst speichern, dann zur Detailseite navigieren und dort separat einreichen. Das ist ein unnoetiger Umweg fuer den haeufigen Fall "vollstaendiges Erfassen".
2. **Konsistente Bestaetigung beim verbindlichen Einreichen:** Der Einreichen-Button auf der Detailseite hat bereits einen Bestaetigungsdialog. Ein moeglicher Einreichen-Pfad aus dem Formular braucht denselben Schutz vor versehentlichem Klick.
3. **Defensive Re-Validierung beim Einreichen:** Die heutige `submitAntrag` prueft nur den Status `ENTWURF`, nicht ob die Felddaten weiterhin gegen das Zod-Schema gueltig sind. Bei zukuenftigen Schema-Verschaerfungen oder bei direkten DB-/API-Eingriffen kann so ein invalider Antrag den Status `EINGEREICHT` erreichen.

## Solution Statement

Das Feature erweitert den bestehenden Form-Flow um einen zweiten primaeren Aktionsbutton "Speichern und einreichen", der ueber einen Bestaetigungsdialog laeuft und am Ende den Antrag in einem Schritt erstellt (Neuanlegen) bzw. aktualisiert (Bearbeiten) und dann verbindlich einreicht. Die Server Actions `createAntrag` und `updateAntrag` werden um einen optionalen Submit-Flag-Pfad ergaenzt; das Formular ruft je nach Button genau eine Action mit dem passenden Modus auf. `submitAntrag` revalidiert den persistierten Antrag gegen `antragCreateSchema`, bevor der Statuswechsel passiert. Unit-Tests sichern die neue Schemalogik und Rollenregeln ab, ein E2E-Test deckt den End-to-End-Fluss als Antragstellerin ab.

## Scope

### Im Scope

- Zwei Aktionsbuttons im `AntragForm`: "Entwurf speichern" und "Speichern und einreichen" (jeweils im Create- und Edit-Modus)
- Bestaetigungsdialog vor dem verbindlichen Einreichen aus dem Formular
- Server Actions `createAntrag` und `updateAntrag` so erweitern, dass sie einen optionalen Statuswechsel zu `EINGEREICHT` als atomare Operation unterstuetzen
- Server Action `submitAntrag` haerten: Antrag vor Statuswechsel gegen `antragCreateSchema` revalidieren; bei Fehlschlag bleibt der Antrag im Status `ENTWURF` und es wird eine sprechende Fehlermeldung geworfen
- Toast-Feedback fuer Erfolg ("Antrag eingereicht") und Fehler (Validierungsfehler beim Direkt-Einreichen, Fehler beim Statuswechsel)
- Listenansicht `/antraege` muss eingereichte Antraege weiterhin korrekt mit Statusbadge zeigen (Regressionscheck, keine neue UI-Logik)
- Unit-Tests fuer die neue Re-Validierung in `submitAntrag` und die Rollenregeln des erweiterten `createAntrag`/`updateAntrag`-Pfades (soweit ohne Prisma-Mock sinnvoll moeglich; sonst ueber Schema- und Status-Helper-Tests indirekt absichern)
- Erweiterung der bestehenden Vitest-Tests fuer `antragCreateSchema`, falls neue Edge Cases zum Direkt-Einreichen-Fluss auftauchen
- Playwright-E2E in `e2e/antraege.spec.ts`: Antragstellerin loggt sich ein, erfasst Antrag, klickt "Speichern und einreichen", bestaetigt im Dialog und sieht den Antrag mit Status `Eingereicht` in der Liste

### Nicht im Scope

- Reviewer-/Admin-Entscheidungs-UI (in `datenmodell-weiterbildungsantrag` bewusst aus dem MVP-Portalfluss entfernt)
- Statuswechsel `IN_RUECKFRAGE`, `GENEHMIGT`, `ABGELEHNT`, `ZURUECKGEZOGEN`
- E-Mail-Benachrichtigungen beim Statuswechsel (Extended laut PRD)
- Kommentare/Rueckfragen (Medium laut PRD)
- Neue Route Handler fuer Submit (PRD: nur wenn ein API-Konsument das wirklich braucht)
- Aenderungen am Prisma-Schema oder am Datenmodell
- Optimierung der Listenansicht oder Detailansicht ueber den Regressionscheck hinaus
- Auto-Save fuer Entwuerfe; Mobile-Optimierung; File-Upload

## Rollen und Berechtigungen

Betroffene Rollen:

- `user_applicant`: darf eigene Antraege erstellen, als Entwurf speichern, eigene Entwuerfe bearbeiten und eigene Antraege einreichen
- `admin`: darf eigene Demo-Antraege erstellen, als Entwurf speichern, eigene Entwuerfe bearbeiten und eigene Antraege einreichen; darf laut PRD keine fremden Antraege bearbeiten oder einreichen
- `user_reviewer`: hat im MVP-Portalfluss keinen aktiven Zugang zu Erstellen/Einreichen; bestehende Routen-Logik (Detail darf gelesen werden, falls Berechtigung vorhanden) wird nicht veraendert

Schutzregeln:

- Direkt-Einreichen aus dem Formular darf nur funktionieren, wenn der eingeloggte Nutzer einer der erlaubten Rollen entspricht und (im Edit-Modus) Eigentuemer ist bzw. `admin` mit eigenem Antrag
- Im Edit-Modus muss der Antrag im Status `ENTWURF` sein, sonst ist die Direkt-Einreichen-Option nicht aufrufbar (Detailseite leitet bereits ueber `redirect` aus dem Bearbeiten-Flow weg)
- Auch Admins duerfen ueber diesen Pfad keine fremden Antraege einreichen; die bestehende `submitAntrag`-Pruefung `antrag.erstellerId !== session.user.id && session.user.role !== 'admin'` ist heute zu locker fuer den PRD-Scope. Sie wird im Rahmen dieses Features so geschaerft, dass nur der Ersteller selbst einreichen darf. Admin-Sicht (Lesen aller Antraege) bleibt unveraendert.

> Hinweis: Diese Schaerfung wird im Plan explizit als kleine Folge-Aenderung markiert, weil sie aus PRD v002 abgeleitet ist und kein PRD-Widerspruch entsteht.

## Context References

### Pflichtlektuere vor Umsetzung

- `docs/project/prds/self-service-portal-v002.md` - Warum: autoritative Quelle fuer User Stories US-1 bis US-4, Statusmodell, Pflichtfelder, Rollenregeln, MVP-Scope und Erfolgskriterien
- `docs/project/features/datenmodell-weiterbildungsantrag/plan-v002.md` - Warum: Vorgaengerfeature, definiert das aktuelle Modell, Zod-Schema, Statuslogik und die bewusst entfernte Reviewer-/Admin-Entscheidungs-UI
- `AGENTS.md` und `KILO_INSTRUCTIONS.md` - Warum: Stack-Regeln, Server-Actions-Konvention, Sprache (Deutsch), `getSession`/`requireSession`-Regeln und Anti-Patterns
- `prisma/schema.prisma` - Warum: bestaetigt, dass keine Schema-Aenderung noetig ist; Default `status = ENTWURF` bleibt fuer den Direkt-Einreichen-Fall relevant
- `src/lib/schemas/antrag.ts` - Warum: `antragCreateSchema`, `antragUpdateSchema`, `normalizeAntragInput` und Datumsregeln werden in der erweiterten `submitAntrag`-Action wiederverwendet
- `src/lib/antrag-status.ts` - Warum: `ANTRAG_STATUS_TRANSITIONS` muss konsistent gehalten werden; der Direkt-Einreichen-Fluss schreibt von `ENTWURF` direkt zu `EINGEREICHT`
- `src/app/(app)/antraege/actions.ts` - Warum: `createAntrag`, `updateAntrag`, `submitAntrag` sind die Hauptintegrationspunkte
- `src/components/antraege/antrag-form.tsx` - Warum: UI-Erweiterung um Submit-Button und Dialog
- `src/app/(app)/antraege/neu/page.tsx` - Warum: Create-Flow; wird ein Pass-through fuer die zwei Aktionen
- `src/app/(app)/antraege/[id]/bearbeiten/page.tsx` - Warum: Edit-Flow; muss zwei Aktionen erlauben und nach Einreichen sauber auf Detailseite umleiten
- `src/app/(app)/antraege/[id]/antrag-actions.tsx` - Warum: bestehender Detail-Einreichen-Dialog ist visuelles und funktionales Vorbild fuer den Form-Dialog
- `src/app/(app)/antraege/[id]/page.tsx` - Warum: nach Direkt-Einreichen-Pfad zeigt die Detailseite den Status; sie ist Validierungsanker
- `src/app/(app)/antraege/page.tsx` - Warum: Listenansicht (Regressionscheck nach Statuswechsel)
- `__tests__/unit/schemas/antrag.test.ts` - Warum: Pattern fuer Zod-Schemastests
- `__tests__/unit/antrag-status.test.ts` - Warum: Pattern fuer Status- und Uebergangstests
- `e2e/antraege.spec.ts` - Warum: bestehender E2E-Einstiegspunkt fuer Antrag-Flows; wird erweitert
- `e2e/login.spec.ts` - Warum: Login-Pattern fuer Playwright (Testlogin `applicant@example.com` / `a`)
- `playwright.config.ts` (sofern vorhanden) - Warum: Konfiguration, Base-URL, Dev-Server-Startverhalten

### Relevante Dokumentation

- [Next.js App Router - Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - Warum: bestaetigt die Erweiterung bestehender Server Actions und den Umgang mit FormData
- [Next.js redirect()](https://nextjs.org/docs/app/api-reference/functions/redirect) - Warum: Direkt-Einreichen-Pfad nutzt `redirect` nach dem Statuswechsel; Verhalten innerhalb von `try/catch` (NEXT_REDIRECT) ist bereits im Formular abgefangen
- [React Hook Form - handleSubmit](https://react-hook-form.com/docs/useform/handlesubmit) - Warum: zwei Submit-Pfade mit derselben Form-Instanz erfordern saubere Pattern (typischerweise via Custom-Handler oder `form.handleSubmit(callback)(event)` pro Button)
- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog) - Warum: Bestaetigungsdialog fuer Direkt-Einreichen; ist im Repo bereits etabliert (`DialogTrigger`, `DialogContent`)
- [Playwright - Auth in Tests](https://playwright.dev/docs/auth) - Warum: empfohlene Patterns fuer Login per Form vs. Storage State; im Repo wird heute Login pro Test gemacht (`e2e/login.spec.ts`); neuer Test spiegelt das

## Codebase Intelligence

### Projektstruktur und Architektur

Das Feature lebt vollstaendig in der bereits etablierten Antraege-Domaene unter `src/app/(app)/antraege/`. Server Actions liegen in `actions.ts`, das Formular als Client Component in `src/components/antraege/antrag-form.tsx`, Zod-Schemas in `src/lib/schemas/antrag.ts`, Statuslogik in `src/lib/antrag-status.ts`. Authentifizierung und Rollenpruefung laufen ueber `requireSession`/`requireRole` aus `src/lib/auth-helpers.ts`. Es entstehen keine neuen Verzeichnisse.

### Patterns to Follow

- Naming: deutsche Fachbegriffe (`einreichen`, `entwurf`, `antrag`); Server Actions wie bisher als async Functions mit `'use server'` direkt in `actions.ts`
- Datei-Organisation: bestehende `antraege/`-Struktur evolutionaer erweitern, keine neuen parallelen Ordner
- Fehlerbehandlung: in Server Actions `throw new Error('...')`, im Client `try/catch` mit `sonner` Toasts; `NEXT_REDIRECT`-Fehler wie heute durchreichen
- UI/shadcn: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogFooter`, `Button`-Varianten konsistent zu `src/app/(app)/antraege/[id]/antrag-actions.tsx` einsetzen
- Auth/Rollen: `requireRole(['user_applicant', 'admin'])` wie in `createAntrag`; im Submit-Pfad zusaetzlich Eigentuemerpruefung
- Form-Submit-Strategie: React Hook Form mit zwei Buttons; Variante "Direkt einreichen" laeuft entweder ueber ein zweites Action-Prop oder ueber ein verstecktes Form-Field `intent: 'save' | 'submit'`. Bevorzugt: zwei Action-Props (`onSaveDraft`, `onSubmitFinal`) - klarere Typen, weniger Magic-Strings
- Prisma: kein Schemawechsel; Status-Update geschieht im selben Transaction-/Update-Schritt wie das Create/Update, um Inkonsistenzen zu vermeiden
- Server Action mit Submit-Flag: signiert als z.B. `createAntrag(formData: FormData, options?: { andSubmit?: boolean })` - aber Server Actions koennen nicht beliebige zweite Argumente von Client-Buttons erhalten, daher pragmatischer Weg: zwei eigenstaendige Server Actions `createAntragDraft` (= heute `createAntrag`) und `createAntragAndSubmit`. Analog `updateAntragDraft` und `updateAntragAndSubmit`. So bleibt der Aufruf typed und einfach. Bestehende Aufrufe von `createAntrag`/`updateAntrag` werden auf die neuen Namen migriert (oder die alten Namen behalten "Draft"-Semantik). Final entscheidet die Umsetzung; Plan dokumentiert Pattern und Tradeoff.

### Anti-Patterns to Avoid

- Keine zwei separaten HTTP-Roundtrips fuer "speichern" und "einreichen" beim Direkt-Einreichen (Race Conditions, Status-Inkonsistenzen, schlechte UX)
- Kein magischer String-Vergleich via `event.submitter.value` ohne Typsicherheit; lieber explizite Server Actions je Intent
- Keine Re-Implementierung der Validierung im Submit-Pfad; bestehendes `antragCreateSchema` wiederverwenden
- Kein Verzicht auf den Bestaetigungsdialog beim Direkt-Einreichen (Konsistenz mit Detailseite, Schutz vor versehentlichem Klick)
- Keine stille Statusaenderung in `updateAntrag`; Statuswechsel ist immer eine bewusst gewaehlte Operation
- Keine Locker-Pruefung im Submit, die Admins fremde Antraege einreichen liesse (siehe Rollenregeln)
- Kein Aenderungen an Prisma-Schema, da das Datenmodell bereits passt
- Keine neuen npm-Pakete

### Dependency Analysis

Vorhandene Dependencies reichen vollstaendig aus: Next.js 16.2.6, React 19, React Hook Form 7, Zod 4, Prisma 7, Better Auth 1.6, shadcn/ui Dialog/Button/Form, sonner, date-fns. Keine ENV-Aenderung. Keine externen Mocks noetig.

### Testing Patterns

- Vitest: `__tests__/unit/schemas/antrag.test.ts` und `__tests__/unit/antrag-status.test.ts` als Vorbild; Schemafaelle direkt mit `safeParse`. Server-Actions selbst werden nicht direkt mit Prisma-Mock getestet (kein bestehendes Mocking-Setup), aber die reine Validierungslogik fuer den Submit-Pfad wird ueber Schema-Tests abgesichert (z.B. ein Hilfs-Helfer, der einen persistierten Datensatz auf Schema-Konformitaet prueft, wenn er extrahiert wird).
- Playwright: `e2e/antraege.spec.ts` zeigt das Login-Pattern und das Anlegen eines Antrags. Der neue Test erweitert dieselbe Datei um den Einreichen-Flow und prueft die Status-Badge in der Liste.

## Architekturentscheidungen

### Gewaehlter Ansatz

Zwei eigenstaendige Server Actions je Intent (`createAntragDraft`/`createAntragAndSubmit`, `updateAntragDraft`/`updateAntragAndSubmit`) plus eine geschaerfte `submitAntrag`-Action mit Re-Validierung. Das Formular hat zwei Buttons: "Entwurf speichern" loest direkt die Draft-Action aus; "Speichern und einreichen" oeffnet zuerst einen `Dialog` und ruft nach Bestaetigung die Submit-Action. Im Erfolgsfall navigiert das System per `redirect` auf die Detailseite, wo Status `Eingereicht` als Badge angezeigt wird.

Dieser Ansatz haelt jede Server Action klein, eindeutig und typed. Sie sind individuell testbar und benoetigen keine Magic-Flags. Der Dialog wird wiederverwendbar implementiert (kleine interne Helper-Komponente im Formular oder Pattern aus `antrag-actions.tsx`), um Konsistenz zur Detailseite zu wahren.

### Erwogene Alternativen

- Alternative: Eine Server Action `createAntrag` mit zweitem Argument `{ andSubmit: boolean }` - Entscheidung: nicht gewaehlt, weil Server Actions ueber FormData triggern und das zweite Argument nur via Bindung `action.bind(null, options)` typsicher waere; das macht das Formular unnoetig komplex
- Alternative: Hidden Input `intent` im Form + ein einziger Action-Endpoint - Entscheidung: nicht bevorzugt, weil Magic-Strings, weniger lesbare Typsignatur und schwerere Unit-Testbarkeit
- Alternative: Direkt-Einreichen ohne Bestaetigungsdialog - Entscheidung: verworfen wegen Inkonsistenz zur Detailseite und Fehlklick-Risiko
- Alternative: REST-Endpoint `/api/antraege/[id]/submit` erstellen - Entscheidung: verworfen, weil PRD und KILO_INSTRUCTIONS einen Route Handler nur fordern, wenn ein externer Konsument das braucht; das Portal nutzt Server Actions

### Security, Performance, Maintainability

- Security: Submit-Pfad prueft Rolle, Eigentuemerschaft und Status; revalidiert die persistierten Daten gegen `antragCreateSchema`. Direkt-Einreichen verhindert Race Conditions zwischen Speichern und Einreichen durch atomare Reihenfolge in derselben Server Action.
- Performance: Vernachlaessigbar; pro Direkt-Einreichen genau ein `prisma.antrag.create`/`update` plus einmaliges `findUnique` im klassischen Submit-Pfad.
- Maintainability: Klar benannte Server Actions, gemeinsames Validierungsschema, ein Dialog-Pattern. Spaeter erweiterbar (z.B. um Status `ZURUECKGEZOGEN` aus der Detailseite) ohne strukturelle Aenderungen am Formular.

## Datenmodell und Prisma

Keine Aenderung am Prisma-Schema noetig. Status-Default `ENTWURF` und Status-Enum sind bereits korrekt. Daher kein `npm run db:reset` zwingend; bei lokalen Tests genuegt `npm run db:seed` (oder ein neuer Seed-Lauf), wenn die Datenbank durch experimentelle Antraege "voll" ist. Keine Prisma Migrations.

## Betroffene Dateien

### Bestehende Dateien

- `src/app/(app)/antraege/actions.ts` - Server Actions erweitern: `createAntragAndSubmit`, `updateAntragAndSubmit`; `submitAntrag` haerten (Re-Validierung, Eigentuemerpruefung). `createAntrag` wird ggf. zu `createAntragDraft` umbenannt (oder bleibt als Alias) - finale Entscheidung im Execute.
- `src/components/antraege/antrag-form.tsx` - Zweites Action-Prop (oder Submit-Variante), zweiter Button, eingebetteter Bestaetigungsdialog, Loading-Status-Logik fuer beide Pfade
- `src/app/(app)/antraege/neu/page.tsx` - Beide Server Actions ans Formular durchreichen
- `src/app/(app)/antraege/[id]/bearbeiten/page.tsx` - Beide Server Actions ans Formular durchreichen; nach Direkt-Einreichen sauber auf Detailseite navigieren
- `src/app/(app)/antraege/[id]/antrag-actions.tsx` - Optional: kleines Refactoring, falls ein Submit-Dialog-Helfer in eine wiederverwendbare Komponente extrahiert wird (nur wenn das die Maintainability klar verbessert)
- `__tests__/unit/schemas/antrag.test.ts` - Ergaenzungen, falls der Re-Validierungsfluss neue Edge Cases offenlegt (z.B. abgelaufene `startdatum`-Annahmen sind hier explizit nicht im Schema)
- `__tests__/unit/antrag-status.test.ts` - Bestaetigt: Transition `ENTWURF -> EINGEREICHT` ist Pflichtaussage; ggf. neuer Test, der negative Transitions abgrenzt
- `e2e/antraege.spec.ts` - Neuer Testfall "Antrag erfassen und direkt einreichen"

### Neue Dateien

- Moeglicherweise `__tests__/unit/actions/antrag-submit.test.ts` - nur, wenn ein extrahierter Hilfs-Helfer (`canSubmitAntrag(input)` o.Ae.) entsteht, der ohne Prisma-Mock testbar ist. Sonst keine neuen Test-Dateien; Schema- und Status-Tests reichen.
- Keine neuen UI-Dateien noetig; Dialog wird inline im Formular umgesetzt oder per kleinem Subkomponenten-Block im selben File.

## Implementation Plan

### Phase 1: Foundation

Re-Validierung in `submitAntrag` einbauen und Submit-Pfad rollenseitig schaerfen. Das ist die kleinste in sich bedeutsame Verbesserung, die unabhaengig vom UX-Umbau Wert liefert und durch Unit-Tests gut absicherbar ist.

### Phase 2: Core Implementation

Neue Server Actions `createAntragAndSubmit` und `updateAntragAndSubmit` als atomare "Speichern + Einreichen"-Variante. Sie kapseln Validierung, Persistenz und Statuswechsel.

### Phase 3: Integration

`AntragForm` um zweiten Aktionsbutton mit Bestaetigungsdialog erweitern. `neu/page.tsx` und `bearbeiten/page.tsx` reichen jeweils die passenden Server Actions durch. Toast- und Redirect-Verhalten konsistent zur bestehenden UX.

### Phase 4: Testing and Validation

Vitest-Tests fuer die neuen Validierungs- und Statusregeln aktualisieren. Playwright-E2E in `e2e/antraege.spec.ts` ergaenzen. `npm run build` als Schlusscheck. Manuelle Pruefung der Rollen (Antragstellerin und Admin) gemaess PRD-Erfolgskriterien.

## Step-by-Step Tasks

Wichtig: Tasks top-to-bottom ausfuehren. Jeder Task ist atomic und einzeln validierbar.

Aktionskeywords:

- `CREATE`: neue Datei oder Komponente
- `UPDATE`: bestehende Datei aendern
- `ADD`: Funktionalitaet in bestehender Datei ergaenzen
- `REMOVE`: veralteten Code entfernen, nur mit expliziter Bestaetigung
- `REFACTOR`: Struktur aendern ohne Verhalten zu aendern

### Task 1: UPDATE `src/app/(app)/antraege/actions.ts` - `submitAntrag` haerten

**Status:** done  
**Ziel:** Beim Einreichen wird der persistierte Antrag erneut gegen `antragCreateSchema` validiert; nur der Ersteller (auch fuer Admins) darf einreichen.  
**IMPLEMENT:**

- In `submitAntrag(id)` nach `findUniqueOrThrow` ein zusaetzliches Validate ausfuehren: `antragCreateSchema.safeParse(normalizeAntragInput({ ...persistierter Datensatz als rohe Werte fuer das Schema ... }))`. Bei Fehlschlag `throw new Error('Antrag kann nicht eingereicht werden: ' + lesbare Fehlerzusammenfassung)`. Keine Statusaenderung in diesem Fall.
- Eigentuemerpruefung schaerfen: `if (antrag.erstellerId !== session.user.id) throw new Error('Keine Berechtigung zum Einreichen')`. Admins duerfen fremde Antraege weiterhin lesen, aber nicht einreichen (PRD MVP).
- Statuswechsel `ENTWURF -> EINGEREICHT` bleibt unveraendert, inklusive `revalidatePath`.

**PATTERN:** Bestehendes Server-Action-Pattern in derselben Datei (`createAntrag`, `updateAntrag`).  
**IMPORTS:** Zusaetzlich `antragCreateSchema`, `normalizeAntragInput` aus `@/lib/schemas/antrag` (sind teilweise schon importiert).  
**GOTCHA:**

- Prisma liefert `Date`-Objekte und `Float`. `normalizeAntragInput` ist heute auf Strings ausgelegt; ggf. wird die Funktion leicht angepasst oder ein separater "vom-Persisted-zum-Schema-Input"-Helper erstellt.
- `kostenChf` ist im Schema `Float`, das Schema erwartet `number` - das passt; `startdatum` ist Date - `requiredDateSchema` ist `z.coerce.date()`, das akzeptiert Date direkt.
- `notFound`-Fall: `findUniqueOrThrow` wirft bereits; das ist OK.

**ACCEPTANCE CRITERIA:**

- [ ] `submitAntrag` revalidiert den persistierten Antrag gegen `antragCreateSchema`
- [ ] Bei Validierungsfehlschlag bleibt der Status `ENTWURF` und es wird eine sprechende Fehlermeldung geworfen
- [ ] Nur der Ersteller darf einreichen; Admins koennen fremde Antraege nicht einreichen
- [ ] Bestehende erfolgreiche Einreichungen aus dem Seed (z.B. Status `EINGEREICHT` von einem gueltigen Antrag) brechen nicht

**VALIDATE:**

- Manuelle Pruefung: in der DB einen `ENTWURF` mit zu kurzer `begruendung` simulieren (via Prisma Studio), dann auf Detailseite "Einreichen" klicken - es darf nicht durchgehen.
- `npm run test` (bestehende Tests muessen weiterhin gruen sein; ggf. neuer Helper-Test, wenn ein Helfer extrahiert wurde)

### Task 2: ADD `createAntragAndSubmit` und `updateAntragAndSubmit` in `src/app/(app)/antraege/actions.ts`

**Status:** done  
**Ziel:** Atomare Server Actions "Speichern und Einreichen" fuer Create- und Edit-Flow.  
**IMPLEMENT:**

- `createAntragAndSubmit(formData: FormData)`: identisch zu `createAntrag`, aber `data.status = 'EINGEREICHT'` direkt beim `prisma.antrag.create`. Zod-Validierung wie heute, Rollenpruefung wie heute (`requireRole(['user_applicant', 'admin'])`). Anschliessend `revalidatePath('/antraege')` und `redirect('/antraege/<id>')`.
- `updateAntragAndSubmit(id: string, formData: FormData)`: validiert wie `updateAntrag`, prueft Status `ENTWURF` und Eigentuemer-/Admin-Regel (mit der unter Task 1 geschaerften Eigentuemerregel: nur der Ersteller). Update der Felder und Statuswechsel zu `EINGEREICHT` im selben `prisma.antrag.update`. Anschliessend `revalidatePath` und `redirect`.
- Bestehende `createAntrag`/`updateAntrag` bleiben als Draft-Pfade erhalten. (Umbenennung optional; falls umbenannt, alle Aufrufer mitziehen.)

**PATTERN:** Spiegelt `createAntrag` und `updateAntrag` aus derselben Datei.  
**IMPORTS:** Bereits vorhanden.  
**GOTCHA:**

- `redirect` muss als letzte Anweisung stehen; vorher kein `try/catch` um redirect herum.
- Im Edit-Fall darf der Statuswechsel nur erfolgen, wenn `antrag.status === 'ENTWURF'`. Sonst `throw`.

**ACCEPTANCE CRITERIA:**

- [ ] Antragstellerin und Admin koennen ueber `createAntragAndSubmit` einen neuen Antrag in einem Schritt einreichen
- [ ] Antragstellerin (Eigentuemer) und Admin (eigener Antrag) koennen ueber `updateAntragAndSubmit` einen Entwurf einreichen
- [ ] Bei ungueltigen Feldern bricht die Operation ab und der Antrag wird weder erstellt noch eingereicht
- [ ] Bei fehlender Berechtigung wird `Error` geworfen
- [ ] Bestehende Draft-Pfade brechen nicht

**VALIDATE:**

- Manuelle Pruefung: Beide Pfade ueber Browser durchspielen (Task 4 deckt das ab).
- `npm run test`

### Task 3: UPDATE `src/components/antraege/antrag-form.tsx` - Zweiter Aktionsbutton mit Bestaetigungsdialog

**Status:** done  
**Ziel:** Antragstellende koennen aus dem Formular zwischen "Entwurf speichern" und "Speichern und einreichen" waehlen; Direkt-Einreichen erfordert eine explizite Bestaetigung.  
**IMPLEMENT:**

- Props erweitern: statt `action` jetzt `onSaveDraft: (fd: FormData) => Promise<void>` und `onSubmitFinal: (fd: FormData) => Promise<void>`. Alte Aufrufer (`neu/page.tsx`, `bearbeiten/page.tsx`) entsprechend aktualisieren.
- Zwei Buttons im Footer: "Entwurf speichern" (`type="button"`, ruft `form.handleSubmit(values => submitFlow('draft', values))`) und "Speichern und einreichen" (`type="button"`, oeffnet vor dem Submit einen `Dialog`).
- Bestaetigungsdialog (shadcn `Dialog`) zeigt: "Antrag verbindlich einreichen? Der Antrag wechselt in den Status Eingereicht und kann danach nicht mehr bearbeitet werden." mit Button "Ja, einreichen" und "Abbrechen".
- Loading-Status `isPending` bleibt; beide Pfade nutzen denselben `useTransition`; Buttons sind waehrend `isPending` disabled.
- Beim Einreichen-Erfolg Toast "Antrag eingereicht"; beim Speichern Toast "Entwurf gespeichert" (wie heute).
- `NEXT_REDIRECT`-Fehler durchreichen wie heute.
- Form-Validierung wird vor dem Dialog-Open ausgeloest (`form.trigger()` oder `form.handleSubmit(...)`-basiertes Pattern), damit nicht ein leeres Formular eingereicht werden kann.

**PATTERN:** Bestaetigungsdialog spiegelt `src/app/(app)/antraege/[id]/antrag-actions.tsx` (`SubmitButton`).  
**IMPORTS:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` aus `@/components/ui/dialog`; `useState` fuer Dialog-Open-Steuerung; bestehende `useTransition`, `toast`, `Button`, `Form`, etc.  
**GOTCHA:**

- Wenn der Dialog `DialogTrigger asChild` nutzt, muss der getriggerte Button im React-Hook-Form-Kontext aber zuerst validieren. Loesung: kein `DialogTrigger` direkt, sondern manueller `setOpen(true)` nach `form.trigger()` mit Erfolg.
- `form.handleSubmit` darf nicht doppelt ausgeloest werden; Pattern: Save-Button hat eigenen Click-Handler, Submit-Button-Pfad oeffnet Dialog, der "Ja"-Button im Dialog ruft dann `form.handleSubmit(async values => onSubmitFinal(buildFormData(values)))()`.
- `bemerkung`/`enddatum` optional: Form-Default `undefined` bleibt; `toFormValue` ist robust.

**ACCEPTANCE CRITERIA:**

- [ ] Zwei sichtbare Aktionsbuttons im Footer des Formulars
- [ ] "Entwurf speichern" funktioniert weiterhin wie heute (Toast, Redirect via Server Action)
- [ ] "Speichern und einreichen" oeffnet einen Bestaetigungsdialog; erst "Ja, einreichen" loest den Server-Action-Call aus
- [ ] Ungueltige Felder werden vor dem Dialog gezeigt; der Dialog oeffnet bei Validierungsfehlern nicht
- [ ] Im Erfolgsfall navigiert der Direkt-Einreichen-Pfad zur Detailseite und zeigt Status `Eingereicht`
- [ ] Bei Fehlern (Server-Validation) erscheint ein Toast und der Antrag bleibt im aktuellen Zustand

**VALIDATE:**

- Manuelle Pruefung (Task 4 deckt das ab).
- `npm run test` (Component-Logik wird nicht direkt unit-getestet; Schema-Tests sichern Validierungsfaelle ab).

### Task 4: UPDATE `neu/page.tsx` und `bearbeiten/page.tsx` - beide Actions durchreichen

**Status:** done  
**Ziel:** Create- und Edit-Seiten reichen die jeweils passenden Server Actions an `AntragForm` durch und navigieren nach Erfolg korrekt.  
**IMPLEMENT:**

- `src/app/(app)/antraege/neu/page.tsx`: `AntragForm` mit `onSaveDraft={createAntrag}` (bzw. `createAntragDraft`, je nach finalem Namen) und `onSubmitFinal={createAntragAndSubmit}` aufrufen.
- `src/app/(app)/antraege/[id]/bearbeiten/page.tsx`: zwei Inline-Server-Action-Wrapper definieren, einer fuer Draft (`updateAntrag(id, fd); redirect(detail)`), einer fuer Submit (`updateAntragAndSubmit(id, fd); redirect(detail)`). An `AntragForm` durchreichen.
- Keine UI-Aenderung sonst.

**PATTERN:** Wie heute in `bearbeiten/page.tsx` mit Inline-`'use server'`-Funktion fuer den Update-Flow.  
**IMPORTS:** Server Actions aus `../actions` bzw. `../../actions`.  
**GOTCHA:**

- `redirect` innerhalb der Submit-Action ist bereits in den neuen Actions enthalten; im Inline-Wrapper darf kein doppelter Redirect die Antwort verhindern.
- Server Actions duerfen kein zweites Argument von einem `<form action={...}>` annehmen; deshalb arbeiten die Actions weiter ueber `FormData`. Das Form-Komponenten-API liefert `FormData` aus dem Handler an die Server Action.

**ACCEPTANCE CRITERIA:**

- [ ] Create-Seite zeigt beide Buttons und nutzt die passenden Actions
- [ ] Edit-Seite zeigt beide Buttons und nutzt die passenden Actions
- [ ] Nach Erfolg landet der Nutzer auf der Detailseite mit korrektem Status

**VALIDATE:**

- Manuelle Pruefung im Dev-Server (siehe Task 7).
- `npm run build` muss gruen sein.

### Task 5: UPDATE `__tests__/unit/schemas/antrag.test.ts` und `__tests__/unit/antrag-status.test.ts`

**Status:** done  
**Ziel:** Tests decken den Direkt-Einreichen-Fluss und die Re-Validierung ab.  
**IMPLEMENT:**

- In `antrag.test.ts` einen Test "ein vollstaendiger Datensatz fuer den Direkt-Einreichen-Fluss ist valide" als positive Bestaetigung und einen Test "ein Datensatz mit zu kurzer Begruendung wird vom Re-Validate abgelehnt" ergaenzen.
- In `antrag-status.test.ts` einen Test "Direkter Statuswechsel ENTWURF -> EINGEREICHT ist erlaubt" als explizite Erwartung ergaenzen, falls noch nicht abgedeckt.
- Falls ein Helper `revalidateAntragForSubmit(antrag)` extrahiert wurde, dazu einen eigenen Unit-Test schreiben.

**PATTERN:** Bestehende `describe`/`it`/`expect`-Struktur in denselben Dateien.  
**IMPORTS:** Wie heute (`antragCreateSchema`, `normalizeAntragInput`, `ANTRAG_STATUS_TRANSITIONS`).  
**GOTCHA:**

- Tests duerfen die heutige Form-Logik (Client) nicht aufrufen; nur reine Schema-/Helper-Logik.

**ACCEPTANCE CRITERIA:**

- [ ] Mindestens ein neuer positiver und ein neuer negativer Test fuer den Submit-Pfad
- [ ] Status-Test bestaetigt die Transition explizit
- [ ] `npm run test` ist gruen

**VALIDATE:**

- `npm run test`

### Task 6: UPDATE `e2e/antraege.spec.ts` - End-to-End-Test "Antrag erfassen und direkt einreichen"

**Status:** done  
**Ziel:** Ein automatisierter E2E-Test bestaetigt den vollstaendigen User-Flow durch UI, Server Action und DB.  
**IMPLEMENT:**

- Neuer Testfall in `e2e/antraege.spec.ts`: Login als `applicant@example.com` / `a`, Navigation zu `/antraege/neu`, alle Pflichtfelder fuellen, Button "Speichern und einreichen" klicken, im Dialog "Ja, einreichen" klicken, auf Detailseite Status-Badge "Eingereicht" pruefen, Zurueck zu `/antraege`, in der Liste den neu erstellten Antrag mit Status "Eingereicht" pruefen.
- Pattern: existierender Login-Flow in `e2e/login.spec.ts` und `e2e/antraege.spec.ts` als Vorbild.
- Tests bleiben unabhaengig von Seed-Reihenfolge (eindeutiger Antragstitel mit Timestamp).

**PATTERN:** `e2e/antraege.spec.ts` bereits vorhandener Test "Antrag erfassen".  
**IMPORTS:** `@playwright/test`.  
**GOTCHA:**

- Better Auth Login: heutiges Pattern via UI-Form, kein Storage State. Dauer ggf. 2-3 Sekunden pro Test.
- `db:reset` zwischen Tests ist nicht vorgesehen; Tests muessen tolerant gegenueber bestehenden Daten sein.
- Playwright benoetigt einen laufenden Dev-Server (`npm run dev`) oder ist via `playwright.config.ts` so konfiguriert, dass er einen startet. Falls letzteres im Repo nicht passiert, ist der Test nur lokal mit laufendem Dev-Server ausfuehrbar.

**ACCEPTANCE CRITERIA:**

- [ ] Neuer Test laeuft erfolgreich gegen lokalen Dev-Server
- [ ] Test scheitert sauber, wenn das Status-Badge nicht "Eingereicht" zeigt
- [ ] Test nutzt einen eindeutigen Antragstitel, damit Wiederholungslaeufe nicht stoeren

**VALIDATE:**

- `npm run test:e2e` (nur auf explizite Anforderung; Dev-Server muss laufen)

### Task 7: VALIDATE Gesamtintegration

**Status:** done  
**Ziel:** End-to-End-Stabilitaet des Features ist bestaetigt.  
**IMPLEMENT:**

- `npm run test` ausfuehren
- `npm run build` ausfuehren
- Manuelle Pruefung in mehreren Rollen (siehe unten)
- Ergebnisse in dieser Plan-Datei dokumentieren (analog zum Foundation-Plan)

**PATTERN:** Wie im Foundation-Feature dokumentiert (`plan-v002` Task 8).  
**IMPORTS:** Keine.  
**GOTCHA:** Better-Auth-Secret-Warnungen sind erwartbar, brechen `db:reset` und `build` aber nicht.  
**ACCEPTANCE CRITERIA:**

- [ ] `npm run test` ist gruen
- [ ] `npm run build` ist gruen
- [ ] `npm run test:e2e` ist gruen (falls explizit ausgefuehrt)
- [ ] Manuelle Pruefung passt zum MVP-Scope

**VALIDATE:**

- `npm run test`
- `npm run build`
- `npm run test:e2e` (auf Anforderung)
- Manuelle Pruefung im Dev-Server siehe Validation Commands Level 4

## Testing Strategy

### Unit Tests

Vitest deckt die zentralen Validierungs- und Statusregeln ab:

- positive Schemafaelle fuer den Direkt-Einreichen-Fluss
- negative Schemafaelle (zu kurze `begruendung`, zu hohe `kostenChf`, `enddatum` vor `startdatum`) bestaetigen, dass `submitAntrag` korrekt blockiert
- Statusuebergang `ENTWURF -> EINGEREICHT` ist explizit getestet
- Bei extrahiertem Re-Validate-Helper ein dedizierter Unit-Test

### E2E Tests

Playwright in `e2e/antraege.spec.ts`:

- Login als Antragstellerin, neuen Antrag erfassen, ueber "Speichern und einreichen" inkl. Bestaetigungsdialog einreichen, Status auf Detail- und Listenseite verifizieren

### Regression Tests

- Bestehender "Antrag erfassen"-E2E darf nicht brechen
- Bestehende Schema- und Status-Unit-Tests bleiben gruen
- Bestehende Detailseiten-Einreichen-Flow (ueber `SubmitButton`) funktioniert weiterhin und nutzt nun die geschaerfte `submitAntrag`-Logik

### Edge Cases

- Direkt-Einreichen ohne Pflichtfelder (Form-Validierung blockiert vor Dialog)
- Direkt-Einreichen mit `kostenChf > 50000` (Server-Action blockiert mit klarer Fehlermeldung)
- Direkt-Einreichen mit `enddatum` vor `startdatum`
- `bemerkung` und `enddatum` leer (Edge optional)
- Bestehender Entwurf wird per "Speichern und einreichen" aktualisiert und eingereicht
- Admin versucht, einen fremden Entwurf einzureichen (muss abgewiesen werden)
- Wiederholtes Klicken auf "Ja, einreichen" im Dialog (Button waehrend `isPending` disabled)
- Verbindungsabbruch waehrend des Einreichens (Toast-Fehlermeldung, Antrag bleibt im urspruenglichen Zustand)
- Konkurrierender Statuswechsel durch zweite Session (z.B. zweimal in zwei Tabs einreichen): zweiter Aufruf wird durch Statuspruefung `status !== 'ENTWURF'` abgewiesen

## Validation Commands

Fuehre diese Befehle nur aus, wenn sie fuer das Feature relevant sind. Dokumentiere nicht ausfuehrbare Schritte mit Begruendung.

### Level 1: Syntax, Types and Unit Tests

```bash
npm run test
```

### Level 2: End-to-End Tests

```bash
npm run test:e2e
```

Nur auf ausdruecklichen Auftrag; benoetigt laufenden Dev-Server.

### Level 3: Build

```bash
npm run build
```

### Level 4: Manual Validation

Nutzer startet `npm run dev` und prueft:

1. Login als `applicant@example.com` / `a`
2. Auf `/antraege/neu` alle Pflichtfelder fuellen und "Entwurf speichern" klicken: landet auf Detailseite mit Status `Entwurf`.
3. Erneut `/antraege/neu`, alle Pflichtfelder fuellen, "Speichern und einreichen" klicken, im Dialog "Ja, einreichen" bestaetigen: landet auf Detailseite mit Status `Eingereicht`.
4. Form mit fehlerhaftem `kostenChf` und Direkt-Einreichen versuchen: Dialog oeffnet nicht; Fehler unter dem Feld sichtbar.
5. Aus bestehendem Entwurf "Bearbeiten" oeffnen, "Speichern und einreichen" klicken: Status `Eingereicht` danach sichtbar.
6. Detailseite eines Entwurfs aufrufen und ueber den bestehenden "Einreichen"-Button einreichen: weiterhin moeglich, jetzt mit Re-Validierung auf Serverseite.
7. Login als `admin@example.com` / `a`: Adminsicht zeigt alle Antraege. Admin sieht keinen Bearbeiten-/Einreichen-Button bei fremden Entwuerfen.
8. Nach `npm run db:reset` (optional) sind nur fiktive Antraege vorhanden und neuer Submit-Flow funktioniert auf frischer Datenbasis.

## Acceptance Criteria

- [x] Antragstellerin kann einen Weiterbildungsantrag erfassen
- [x] Antragstellerin kann den Antrag als Entwurf speichern
- [x] Antragstellerin kann den Antrag direkt aus dem Formular einreichen (Bestaetigungsdialog ist Pflicht)
- [x] Antragstellerin kann einen bestehenden Entwurf bearbeiten und in einem Schritt einreichen
- [x] Antragstellerin kann einen bestehenden Entwurf weiterhin ueber den Detail-Einreichen-Button einreichen
- [x] Beim Einreichen wird der Antrag serverseitig gegen das vollstaendige Zod-Schema validiert
- [x] Nur der Ersteller darf seinen Antrag einreichen; Admins koennen fremde Antraege nicht einreichen
- [x] Alle Validierungsfehler werden mit verstaendlichen deutschen Meldungen angezeigt
- [x] Unit-Tests fuer Schema und Status sind erweitert und gruen
- [x] Playwright-E2E "Antrag erfassen und direkt einreichen" ist vorhanden und laeuft gegen lokalen Dev-Server gruen
- [x] `npm run build` ist gruen
- [x] Keine Regressionen in Liste, Detailseite, Bearbeiten-Flow und Dashboard
- [x] Dokumentationsbedarf ist notiert

## Completion Checklist

- [x] Alle Tasks sind umgesetzt
- [x] Jeder Task wurde validiert
- [x] Alle relevanten Tests laufen erfolgreich oder Ausnahmen sind begruendet
- [x] `npm run build` wurde bei groesseren Aenderungen ausgefuehrt
- [x] Manuelle Pruefung ist dokumentiert
- [x] Plan-/PRD-Abweichungen sind dokumentiert und genehmigt
- [x] Feature ist bereit fuer `/document` und `/commit`
- [x] Feature ist dokumentiert (user-guide.md, developer-notes.md)

## Documentation Results

- `docs/project/features/antrag-erfassen-und-einreichen/user-guide.md` erstellt
- `docs/project/features/antrag-erfassen-und-einreichen/developer-notes.md` erstellt

## Documentation Notes

Spaetere Dokumentation sollte mindestens festhalten:

- den vollstaendigen User-Flow "Erfassen → Entwurf speichern oder direkt einreichen"
- den Bestaetigungsdialog vor dem verbindlichen Einreichen
- die serverseitige Re-Validierung beim Statuswechsel und ihre Schutzwirkung
- die Rollenregel "Admins duerfen fremde Antraege nicht einreichen"
- dass die alten Einreichen-Buttons auf der Detailseite weiterhin funktionieren
- Hinweise fuer Studierende, wie sie diesen Pattern auf eigene Domaenen uebertragen koennen (zwei eigenstaendige Server Actions je Intent statt Magic-Flag)

## Notes and Trade-offs

- **Zwei Server Actions statt eine mit Flag**: Erhoeht die Anzahl exportierter Symbole leicht, ist dafuer typed und klar testbar. Das ist im Demo-Kontext besser fuer Studierende lesbar.
- **Inline-Dialog im Formular** vs. extrahierte Komponente: Die initiale Umsetzung haelt den Dialog inline, weil das Formular ohnehin die Form-Validierung kontrolliert. Eine Extraktion ist nur sinnvoll, wenn der Dialog an weiterer Stelle wiederverwendet wird; das ist im aktuellen Scope nicht der Fall.
- **Eigentuemer-Schaerfung in `submitAntrag`**: Klein, aber wichtig fuer PRD-Konformitaet. Es entsteht kein neuer Code-Pfad, sondern eine Verschaerfung der bestehenden Pruefung. Dokumentiert in den Plan-Notes, damit Reviewer das gezielt prueft.
- **Re-Validierung als reiner Schutz**: In der heutigen Foundation gibt es noch keine Wege, ein invalides Entwurf in die DB zu bekommen. Der Schutz wirkt vor allem fuer zukuenftige Schema-Verschaerfungen und Eingriffe via Prisma Studio.

## Offene Fragen

- Soll `createAntrag`/`updateAntrag` in `createAntragDraft`/`updateAntragDraft` umbenannt werden? Naming-Frage; Execute darf entscheiden, dokumentiert sich aber in den Documentation Notes.
- Soll die Eigentuemer-Schaerfung in `submitAntrag` als eigener kleiner Commit gefuehrt werden? Vorschlag im Plan: ja, als erster Task, weil unabhaengig wertvoll.

## Plan Review Notes

Nicht relevant fuer `plan-v001.md`. Wird durch `/integrate-feature-plan-review` in `plan-v002.md` ergaenzt.
