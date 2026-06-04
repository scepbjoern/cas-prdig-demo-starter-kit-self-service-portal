# Plan: Meine Antraege und Statusuebersicht

## Status

**Feature-Status:** planned  
**Erstellt:** 2026-06-04  
**Plan-Version:** v001  
**Quelle:** User Request `/plan-feature Meine Antraege und Statusuebersicht`, PRD `docs/project/prds/self-service-portal-v002.md` (US-5, MVP-Prioritaet 3), Foundation-Feature `docs/project/features/datenmodell-weiterbildungsantrag/plan-v002.md`  
**Confidence Score:** 9/10 - Die Listen- und Detailseite existieren bereits als funktionale Grundlage aus dem Foundation-Feature. Dieses Feature ist eine reine UX-Verfeinerung mit Statusfilter, Suche und Dashboard-Integration. Keine Prisma-Aenderung, keine neuen Packages, keine neuen Routen. Punktabzug fuer minimale Unsicherheit bei der Such-UI (Server Component mit URL-Search-Params vs. Client-Komponente – Entscheidung im Plan dokumentiert).

## Feature Metadata

| Feld | Wert |
|---|---|
| Feature-Typ | Enhancement (auf Foundation aus `datenmodell-weiterbildungsantrag`) |
| Plan-Version | v001 |
| Komplexitaet | Low |
| Primaer betroffene Systeme | UI (Liste, Dashboard) / Server Actions / Tests (Vitest + Playwright) |
| Abhaengigkeiten | Prisma 7 + SQLite (bereits aktuell), Better Auth, shadcn/ui; keine neuen npm-Pakete; keine Prisma-Schema-Aenderung |

## Plan-Aenderungshistorie

| Version | Datum | Anlass | Kurzbeschreibung |
|---|---|---|---|
| v001 | 2026-06-04 | Initiale Planung | Erster Feature-Plan fuer Statusuebersicht mit Filter, Suche und Dashboard-Integration |

Bei spaeteren Aenderungen ergaenzen `/integrate-feature-plan-review` oder `/update-feature-plan` neue Zeilen, ohne alte Eintraege zu entfernen.

## Feature Description

Dieses Feature wertet die bestehende Antragsliste (`/antraege`) und das Dashboard (`/`) zu einer vollwertigen Statusuebersicht auf. Antragstellerinnen koennen ihre eigenen Antraege jetzt nach Status filtern und nach Titel durchsuchen. Das Dashboard wird mit klickbaren Status-Karten integriert, die direkt zu gefilterten Listenansichten fuehren.

Die Listen- und Detailseite existieren bereits aus dem Foundation-Feature (`datenmodell-weiterbildungsantrag`) und wurden im Erfassungs-Feature (`antrag-erfassen-und-einreichen`) als durchgaengig funktional bestaetigt. Dieses Feature fuegt Statusfilter, Suche und erweiterte Tabellenspalten hinzu, ohne die bestehende Server-Component-Architektur zu veraendern.

## User Story

```text
Als Antragstellerin
moechte ich meine eigenen Antraege nach Status filtern und durchsuchen koennen,
damit ich schnell den aktuellen Stand eines bestimmten Antrags finde und den Status nachvollziehen kann.
```

Erweiterte Nutzersicht:

- US-5: Als Antragstellerin moechte ich meine eigenen Antraege und deren Status sehen, damit ich den aktuellen Stand nachvollziehen kann.
- Als Admin moechte ich alle Antraege filtern und durchsuchen koennen, damit ich die Demo gezielt steuern kann.

## Problem Statement

Die aktuelle Listenansicht unter `/antraege` zeigt eine flache Tabelle aller Antraege ohne Filter- oder Suchmoeglichkeit. Bei mehreren Antraegen (Seed-Daten plus neu erstellte) wird die Uebersicht unuebersichtlich. Das Dashboard zeigt zwar Statuszaehler, aber die Karten sind nicht klickbar und fuehren nicht zu gefilterten Ansichten.

Ausserdem fehlt in der Tabelle die Spalte "Kosten" – ein zentrales MVP-Feld, das fuer die Statusuebersicht relevant ist.

## Solution Statement

Das Feature erweitert die bestehende Server-Component-Listenseite um URL-basierte Statusfilter und Titelsuche. Der Statusfilter wird als Reihe von Badge-Buttons oberhalb der Tabelle dargestellt (Alle, Entwurf, Eingereicht, etc.). Die Titelsuche wird als einfaches Input-Feld mit einem "Suchen"-Button implementiert. Beide Filter werden als URL-Search-Params (`?status=ENTWURF&suche=cas`) uebergeben und serverseitig im Prisma-Query verarbeitet. Die Dashboard-Karten werden mit `Link`-Komponenten zu gefilterten Listenansichten verknuepft. Die Tabelle erhaelt eine zusaetzliche Spalte "Kosten".

## Scope

### Im Scope

- Statusfilter als URL-Search-Params (`?status=ENTWURF`) mit Badge-artigen Filterbuttons oberhalb der Tabelle
- Titelsuche als URL-Search-Params (`?suche=cas`) mit Input-Feld
- Neue Tabellenspalte "Kosten" in CHF formatiert
- Dashboard-Karten als klickbare Links zu gefilterten Listenansichten
- Server-seitige Filterlogik in der `AntraegePage`-Server Component
- Der Filter zeigt nur Statuswerte an, die laut PRD im MVP aktiv sind: `ENTWURF`, `EINGEREICHT`
- Leerer Zustand ("Keine Antraege gefunden") bei gefiltertem leerem Ergebnis
- Unit-Tests fuer neue Filter-Helper-Funktionen (Status-Enum-Mapping)
- Playwright-E2E-Test fuer Statusfilter und Suche
- Aktiver Filter wird visuell hervorgehoben (z.B. `variant="default"` fuer aktiven Status)

### Nicht im Scope

- Pagination (Demo-Datenvolumen rechtfertigt das nicht)
- Sortierung nach Spalten (aktuelle Sortierung nach `erstelltAm` bleibt)
- Client-seitiges Live-Filtern (URL-Params + Server-Component sind ausreichend)
- Neue Server Actions oder Route Handler
- Aenderungen an der Detailseite (`/antraege/[id]`)
- Aenderungen am Prisma-Schema oder Datenmodell
- Statuswerte `IN_RUECKFRAGE`, `GENEHMIGT`, `ABGELEHNT`, `ZURUECKGEZOGEN` in der Filter-UI (erst in Medium/Extended relevant; Enum-Werte sind technisch vorhanden, werden aber nicht als Filter-Buttons angezeigt)
- Export-Funktion (CSV/PDF)

## Rollen und Berechtigungen

Betroffene Rollen:

- `user_applicant`: sieht nur eigene Antraege; Filter und Suche arbeiten auf dem eigenen Antragsbestand
- `admin`: sieht alle Antraege; Filter und Suche arbeiten auf dem gesamten Antragsbestand
- `user_reviewer`: darf die Liste ebenfalls lesen (bestehende Berechtigung); Filter und Suche arbeiten auf dem gesamten sichtbaren Bestand

Schutzregeln:

- Die bestehende `where`-Klausel (`erstellerId`-Filter fuer `user_applicant`) bleibt unveraendert und wird mit den neuen Filter-Parametern kombiniert
- Admin darf keine fremden Antraege bearbeiten/einreichen (bestehende UI-Regel aus Foundation-Feature)
- Die Filter-UI zeigt keine Aktionen an, die die Rolle nicht ausfuehren darf

## Context References

### Pflichtlektuere vor Umsetzung

- `docs/project/prds/self-service-portal-v002.md` - Warum: autoritative Quelle fuer US-5, Statusmodell, MVP-Scope und Erfolgskriterien
- `docs/project/features/datenmodell-weiterbildungsantrag/plan-v002.md` - Warum: Vorgaengerfeature, definiert das aktuelle Modell, die Liste und Detailseite in ihrer Basisform
- `AGENTS.md` und `KILO_INSTRUCTIONS.md` - Warum: Stack-Regeln, Server-Components-Konvention, Sprache (Deutsch) und Anti-Patterns
- `src/app/(app)/antraege/page.tsx` - Warum: zentrale Listenseite, die um Filter und Suche erweitert wird
- `src/app/(app)/page.tsx` - Warum: Dashboard, dessen Karten klickbar werden
- `src/lib/antrag-status.ts` - Warum: `ANTRAG_STATUS_LABEL` und `ANTRAG_STATUS_VARIANT` fuer Filter-Buttons und Kartenlinks
- `prisma/schema.prisma` - Warum: bestaetigt, dass keine Schema-Aenderung noetig ist; `AntragStatus`-Enum ist vollstaendig
- `e2e/antraege.spec.ts` - Warum: bestehender E2E-Einstiegspunkt, wird um Filter-Tests erweitert
- `playwright.config.ts` - Warum: Konfiguration fuer E2E-Tests

### Relevante Dokumentation

- [Next.js App Router - searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) - Warum: URL-Search-Params in Server Components sind der gewaehlte Ansatz fuer Filter und Suche
- [Next.js App Router - Linking and Navigating](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating) - Warum: `Link`-Komponenten mit Query-Parametern fuer Dashboard-Karten und Filter-Buttons
- [Prisma Client - Filtering](https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting) - Warum: `where`-Klausel mit `contains` fuer Textsuche und `status`-Enum-Filter

## Codebase Intelligence

### Projektstruktur und Architektur

Das Feature lebt vollstaendig in der bestehenden `antraege`-Domaene. Die Listenseite `src/app/(app)/antraege/page.tsx` ist eine Server Component, die `searchParams` als Prop akzeptieren kann. Das Dashboard `src/app/(app)/page.tsx` ist ebenfalls eine Server Component. Beide werden um Link-Integration und Filterlogik erweitert, ohne Client-seitigen State oder neue Komponenten zu benoetigen.

### Patterns to Follow

- Naming: deutsche Fachbegriffe (`suche`, `status`, `antraege`); URL-Parameter in deutscher Kleinschreibung
- Datei-Organisation: Filterlogik direkt in der Server Component; keine neuen Dateien, wenn nicht zwingend noetig
- Fehlerbehandlung: keine zusaetzliche Fehlerbehandlung noetig; ungueltige Statuswerte im URL-Parameter werden ignoriert (Fallback auf ungefiltert)
- UI/shadcn: `Badge`-Komponente fuer Filter-Buttons (aktiver Filter mit `variant="default"`, inaktive mit `variant="outline"`); `Input` fuer Suchfeld; bestehende `Table`-Komponente beibehalten
- Auth/Rollen: bestehende `requireSession` und Rollenlogik unveraendert
- Prisma: `where`-Klausel wird mit `AND`-Operator um Status- und Suchbedingungen erweitert
- Server Component: `searchParams` ist in Next.js 16 ein Promise – `const { status, suche } = await searchParams`

### Anti-Patterns to Avoid

- Keine Client Component fuer die Listenseite (Server Component mit URL-Params reicht)
- Kein `useState`/`useEffect` fuer Filter-State (URL-Params sind die Single Source of Truth)
- Kein separater API-Endpunkt fuer gefilterte Listen (Prisma-Query direkt in der Server Component)
- Keine neuen Server Actions (Filterlogik ist lesend, kein Form-Submit)
- Keine Aenderungen an `prisma/schema.prisma`
- Kein `router.push` mit Query-Params in Client Components (stattdessen `Link`-Komponenten verwenden)
- Keine Filter-Buttons fuer Statuswerte, die im MVP nicht genutzt werden (IN_RUECKFRAGE, GENEHMIGT, ABGELEHNT, ZURUECKGEZOGEN)

### Dependency Analysis

Keine neuen Dependencies erforderlich. Alle benoetigten Komponenten und Funktionen sind bereits im Projekt:
- `Badge`, `Input`, `Button`, `Table` aus shadcn/ui
- `Link` aus `next/link`
- `ANTRAG_STATUS_LABEL` aus `@/lib/antrag-status`
- `prisma` aus `@/lib/prisma`
- `requireSession` aus `@/lib/auth-helpers`

### Testing Patterns

- Vitest: `__tests__/unit/antrag-status.test.ts` als Vorbild fuer Status-Mapping-Tests; falls ein Filter-Helper extrahiert wird, dort testen
- Playwright: `e2e/antraege.spec.ts` als Vorbild; Login-Pattern, Navigation und UI-Assertions spiegeln
- E2E-Teststruktur: `loginAsApplicant`/`loginAsAdmin`-Helper aus bestehendem Test wiederverwenden

## Architekturentscheidungen

### Gewaehlter Ansatz

URL-basierte Filterung mit `searchParams` in einer Server Component. Statusfilter-Buttons sind `Link`-Komponenten, die die URL mit `?status=ENTWURF` anpassen. Die Titelsuche nutzt ein einfaches `<form>` mit `method="GET"` und `action="/antraege"`, das bei Submit die Seite mit `?suche=begriff` neu laedt. Der Server Component liest `searchParams` aus und uebergibt die Filterbedingungen an die Prisma-Query.

Dieser Ansatz benoetigt keinen Client-seitigen State, keine `useState`/`useEffect`-Logik und ist vollstaendig mit Server Components kompatibel. Die URL ist immer die Single Source of Truth und kann als Bookmark geteilt werden. Nach dem Submit/Redirect von anderen Seiten bleiben die Filter-Parameter nicht erhalten, was bei Navigation ueber Sidebar oder Dashboard-Links konsistentes Verhalten ergibt (da die Links explizit gesetzt werden).

### Erwaegte Alternativen

- Alternative: Client-seitiges Filtern mit `useState` und `useEffect` - Entscheidung: nicht gewaehlt, weil Server Components der Standard im Projekt sind und Client-seitiges Filtern bei wachsenden Datenmengen nicht skaliert
- Alternative: Tabs-Komponente von shadcn/ui fuer Statusfilter - Entscheidung: nicht gewaehlt, weil `Tabs` eine Client Component ist und zusaetzliche Abhaengigkeiten schafft; `Badge`-Buttons als `Link`-Komponenten sind einfacher und serverkompatibel
- Alternative: Dropdown/Select fuer Statusfilter - Entscheidung: nicht gewaehlt, weil Badge-Buttons die Statuswerte visuell konsistenter mit der Tabelle darstellen und weniger Klicks erfordern
- Alternative: Debounced Search mit Client-seitigem State - Entscheidung: nicht gewaehlt, weil das Projekt bewusst Server Components bevorzugt und ein Form-Submit fuer Demo-Datenvolumen ausreichend schnell ist

### Security, Performance, Maintainability

- Security: Filter-Parameter aus der URL werden nicht direkt in die Prisma-Query interpoliert; der Status-Wert wird gegen das Enum validiert, der Suchbegriff wird als `contains`-String uebergeben (Prisma schuetzt vor SQL-Injection)
- Performance: Die zusaetzlichen `where`-Bedingungen sind reine AND-Verknuepfungen auf indizierten bzw. einfachen Feldern; kein Overhead durch zusaetzliche Queries
- Maintainability: Filterlogik ist in einer Server Component zentralisiert; keine verteilte Client-State-Logik; neue Statuswerte im Enum werden automatisch nicht als Filter-Buttons angezeigt, bis sie explizit hinzugefuegt werden

## Datenmodell und Prisma

Keine Aenderung am Prisma-Schema. Die Filterlogik nutzt das bestehende `AntragStatus`-Enum und die bestehenden Felder `titel` und `status`. Kein `npm run db:reset` noetig.

## Betroffene Dateien

### Bestehende Dateien

- `src/app/(app)/antraege/page.tsx` - UPDATE: Statusfilter-Buttons, Suchfeld, erweiterte Tabellenspalten, erweiterte Prisma-Query mit `where`-Filtern
- `src/app/(app)/page.tsx` - UPDATE: Dashboard-Karten mit `Link` zu gefilterten Listenansichten
- `src/app/(app)/antraege/loading.tsx` - UPDATE: Skeleton an neue Spaltenanzahl anpassen (neue "Kosten"-Spalte)
- `src/lib/antrag-status.ts` - UPDATE: MVPSichtbare Statuswerte als eigenes Array definieren (fuer Filter-Buttons)
- `__tests__/unit/antrag-status.test.ts` - UPDATE: Test fuer neue MVPSichtbare-Statuskonstante
- `e2e/antraege.spec.ts` - UPDATE: Neuer Testfall fuer Statusfilter und Suche

### Neue Dateien

- Keine neuen Dateien erforderlich. Filterlogik bleibt in der Server Component. Falls ein Filter-Helper fuer die Prisma-`where`-Klausel extrahiert wird, kommt er in `src/lib/` – aber nur bei echter Mehrfachverwendung oder deutlicher Lesbarkeitsverbesserung.

## Implementation Plan

### Phase 1: Foundation

Statusfilter-Konstante in `antrag-status.ts` definieren und Unit-Test dafuer schreiben. Das stellt sicher, dass die Liste der anzeigbaren Statuswerte zentral und getestet ist.

### Phase 2: Core Implementation

Listenseite um URL-basierte Filter erweitern: Statusfilter-Buttons, Suchfeld, neue "Kosten"-Spalte. Server-seitige Filterlogik in der Prisma-Query. Die Seite bleibt eine Server Component.

### Phase 3: Integration

Dashboard-Karten klickbar machen und mit gefilterten Listenansichten verlinken. Loading-Skeleton aktualisieren.

### Phase 4: Testing and Validation

Unit-Tests fuer neue Statuskonstante. E2E-Tests fuer Statusfilter und Suche. `npm run build` als Schlusscheck. Manuelle Pruefung der Rollen (Antragstellerin und Admin).

## Step-by-Step Tasks

Wichtig: Tasks top-to-bottom ausfuehren. Jeder Task ist atomic und einzeln validierbar.

Aktionskeywords:

- `CREATE`: neue Datei oder Komponente
- `UPDATE`: bestehende Datei aendern
- `ADD`: Funktionalitaet in bestehender Datei ergaenzen
- `REMOVE`: veralteten Code entfernen, nur mit expliziter Bestaetigung
- `REFACTOR`: Struktur aendern ohne Verhalten zu aendern
- `MIRROR`: bestehendes Pattern bewusst spiegeln

### Task 1: UPDATE `src/lib/antrag-status.ts` und `__tests__/unit/antrag-status.test.ts`

**Status:** planned  
**Ziel:** Eine zentrale Konstante definiert, welche Statuswerte im MVP als Filter-Buttons angezeigt werden. Unit-Test sichert die Liste ab.  
**IMPLEMENT:**

- In `src/lib/antrag-status.ts` ein zusaetzliches Array `ANTRAG_STATUS_MVP` einfuehren, das die MVP-relevanten Statuswerte enthaelt: `['ENTWURF', 'EINGEREICHT']`
- In `__tests__/unit/antrag-status.test.ts` einen Test ergaenzen: `ANTRAG_STATUS_MVP` enthaelt genau die erwarteten Werte und ist eine Teilmenge aller Enum-Werte

**PATTERN:** Bestehende Status-Konstanten in `antrag-status.ts` und bestehende Teststruktur in `antrag-status.test.ts`.  
**IMPORTS:** `AntragStatus` aus `@/generated/prisma/enums` (bereits importiert).  
**GOTCHA:**

- Das Array muss typisiert sein als `AntragStatus[]`, damit die Filter-Buttons typensicher auf das Enum zugreifen koennen
- Die Reihenfolge im Array bestimmt die Anzeige-Reihenfolge der Filter-Buttons; `ENTWURF` zuerst (haeufigster Fall), dann `EINGEREICHT`

**ACCEPTANCE CRITERIA:**

- [ ] `ANTRAG_STATUS_MVP` ist als `AntragStatus[]` definiert
- [ ] Das Array enthaelt `ENTWURF` und `EINGEREICHT`
- [ ] Unit-Test bestaetigt die Inhalte
- [ ] `npm run test` ist gruen

**VALIDATE:**

- `npm run test`

### Task 2: UPDATE `src/app/(app)/antraege/page.tsx` – Statusfilter, Suche und erweiterte Tabelle

**Status:** planned  
**Ziel:** Die Listenseite bietet Statusfilter-Buttons, eine Titelsuche und eine "Kosten"-Spalte. Server-seitige Filterung ueber URL-Search-Params.  
**IMPLEMENT:**

- `searchParams` als Promise in der Server Component akzeptieren: `{ searchParams }: { searchParams: Promise<{ status?: string; suche?: string }> }`
- Statusfilter-Buttons oberhalb der Tabelle als `Link`-Komponenten rendern: Ein "Alle"-Button und je ein Button pro Status aus `ANTRAG_STATUS_MVP`. Aktiver Button erhaelt `variant="default"`, inaktive `variant="outline"` (oder `variant="secondary"`). Buttons nutzen `Badge`-Komponente.
- Suchfeld als `<form method="GET" action="/antraege">` mit `<Input name="suche">` und `<Button type="submit">`. Wenn ein aktiver Statusfilter gesetzt ist, diesen als `<input type="hidden" name="status" />` im Form mitfuehren, damit die Suche den Statusfilter nicht zuruecksetzt.
- Prisma-Query erweitern: `where`-Klausel mit `AND`-Operator um Status- und Suchbedingungen ergaenzen. Status-Enum-Wert aus `searchParams.status` nur uebernehmen, wenn er in `ANTRAG_STATUS_MVP` enthalten ist (Validierung gegen Enum). Suchbegriff ueber `contains` auf `titel` anwenden (case-insensitive via SQLite).
- Neue Tabellenspalte "Kosten" zwischen "Status" und "Startdatum" einfuegen, formatiert als `{a.kostenChf.toFixed(2)} CHF`.
- Leeren Zustand bei gefiltertem leerem Ergebnis anpassen: "Keine Anträge gefunden" statt "Noch keine Anträge vorhanden".
- Aktiven Filter visuell kennzeichnen: oberhalb der Tabelle einen Hinweis "Gefiltert nach: Status 'Eingereicht'" oder "Suche: 'cas'" anzeigen, mit einem "Zuruecksetzen"-Link auf `/antraege`.

**PATTERN:** Bestehende Server Component in `antraege/page.tsx`; bestehende `Badge`-, `Input`-, `Button`- und `Table`-Komponenten.  
**IMPORTS:** Zusaetzlich `Input` aus `@/components/ui/input`, `ANTRAG_STATUS_MVP` aus `@/lib/antrag-status`, `X` aus `lucide-react` fuer Zuruecksetzen-Button.  
**GOTCHA:**

- `searchParams` ist in Next.js 16 ein Promise: `const { status, suche } = await searchParams`
- SQLite `contains` ist case-insensitive by default; keine zusaetzliche Konfiguration noetig
- Der Status-Wert aus der URL ist ein String; muss gegen das Enum validiert werden: `Object.values(AntragStatus).includes(status as AntragStatus)` oder Pruefung gegen `ANTRAG_STATUS_MVP.some(s => s === status)`
- Wenn sowohl Status als auch Suche gesetzt sind, muessen beide Filter im `AND` kombiniert werden
- Der "Zuruecksetzen"-Link muss auf `/antraege` ohne Query-Parameter verweisen
- Das Suchformular muss den aktuellen Statusfilter als Hidden-Field mitfuehren, damit die Suche im Kontext des Statusfilters arbeitet

**ACCEPTANCE CRITERIA:**

- [ ] Statusfilter-Buttons zeigen "Alle" sowie die MVP-Statuswerte "Entwurf" und "Eingereicht"
- [ ] Klick auf einen Statusfilter-Button filtert die Liste und zeigt den aktiven Status visuell an
- [ ] Suchfeld filtert die Liste nach Titel (Teilstring-Suche)
- [ ] Statusfilter und Suche koennen kombiniert werden
- [ ] "Zuruecksetzen" entfernt alle Filter
- [ ] Tabelle zeigt eine zusaetzliche Spalte "Kosten" formatiert in CHF
- [ ] Leerer gefilterter Zustand zeigt passende Meldung
- [ ] `Antragstellerin` sieht nur eigene Antraege (auch gefiltert)
- [ ] `Admin` sieht alle Antraege (auch gefiltert)
- [ ] `npm run build` ist gruen

**VALIDATE:**

- Manuelle Pruefung: `npm run dev`, dann als `applicant@example.com` und `admin@example.com` Filter und Suche ausprobieren
- `npm run build`

### Task 3: UPDATE `src/app/(app)/page.tsx` – Dashboard-Karten klickbar machen

**Status:** planned  
**Ziel:** Die drei Dashboard-Karten (Antraege, Eingereicht, Genehmigt) sind als `Link`-Komponenten klickbar und fuehren zu gefilterten Listenansichten.  
**IMPLEMENT:**

- Die Karte "Meine Weiterbildungsantraege" / "Alle Weiterbildungsantraege" mit `Link` zu `/antraege` umschliessen
- Die Karte "Eingereicht" mit `Link` zu `/antraege?status=EINGEREICHT` umschliessen
- Die Karte "Genehmigt" mit `Link` zu `/antraege?status=GENEHMIGT` umschliessen (Hinweis: `GENEHMIGT` ist nicht in `ANTRAG_STATUS_MVP` – die Karte verlinkt trotzdem, da der Statuswert im Enum vorhanden ist und Seed-Daten diesen Status enthalten koennen; die Liste zeigt dann korrekt die gefilterten Antraege. Der Filter-Button fuer `GENEHMIGT` wird auf der Listenseite nicht angezeigt, aber die direkte URL funktioniert.)
- Karten erhalten `hover:bg-muted/50` und `cursor-pointer` visuelles Feedback, um Klickbarkeit zu signalisieren

**PATTERN:** Bestehende `Card`-Komponenten im Dashboard; `Link` von `next/link`.  
**IMPORTS:** `Link` aus `next/link` (bereits importiert).  
**GOTCHA:**

- `Link` umschliesst das gesamte `Card`-Element; die innere Struktur (CardHeader, CardContent) bleibt unveraendert
- Die Karte "Genehmigt" verlinkt auf einen Status, der nicht in `ANTRAG_STATUS_MVP` ist – das ist beabsichtigt, da die URL-basierte Filterung alle Enum-Werte akzeptiert und Seed-Daten `GENEHMIGT`-Antraege enthalten
- Das `Card`-Styling soll durch den `Link` nicht gebrochen werden; `Link` als Block-Element rendern (`className="block"`)

**ACCEPTANCE CRITERIA:**

- [ ] Klick auf "Meine/Antraege"-Karte fuehrt zu `/antraege`
- [ ] Klick auf "Eingereicht"-Karte fuehrt zu `/antraege?status=EINGEREICHT`
- [ ] Klick auf "Genehmigt"-Karte fuehrt zu `/antraege?status=GENEHMIGT`
- [ ] Karten zeigen visuelles Hover-Feedback
- [ ] `npm run build` ist gruen

**VALIDATE:**

- Manuelle Pruefung: `npm run dev`, als `applicant@example.com` und `admin@example.com` auf die Dashboard-Karten klicken
- `npm run build`

### Task 4: UPDATE `src/app/(app)/antraege/loading.tsx` – Skeleton an neue Spalten anpassen

**Status:** planned  
**Ziel:** Das Lade-Skeleton spiegelt die neue Spaltenanzahl der Tabelle wider.  
**IMPLEMENT:**

- Die Skeleton-Zeile von `h-10 w-full` auf mehrere `Skeleton`-Elemente pro Zeile aendern, die die Spaltenbreiten der Tabelle grob abbilden (Titel, Anbieter, Status, Kosten, Startdatum, Erstellt am, Aktion)
- Alternativ: Skeleton unveraendert lassen, wenn die Spaltenanzahl visuell nicht relevant ist (aktuell 6 Spalten vorher, 7 Spalten nachher – Unterschied minimal)

**PATTERN:** Bestehendes `loading.tsx` in `antraege/`.  
**IMPORTS:** `Skeleton` aus `@/components/ui/skeleton` (bereits importiert).  
**GOTCHA:**

- Das Skeleton dient nur als visueller Platzhalter waehrend des Ladens; keine exakte Spaltenabbildung noetig
- Eine minimale Anpassung (z.B. `h-8 w-full` statt `h-10 w-full`) reicht aus, wenn die neue Spalte nur marginalen Einfluss hat

**ACCEPTANCE CRITERIA:**

- [ ] Loading-Skeleton zeigt waehrend des Ladens eine angemessene Platzhalter-Darstellung
- [ ] Kein visueller Bruch beim Uebergang von Skeleton zu Tabelle

**VALIDATE:**

- Manuelle Pruefung: `npm run dev`, Navigation mit langsamer Netzwerk-Simulation (DevTools)
- `npm run build`

### Task 5: UPDATE `__tests__/unit/antrag-status.test.ts` – Test fuer ANTRAG_STATUS_MVP

**Status:** planned  
**Ziel:** Unit-Tests decken die neue MVP-Statuskonstante ab.  
**IMPLEMENT:**

- Fuer jeden Wert in `ANTRAG_STATUS_MVP` pruefen, dass er im `ANTRAG_STATUS_LABEL`-Record enthalten ist
- Pruefen, dass `ANTRAG_STATUS_MVP` nur Werte enthaelt, die auch im `AntragStatus`-Enum definiert sind
- Pruefen, dass `ANTRAG_STATUS_MVP` die erwartete Laenge hat (2)

**PATTERN:** Bestehende `describe`/`it`/`expect`-Struktur in `antrag-status.test.ts`.  
**IMPORTS:** `ANTRAG_STATUS_MVP` (neu), `ANTRAG_STATUS_LABEL` (bereits importiert).  
**GOTCHA:**

- Tests muessen nicht jeden Enum-Wert einzeln durchgehen – die Konsistenz mit `ANTRAG_STATUS_LABEL` reicht als indirekter Test
- `Expect(ANTRAG_STATUS_MVP).toHaveLength(2)` als explizite Erwartung

**ACCEPTANCE CRITERIA:**

- [ ] Test bestaetigt, dass `ANTRAG_STATUS_MVP` die richtigen Werte enthaelt
- [ ] Test bestaetigt, dass alle Werte gueltige Enum-Werte sind
- [ ] `npm run test` ist gruen

**VALIDATE:**

- `npm run test`

### Task 6: UPDATE `e2e/antraege.spec.ts` – E2E-Tests fuer Statusfilter und Suche

**Status:** planned  
**Ziel:** Automatisierte E2E-Tests bestaetigen den Statusfilter- und Such-Flow.  
**IMPLEMENT:**

- Neuer Testfall "Applicant kann Antraege nach Status filtern": Login als `applicant@example.com`, Navigation zu `/antraege`, Klick auf "Eingereicht"-Filter-Button, Pruefung dass alle sichtbaren Zeilen den Status "Eingereicht" zeigen, Klick auf "Alle", Pruefung dass wieder alle Antraege sichtbar sind
- Neuer Testfall "Applicant kann Antraege nach Titel durchsuchen": Login als `applicant@example.com`, Navigation zu `/antraege`, Eingabe eines Suchbegriffs (aus Seed-Daten bekannt, z.B. Teil eines Titels), Submit, Pruefung dass nur passende Zeilen sichtbar sind
- Login-Helper `loginAsApplicant` aus bestehendem Test wiederverwenden
- Beide Tests nutzen eindeutige Selektoren (Rollen-basierte `getByRole`, Text-basierte `locator`)

**PATTERN:** Bestehende Teststruktur in `e2e/antraege.spec.ts`; `loginAsApplicant`-Helper.  
**IMPORTS:** `test`, `expect` aus `@playwright/test` (bereits importiert).  
**GOTCHA:**

- Die Seed-Daten enthalten Antraege mit Status `ENTWURF`, `EINGEREICHT` und `GENEHMIGT`; der Test muss mit diesen Daten arbeiten
- Nach dem Klick auf einen Filter-Button aendert sich die URL; `waitForURL` oder `expect(page).toHaveURL(...)` kann zur Synchronisation genutzt werden
- Der Test darf keine neuen Antraege erstellen, die spaetere Testlaeufe stoeren; Filter-Tests sind lesend und idempotent
- Playwright benoetigt einen laufenden Dev-Server (`npm run dev`)

**ACCEPTANCE CRITERIA:**

- [ ] Statusfilter-Test laeuft erfolgreich gegen lokalen Dev-Server
- [ ] Suchfilter-Test laeuft erfolgreich gegen lokalen Dev-Server
- [ ] Tests sind unabhaengig von der Reihenfolge der Seed-Daten

**VALIDATE:**

- `npm run test:e2e` (Dev-Server muss laufen)

### Task 7: VALIDATE Gesamtintegration

**Status:** planned  
**Ziel:** End-to-End-Stabilitaet des Features ist bestaetigt.  
**IMPLEMENT:**

- `npm run test` ausfuehren
- `npm run build` ausfuehren
- Manuelle Pruefung in mehreren Rollen (siehe unten)
- Ergebnisse in dieser Plan-Datei dokumentieren

**PATTERN:** Wie im Foundation-Feature dokumentiert (`plan-v002` Task 8).  
**IMPORTS:** Keine.  
**GOTCHA:** Better-Auth-Secret-Warnungen sind erwartbar, brechen `build` aber nicht.  
**ACCEPTANCE CRITERIA:**

- [ ] `npm run test` ist gruen
- [ ] `npm run build` ist gruen
- [ ] `npm run test:e2e` ist gruen (falls ausgefuehrt)
- [ ] Manuelle Pruefung passt zum MVP-Scope

**VALIDATE:**

- `npm run test`
- `npm run build`
- `npm run test:e2e` (auf Anforderung)
- Manuelle Pruefung im Dev-Server siehe Validation Commands Level 4

## Testing Strategy

### Unit Tests

Vitest in `__tests__/unit/antrag-status.test.ts`:

- `ANTRAG_STATUS_MVP` enthaelt die erwarteten Werte
- Alle Werte in `ANTRAG_STATUS_MVP` sind gueltige Enum-Werte
- `ANTRAG_STATUS_MVP` ist eine Teilmenge aller Enum-Werte

### E2E Tests

Playwright in `e2e/antraege.spec.ts`:

- Statusfilter: Login als Applicant, Filter-Button klicken, gefilterte Liste pruefen
- Titelsuche: Login als Applicant, Suchbegriff eingeben, gefilterte Liste pruefen

### Regression Tests

- Bestehende E2E-Tests (`antraege.spec.ts`, `roles.spec.ts`) duerfen nicht brechen
- Bestehende Unit-Tests (`antrag-status.test.ts`, `antrag.test.ts`) muessen gruen bleiben
- Dashboard bleibt fuer Applicant und Admin funktional
- Detailseite und Bearbeiten-Flow bleiben unveraendert

### Edge Cases

- Leerer Suchbegriff: zeigt alle Antraege (kein Filter)
- Ungueltiger Status in URL (z.B. `?status=UNGUELTIG`): wird ignoriert, zeigt alle Antraege
- Status UND Suche gleichzeitig: beide Filter werden mit AND kombiniert
- Keine Treffer bei Suche: leere Tabelle mit "Keine Antraege gefunden"
- Keine Treffer bei Statusfilter: leere Tabelle mit "Keine Antraege gefunden"
- Applicant mit Null Antraegen: Dashboard zeigt 0, Liste zeigt leeren Zustand
- Admin sieht Antraege anderer Nutzer im Filter korrekt
- URL-Manipulation: `?status=GENEHMIGT` funktioniert, obwohl der Status nicht als Filter-Button sichtbar ist (Seed-Daten enthalten GENEHMIGT)
- Browser-Zurueck-Button: Filter-Parameter bleiben in der Browser-History erhalten

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
2. Dashboard zeigt korrekte Anzahl Antraege; Klick auf "Eingereicht"-Karte fuehrt zu `/antraege?status=EINGEREICHT` und zeigt nur eingereichte Antraege
3. Auf `/antraege` Statusfilter-Buttons "Alle", "Entwurf", "Eingereicht" sind sichtbar
4. Klick auf "Entwurf" filtert die Liste korrekt; nur Entwuerfe sichtbar
5. Klick auf "Alle" zeigt wieder alle eigenen Antraege
6. Suchfeld: Eingabe eines Teils eines Titels, Submit; Liste zeigt nur passende Antraege
7. Kombination: Status "Entwurf" auswaehlen, dann Suchbegriff eingeben; beide Filter wirken zusammen
8. "Zuruecksetzen" entfernt alle Filter; volle Liste wieder sichtbar
9. Tabelle zeigt Spalte "Kosten" mit CHF-Betraegen
10. Login als `admin@example.com` / `a`: Admin sieht alle Antraege; Filter und Suche arbeiten auf dem gesamten Bestand
11. Leerer Zustand: Falls keine Antraege zum Filter passen, erscheint "Keine Antraege gefunden"

## Acceptance Criteria

- [ ] Antragstellerin kann ihre Antraege nach Status filtern
- [ ] Antragstellerin kann ihre Antraege nach Titel durchsuchen
- [ ] Statusfilter und Suche koennen kombiniert werden
- [ ] Admin kann alle Antraege filtern und durchsuchen
- [ ] Tabelle zeigt zusaetzliche Spalte "Kosten" in CHF
- [ ] Dashboard-Karten sind klickbar und fuehren zu gefilterten Listenansichten
- [ ] Aktiver Filter wird visuell hervorgehoben
- [ ] "Zuruecksetzen" entfernt alle Filter
- [ ] Leerer gefilterter Zustand zeigt passende Meldung
- [ ] Unit-Tests fuer `ANTRAG_STATUS_MVP` sind gruen
- [ ] E2E-Tests fuer Statusfilter und Suche sind gruen
- [ ] `npm run build` ist gruen
- [ ] Keine Regressionen in Dashboard, Detailseite, Bearbeiten-Flow
- [ ] Dokumentationsbedarf ist notiert

## Completion Checklist

- [ ] Alle Tasks sind umgesetzt
- [ ] Jeder Task wurde validiert
- [ ] Alle relevanten Tests laufen erfolgreich oder Ausnahmen sind begruendet
- [ ] `npm run build` wurde bei groesseren Aenderungen ausgefuehrt oder begruendet ausgelassen
- [ ] Manuelle Pruefung ist dokumentiert
- [ ] Plan-/PRD-Abweichungen sind dokumentiert und genehmigt
- [ ] Feature ist bereit fuer `/document` und `/commit`

## Documentation Notes

Spaetere Dokumentation sollte mindestens festhalten:

- Statusfilter- und Suchfunktion auf der Antragsliste
- URL-basierte Filterung (Bookmarks, Teilen von gefilterten Ansichten)
- Dashboard-Integration mit klickbaren Status-Karten
- dass die Filter-UI nur MVP-relevante Statuswerte anzeigt, aber alle Enum-Werte per URL erreichbar sind
- Hinweise fuer Studierende, wie sie URL-Search-Params in Server Components nutzen koennen

## Notes and Trade-offs

- **URL-basiert statt Client-State**: Filter werden als URL-Parameter uebertragen, nicht als Client-seitiger React-State. Das ist einfacher, bookmarkbar und kompatibel mit Server Components. Nachteil: Jede Filteraenderung loest eine Server-Roundtrip aus. Fuer Demo-Datenvolumen und lokalen Betrieb ist das akzeptabel.
- **MVP-Statuswerte im Filter**: Nur `ENTWURF` und `EINGEREICHT` werden als Filter-Buttons angeboten, da dies die im MVP aktiven Statuswerte sind. `GENEHMIGT` ist nur ueber die Dashboard-Karte erreichbar. `IN_RUECKFRAGE`, `ABGELEHNT`, `ZURUECKGEZOGEN` sind technisch vorhanden, aber nicht als Buttons sichtbar.
- **Suchformular mit Hidden-Statusfeld**: Das Suchformular fuehrt den aktuellen Statusfilter als Hidden-Field mit, damit die Suche den Statusfilter nicht zuruecksetzt. Diese Kopplung ist bewusst einfach gehalten.
- **Keine Paginierung**: Bei Demo-Daten (3 Seed + manuell erstellte) ist Paginierung nicht noetig. Kann spaeter ergaenzt werden.

## Offene Fragen

- Keine blockierenden Fragen. `GENEHMIGT`-Dashboard-Karte verlinkt auf einen Status, der nicht als Filter-Button sichtbar ist – im Plan dokumentiert und als bewusste Entscheidung markiert.

## Plan Review Notes

Nicht relevant fuer `plan-v001.md`. Wird durch `/integrate-feature-plan-review` in `plan-v002.md` ergaenzt.