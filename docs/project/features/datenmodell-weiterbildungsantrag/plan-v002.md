# Plan: Datenmodell Weiterbildungsantrag

## Status

**Feature-Status:** in_progress  
**Erstellt:** 2026-06-03  
**Plan-Version:** v002  
**Quelle:** User Request `/plan-feature Datenmodell Weiterbildungsantrag`, `docs/project/prds/self-service-portal-v002.md` und Review-Integration `plan-v001-r01`  
**Confidence Score:** 10/10 - Die Review hat die wichtigsten Execute-Luecken geschlossen: konkrete Prisma-Typen, klare Reihenfolge, betroffene Altpfade, verbindliche Generate-/Reset-Sequenz und PRD-konforme MVP-Abgrenzung fuer Admin-/Reviewer-Logik sind jetzt explizit dokumentiert.

## Feature Metadata

| Feld | Wert |
|---|---|
| Feature-Typ | New Capability |
| Plan-Version | v002 |
| Komplexitaet | Medium |
| Primaer betroffene Systeme | Prisma / Server Actions / Route Handler / UI / Tests / Services |
| Abhaengigkeiten | Prisma 7 + SQLite, Better Auth Rollen, bestehender `Antrag`-Flow, PRD `self-service-portal-v002.md`, kein neues npm-Paket |

## Plan-Aenderungshistorie

| Version | Datum | Anlass | Kurzbeschreibung |
|---|---|---|---|
| v001 | 2026-06-03 | Initiale Planung | Erster Feature-Plan fuer das fachliche Weiterbildungsantrags-Datenmodell erstellt |
| v002 | 2026-06-03 | Review-Integration r01 | Reihenfolge, Prisma-Typen, betroffene Altpfade, Generate-/Reset-Sequenz und MVP-Berechtigungen praezisiert |

Bei spaeteren Aenderungen ergaenzen `/integrate-feature-plan-review` oder `/update-feature-plan` neue Zeilen, ohne alte Eintraege zu entfernen.

## Feature Description

Das Feature ersetzt das noch generische Starter-Kit-Datenmodell des Objekts `Antrag` durch ein fachlich passendes Weiterbildungsantrags-Modell. Ziel ist nicht nur eine Prisma-Schema-Anpassung, sondern ein belastbares Fundament fuer alle spaeteren MVP-Features: Pflichtfelder, vollstaendiges Statusmodell, fiktive Seed-Daten, bereinigte Altpfade und ausreichend angepasste bestehende Codepfade, damit die Anwendung nach der Umstellung weiterhin lauffaehig, testbar und PRD-konform bleibt.

## User Story

```text
Als Antragstellerin
moechte ich, dass ein Weiterbildungsantrag die fachlich benoetigten Daten und Statuswerte korrekt abbildet,
damit spaetere Erfassung, Einreichung und Statusanzeige auf einem realistischen und konsistenten Datenmodell aufbauen.
```

## Problem Statement

Der aktuelle Stand nutzt noch ein Starter-Kit-Modell mit `titel`, optionaler `beschreibung` und einigen nicht mehr passenden Demo-Feldern wie `plzOrt` oder `kanton`. Das PRD `v002` verlangt hingegen ein klar definiertes MVP-Feldmodell fuer Weiterbildungsantraege und ein erweitertes Enum mit zukunftsfaehigen Statuswerten. Ohne diese Grundlage wuerden Folgefeatures auf einem fachlich falschen Schema planen oder beim Umsetzen in Konflikt mit Seed-Daten, generierten Prisma-Typen, Zod-Schemas, Status-Helpern, Services und bestehenden Seiten geraten.

## Solution Statement

Der geplante Ansatz entwickelt das bestehende Prisma-Modell `Antrag` evolutionaer zu einem Weiterbildungsantrag weiter, statt eine parallele Entitaet einzufuehren. Dabei werden PRD-konforme Felder und Statuswerte eingefuehrt, unpassende Demo-Felder entfernt, Seed-Daten auf fiktive Weiterbildungsfaelle umgestellt und die betroffenen bestehenden UI-/Action-/API-/Service-Pfade minimal so angepasst, dass das Repo nach der Schema-Aenderung weiterhin konsistent baut und getestet werden kann. Umfangreiche Formular-UX und Einreichungslogik werden bewusst in spaetere Features verschoben.

## Scope

### Im Scope

- Prisma-Enum `AntragStatus` auf PRD-Statuswerte erweitern
- Prisma-Modell `Antrag` fachlich zum Weiterbildungsantrag ausbauen
- Nicht mehr passende Demo-Felder aus dem Modell entfernen, wenn sie fuer das MVP keine Rolle mehr haben
- Bestehende Zod-Schemas, Status-Helper und Typen auf das neue Feld- und Statusmodell anheben
- Seed-Daten auf fiktive Weiterbildungsantraege umstellen
- Bestehende Seiten, Actions, Route Handlers und kritische Service-/Testpfade soweit anpassen, dass sie mit dem neuen Modell weiter funktionieren
- Reviewer-/Admin-Entscheidungslogik aus dem MVP-Portalfluss deaktivieren oder aus der UI entfernen
- Unit-Tests fuer Schema-, Status- und relevante Service-/Regressionsthemen aktualisieren oder ergaenzen

### Nicht im Scope

- Finales UX-Design fuer das Weiterbildungsformular
- Vollstaendige Einreichungs- und Bearbeitungslogik fuer alle Sonderfaelle
- Medium-/Extended-Funktionen wie Rueckfragen, Audit oder E-Mail-Mock
- Entfernung ganzer Starter-Kit-Seiten wie `/personen` oder `ai-demo`
- Playwright-E2E-Implementierung, solange kein ausdruecklicher Auftrag dazu vorliegt

## Rollen und Berechtigungen

Betroffene Rollen:

- `user_applicant`: fachliche Hauptrolle; eigenes Datenmodell fuer spaetere Erstellung, Bearbeitung und Einsicht
- `admin`: liest im MVP alle Antraege und kann eigene Demo-Antraege erstellen; darf im MVP keine fremden Antraege bearbeiten, einreichen oder entscheiden
- `user_reviewer`: bleibt technisch vorhanden, ist fuer dieses Foundation-Feature aber nicht Hauptkonsument und soll im MVP-Portalfluss keine aktive Entscheidungs-UI erhalten

Schutzregeln:

- Das Datenmodell darf keine neue Rolle einfuehren
- Bestehende Besitzregeln fuer Antragsdaten duerfen durch Schema-Aenderungen nicht versehentlich aufbrechen
- Bestehende PRD-widrige Demo-Entscheidungslogik fuer Admin/Reviewer darf in `plan-v002` nicht nur als Randnotiz verbleiben; sie muss im MVP-Portalfluss technisch neutralisiert oder klar deaktiviert werden
- Tests duerfen das bisherige PRD-widrige Verhalten nicht zementieren

## Context References

### Pflichtlektuere vor Umsetzung

- `docs/project/prds/self-service-portal-v002.md` - Warum: autoritative fachliche Quelle fuer MVP-Felder, Statuswerte, Seed-Richtung, Rollenregeln und Scope-Grenzen
- `AGENTS.md` - Warum: Projektkontext wurde auf lokale MVP-Backend-Logik harmonisiert und setzt den Rahmen fuer die Planung
- `KILO_INSTRUCTIONS.md` - Warum: nicht verhandelbare Stack- und Prisma-Regeln, inklusive `npx prisma generate` vor `npm run db:reset` und Verbot von Prisma Migrations
- `prisma/schema.prisma` - Warum: Ausgangspunkt fuer Enum-, Feld- und Relationen-Aenderungen
- `prisma/seed.ts` - Warum: bestehende Demo-Daten muessen fachlich auf Weiterbildungsantraege gedreht werden
- `src/lib/schemas/antrag.ts` - Warum: aktuelles Formular-/API-Schema ist zu generisch und muss mit dem Prisma-Modell konsistent bleiben
- `src/lib/antrag-status.ts` - Warum: Statuslabels, Badge-Varianten und erlaubte Uebergaenge spiegeln das Enum
- `src/lib/services/antragEmailService.ts` - Warum: nutzt aktuell `antrag.notizen` und ist deshalb bei Feldentfernung oder PRD-Abgrenzung betroffen
- `src/app/(app)/antraege/actions.ts` - Warum: Server Actions erzeugen und veraendern `Antrag`-Datensaetze
- `src/components/antraege/antrag-form.tsx` - Warum: bestehendes Formular wird durch neue Pflichtfelder direkt betroffen sein
- `src/app/(app)/antraege/[id]/page.tsx` - Warum: Detailseite zeigt heute noch veraltete Felder wie `plzOrt`, `kanton` und `notizen`
- `src/app/(app)/antraege/[id]/bearbeiten/page.tsx` - Warum: Bearbeiten-Flow setzt Default-Werte fuer alte Felder und muss auf das neue Modell gehoben werden
- `src/app/(app)/antraege/[id]/antrag-actions.tsx` - Warum: Einreichen-, Entscheiden- und Loeschen-UI muss gegen den MVP-Scope abgeglichen werden
- `src/app/(app)/page.tsx` - Warum: Dashboard zeigt Statuszaehler und ist sinnvoller Smoke-Check fuer Enum- und MVP-Sprache
- `src/app/api/antraege/route.ts` - Warum: bestehende API-Pfade validieren und erstellen `Antrag`-Datensaetze ebenfalls
- `src/app/api/antraege/[id]/route.ts` - Warum: Detail-/Update-API nutzt dieselben Modell- und Rollenregeln
- `__tests__/unit/schemas/antrag.test.ts` - Warum: direktes Testmuster fuer Zod-Schema-Aenderungen
- `__tests__/unit/antrag-status.test.ts` - Warum: direktes Testmuster fuer Statuskonstanten und Transitionen
- `__tests__/unit/services/antragEmailService.test.ts` - Warum: bestehender Service-Test kann alte Datenstruktur konservieren

### Relevante Dokumentation

- [Prisma ORM Schema Reference](https://www.prisma.io/docs/orm/reference/prisma-schema-reference) - Warum: referenziert Enum-, Feld- und SQLite-kompatible Modellierung fuer die geplante Schema-Aenderung
- [Prisma db push](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#db-push) - Warum: bestaetigt den projektkonformen Schema-Update-Weg ohne Migrationsdateien
- [Zod Documentation](https://zod.dev/) - Warum: relevant fuer objektuebergreifende Validierung wie `enddatum` nach `startdatum` und Zahlen-/Textgrenzen

## Codebase Intelligence

### Projektstruktur und Architektur

Das Repo folgt dem Starter-Kit-Muster mit App Router in `src/app`, UI-Komponenten in `src/components`, Fach- und Infrastrukturcode in `src/lib` sowie Prisma/Seed im Root. Schreibende Formularfluesse laufen primaer ueber Server Actions, waehrend Route Handlers als zusaetzliche API-Schicht weiter existieren. Das Datenmodell-Feature sitzt genau auf dieser Schnittstelle und muss deshalb Prisma, generierte Typen, Zod, Actions, API, Services und Anzeige gemeinsam betrachten.

### Patterns to Follow

- Naming: bestaetigte deutsche Fachbegriffe wie `antrag`, `antraege`, `begruendung`, `kostenstelle`; keine neue parallele Entitaet wie `TrainingRequest`
- Datei-Organisation: bestehende `antraege`-Pfade beibehalten und evolutionaer anpassen, statt neue konkurrierende Ordnerstruktur einzufuehren
- Fehlerbehandlung: in Server Actions `throw new Error(...)`, in Route Handlers `NextResponse.json({ error }, { status })`
- UI/shadcn: Formulare ueber `react-hook-form` + Zod + Komponenten aus `@/components/ui`
- Auth/Rollen: Rollen aus `src/lib/auth-helpers.ts` weiterverwenden; keine neue Autorisierungsschicht erfinden
- Prisma: bestehendes Modell `Antrag` und Singleton `src/lib/prisma.ts` erweitern; keine direkte Parallelstruktur oder Raw SQL
- Parsing: Server Actions und Route Handlers sollen dieselben Feldregeln fuer Datum und `kostenChf` anwenden; falls noetig ist ein kleiner Mapper/Helper erlaubt

### Anti-Patterns to Avoid

- Kein neues zweites Modell neben `Antrag`, wenn nur der Fachinhalt geaendert wird
- Keine stillen PRD-Abweichungen wie Beibehaltung fachfremder Felder ohne Begruendung
- Keine Statuskonstanten, die vom Prisma-Enum und den Tests abweichen
- Kein manueller Eingriff in generierte Prisma-Dateien unter `src/generated/prisma/`
- Kein Belassen PRD-widriger Admin-/Reviewer-Entscheidungs-UI im MVP-Portalfluss
- Keine doppelte, widerspruechliche Parsing-Logik fuer dieselben Felder in API und Server Actions

### Dependency Analysis

Bestehende Dependencies reichen aus: Prisma 7, Better Auth, Zod, React Hook Form, Next.js 16, Vitest. Es ist kein neues Paket erforderlich. Relevante Integrationspunkte sind bereits im Repo vorhanden; das Risiko liegt in gekoppelten Aenderungen, nicht in fehlenden Libraries.

### Testing Patterns

Vitest-Tests liegen unter `__tests__/unit/` und pruefen heute bereits Zod-Schemas, Statuskonstanten und Services. Dieses Feature sollte dasselbe Muster verwenden: direkte `safeParse`-Assertions fuer Schemafaelle, explizite Erwartungen fuer Labels/Transitionen und Regressionen fuer Service-Pfade, die alte Felder referenzieren. E2E bleibt optional und wird hier nicht vorgezogen.

## Architekturentscheidungen

### Gewaehlter Ansatz

Das Feature haelt am bestehenden Modellnamen `Antrag` fest und veraendert nur Semantik und Felder. Dadurch bleiben Imports, Relationen und Routen stabil, waehrend die Fachlichkeit auf Weiterbildungsantraege angehoben wird. Weil neue Pflichtfelder bestehende Create-/Update-Pfade brechen wuerden, umfasst das Feature auch einen Kompatibilitaetsring aus minimalen Anpassungen in Form, Actions, Bearbeiten-Flow, API, Detailansicht und betroffenen Service-/Testpfaden.

### Erwaegte Alternativen

- Alternative: neues Prisma-Modell `Weiterbildungsantrag` neben `Antrag` - Entscheidung: nicht gewaehlt, weil es parallelisierte Architektur, doppelten Migrationsaufwand und unnoetige Umbauten in Actions, APIs und Tests erzeugen wuerde
- Alternative: nur Prisma-Schema und Seed anpassen, UI/API spaeter nachziehen - Entscheidung: nicht gewaehlt, weil das Repo dadurch zwischenzeitlich nicht mehr lauffaehig waere
- Alternative: neue Felder vorerst optional modellieren - Entscheidung: nicht bevorzugt, weil das PRD klare MVP-Pflichtfelder fordert und spaetere Features sonst auf einem verwaesserten Modell starten

### Security, Performance, Maintainability

- Security: alle neuen Eingabefelder muessen serverseitig ueber Zod validiert bleiben; Besitz- und Rollenregeln duerfen durch Refactorings nicht versehentlich verschwinden
- Performance: Auswirkungen sind gering; relevant ist nur, unnoetige doppelte Queries bei Anpassung von Listen/Details zu vermeiden
- Maintainability: ein zentrales Modell, ein zentrales Zod-Schema und konsistente Statuskonstanten senken Folgeaufwand fuer spaetere Features deutlich

## Datenmodell und Prisma

Geplante Aenderung:

- `AntragStatus` um `IN_RUECKFRAGE` und `ZURUECKGEZOGEN` erweitern
- `Antrag` mindestens um PRD-Felder `anbieter: String`, `startdatum: DateTime`, `enddatum: DateTime?`, `kostenChf: Float`, `kostenstelle: String`, `begruendung: String`, `bemerkung: String?` erweitern
- `titel` bleibt als `String` bestehen und wird fachlich als Weiterbildungstitel weiterverwendet
- `beschreibung` soll im Zielzustand durch `begruendung` und `bemerkung` ersetzt werden; Execute darf keine dauerhafte Parallelpflege von `beschreibung` einbauen
- bisherige Demo-Felder wie `plzOrt`, `kanton`, `kiAnalyse`, `dateiPfad`, `dateiName` kritisch pruefen und fuer dieses MVP-Foundation-Feature entfernen, wenn sie keine aktive PRD-Funktion tragen
- `notizen` darf nicht stillschweigend entfernt werden, ohne `src/lib/services/antragEmailService.ts` und dessen Tests mitzuziehen; Execute muss entweder diesen Pfad entkoppeln oder eine bewusst dokumentierte technische Uebergangsloesung schaffen
- bestehende Relationen zu `User` beibehalten

Parsing- und Serialisierungsregeln:

- FormData liefert Strings; `startdatum`, `enddatum` und `kostenChf` muessen vor Zod/Prisma konsistent in rohe Validierungswerte ueberfuehrt werden
- `kostenChf` wird fuer dieses Starter-Kit als `Float` gespeichert; die Zod-Validierung sichert den Demo-Plausibilitaetsbereich ab
- leere optionale Texte wie `bemerkung` und leeres `enddatum` sollen konsistent als `undefined` bzw. `null` gehandhabt werden, nicht als leere Pflichtwerte

Wichtiger Umsetzungs-Hinweis: Nach Umsetzung von Schema-Aenderungen muss der Agent zuerst `npx prisma generate` und danach an geeigneter Stelle `npm run db:reset` ausfuehren. Prisma Migrations werden nicht verwendet.

## Betroffene Dateien

### Bestehende Dateien

- `AGENTS.md` - bereits harmonisiert; Referenz fuer lokale MVP-Architektur
- `prisma/schema.prisma` - fachliches Kernmodell und Status-Enum
- `prisma/seed.ts` - fiktive Weiterbildungs-Demo-Daten
- `src/lib/schemas/antrag.ts` - Zod-Schema fuer neues Feldmodell und Status-Enum
- `src/lib/antrag-status.ts` - Labels, Varianten und Uebergaenge
- `src/lib/services/antragEmailService.ts` - Service-Pfad fuer `notizen`-/Benachrichtigungsaltlasten
- `src/app/(app)/antraege/actions.ts` - Server Actions fuer Create/Update/Submit auf neuem Modell
- `src/components/antraege/antrag-form.tsx` - Pflichtfelder und Formularwerte
- `src/app/(app)/antraege/neu/page.tsx` - Erstell-Seite fuer das neue Feldmodell
- `src/app/(app)/antraege/page.tsx` - Listenansicht und angezeigte Felder
- `src/app/(app)/antraege/[id]/page.tsx` - Detailansicht ohne alte Demo-Felder und ohne PRD-widrige Entscheidungs-UI
- `src/app/(app)/antraege/[id]/bearbeiten/page.tsx` - Bearbeiten-Flow mit neuen Default-Werten
- `src/app/(app)/antraege/[id]/antrag-actions.tsx` - UI-Buttons fuer Einreichen, Loeschen und Entfernen/Deaktivieren von Entscheidungsaktionen
- `src/app/(app)/page.tsx` - Dashboard als Smoke-Check fuer Statuszaehler und MVP-Sprache
- `src/app/api/antraege/route.ts` - API-Create-/List-Kompatibilitaet
- `src/app/api/antraege/[id]/route.ts` - API-Detail-/Update-Kompatibilitaet
- `__tests__/unit/schemas/antrag.test.ts` - Unit-Tests fuer neues Feldmodell
- `__tests__/unit/antrag-status.test.ts` - Unit-Tests fuer Enum-/Transitionsanpassung
- `__tests__/unit/services/antragEmailService.test.ts` - Regression fuer Service-Pfad und alte Feldreferenzen

### Neue Dateien

- Keine neuen Dateien zwingend erforderlich; ein kleiner FormData-Mapping-Helper ist erlaubt, aber nur wenn er doppelte Parsing-Logik spuerbar reduziert

## Implementation Plan

### Phase 1: Foundation

Prisma-Enum und `Antrag`-Modell auf PRD `v002` anheben, Prisma Client neu generieren und daraus die zentrale Schema-/Typbasis ableiten.

### Phase 2: Core Implementation

Status-/Zod-Logik, Seed und Reset auf das neue Feldmodell umstellen, damit die Anwendung mit aktualisierten generierten Typen wieder auf einen belastbaren Datenzustand kommt.

### Phase 3: Integration

Server Actions, Formular, Bearbeiten-Flow, Listen-, Detail-, API- und Service-Pfade anpassen, alte Demo-Felder entfernen und PRD-widrige Entscheidungs-UI im MVP neutralisieren.

### Phase 4: Testing and Validation

Vitest-Tests aktualisieren, Build-Stabilitaet pruefen und manuelle Smoke-Checks fuer Seed, Erstellen, Anzeigen, Rollenverhalten und Dashboard dokumentieren.

## Step-by-Step Tasks

Wichtig: Tasks top-to-bottom ausfuehren. Jeder Task ist atomic und einzeln validierbar.

### Task 1: UPDATE `prisma/schema.prisma`

**Status:** done  
**Ziel:** Das persistente Datenmodell bildet den PRD-konformen Weiterbildungsantrag fachlich korrekt und typisiert ab.  
**IMPLEMENT:** Erweitere `AntragStatus` auf alle in PRD `v002` dokumentierten Statuswerte und entwickle das Modell `Antrag` von der generischen Demo-Struktur zum Weiterbildungsantrag mit den MVP-Feldern weiter. Lege Prisma-Typen fest: `startdatum DateTime`, `enddatum DateTime?`, `kostenChf Float`. Pruefe alte Demo-Felder kritisch und entferne Felder ohne PRD-Funktion nur dann, wenn alle aktiven Referenzen im weiteren Plan mitgezogen werden.  
**PATTERN:** Bestehende Better-Auth-Modelle und die Relation `User` -> `Antrag` in `prisma/schema.prisma` beibehalten; nur das Prozessobjekt evolutionaer anpassen.  
**IMPORTS:** Keine neuen Imports; nur Prisma-Schema-Aenderungen.  
**GOTCHA:** Wenn neue Pflichtfelder oder entfernte Felder im Schema eingefuehrt werden, muessen Folgepfade im selben Feature nachgezogen werden; generierte Prisma-Dateien nicht manuell editieren.  
**ACCEPTANCE CRITERIA:**

- [x] `AntragStatus` enthaelt mindestens `ENTWURF`, `EINGEREICHT`, `IN_RUECKFRAGE`, `GENEHMIGT`, `ABGELEHNT`, `ZURUECKGEZOGEN`
- [x] `Antrag` enthaelt alle in PRD `v002` geforderten MVP-Felder fuer Weiterbildungsantraege mit konkret festgelegten Prisma-Typen
- [x] Nicht mehr benoetigte Demo-Felder sind bewusst entfernt oder im Plan nachvollziehbar begruendet beibehalten

**VALIDATE:**

- Manuelle Pruefung: Schema gegen PRD `v002` querlesen
- Naechster Pflichtschritt ist `npx prisma generate` in Task 2; `npm run test` ist an diesem Zwischenstand noch nicht die aussagekraeftigste Validierung
- Ergebnis 2026-06-03: Schema manuell gegen PRD `v002` abgeglichen. `AntragStatus` erweitert, Pflichtfelder `anbieter`, `startdatum`, `kostenChf`, `kostenstelle`, `begruendung` sowie optionale Felder `enddatum`, `bemerkung` hinzugefuegt. Alte Demo-Felder `beschreibung`, `plzOrt`, `kanton`, `dateiPfad`, `dateiName`, `notizen`, `kiAnalyse` bewusst aus dem Prisma-Modell entfernt; aktive Referenzen bleiben fuer Folge-Tasks 3 bis 7 eingeplant.

### Task 2: UPDATE generierte Prisma-Typen via `npx prisma generate`

**Status:** planned  
**Ziel:** Alle Folgepfade arbeiten mit aktualisierten Prisma-Typen und Enums.  
**IMPLEMENT:** Fuehre direkt nach der Schema-Aenderung `npx prisma generate` aus, damit `src/generated/prisma/` den neuen Enum- und Feldstand korrekt widerspiegelt.  
**PATTERN:** Projektregel aus `KILO_INSTRUCTIONS.md`: erst `npx prisma generate`, dann spaeter `npm run db:reset`.  
**IMPORTS:** Keine.  
**GOTCHA:** Ohne diesen Schritt schlagen Seed und typisierte Folgeaenderungen mit neuen Feldern oder Enums fehl.  
**ACCEPTANCE CRITERIA:**

- [ ] Der generierte Prisma Client kennt die neuen Felder und Statuswerte
- [ ] Nachfolgende TypeScript-Dateien koennen gegen den aktualisierten Client angepasst werden

**VALIDATE:**

- `npx prisma generate`
- Manuelle Pruefung: keine manuelle Bearbeitung unter `src/generated/prisma/`

### Task 3: UPDATE `src/lib/schemas/antrag.ts` und `src/lib/antrag-status.ts`

**Status:** planned  
**Ziel:** Zentrale Validierungs- und Statuskonstanten sind mit Prisma, PRD und dem neuen Feldmodell synchron.  
**IMPLEMENT:** Erweitere das Create-/Update-Schema auf die neuen Felder und Regeln, inklusive Datums- und Zahlenvalidierung. Aktualisiere Status-Enum, Labels, Badge-Varianten und erlaubte Transitionen auf das neue Enum. Dokumentiere eine gemeinsame Parsing-Strategie fuer rohe FormData-/JSON-Werte.  
**PATTERN:** Bestehende Zod-Schema-Datei und bestehende Status-Konstanten in einer einzelnen Helper-Datei fortfuehren.  
**IMPORTS:** Weiterhin `zod` sowie `AntragStatus` aus generierten Prisma-Enums verwenden.  
**GOTCHA:** `update`-Semantik sauber definieren; entweder alle Pflichtfelder fuer bestehende Form-Patterns verlangen oder bewusst ein partielles Schema einfuehren und im Plan begruenden.  
**ACCEPTANCE CRITERIA:**

- [ ] Zod-Schemas decken alle MVP-Felder ab
- [ ] Datumslogik fuer optionales `enddatum` gegen `startdatum` ist serverseitig dokumentiert und validierbar
- [ ] Status-Helper koennen alle neuen Enum-Werte ohne TypeScript-Loch darstellen
- [ ] Es gibt keine widerspruechlichen Feldregeln zwischen geplantem API- und Server-Action-Parsing

**VALIDATE:**

- Manuelle Pruefung: Schemafaelle gegen PRD-Tabelle fuer Feldgrenzen querpruefen
- `npm run test` ist spaetestens nach Task 7 verbindlich gruen; in diesem Zwischenstand koennen Altpfade noch nachgezogen werden muessen

### Task 4: UPDATE `prisma/seed.ts` und validiere Reset-Sequenz

**Status:** planned  
**Ziel:** Seed-Daten spiegeln ausschliesslich fiktive Weiterbildungsantraege und das neue Feldmodell.  
**IMPLEMENT:** Ersetze generische oder fachfremde Demo-Inhalte durch fiktive Weiterbildungsantraege mit realistisch wirkenden, aber nicht produktiven Anbieter-, Kostenstellen- und Begruendungstexten. Nutze nur Statuswerte, die zum MVP-Storytelling passen. Fuehre nach der Seed-Anpassung `npm run db:reset` aus.  
**PATTERN:** Bestehende Seed-Struktur mit Better-Auth-Testnutzern und `createMany` fuer `antrag` beibehalten.  
**IMPORTS:** Keine neuen Packages; bestehende Prisma- und Auth-Imports weiterverwenden.  
**GOTCHA:** Seed-Daten muessen zu Pflichtfeldern passen; sonst bricht `db:reset` direkt.  
**ACCEPTANCE CRITERIA:**

- [ ] Seed erstellt nur fiktive Weiterbildungsfaelle
- [ ] Alle Pflichtfelder des neuen Datenmodells sind in den Seed-Datensaetzen sinnvoll gefuellt
- [ ] Seed verwendet keine fachfremden Inhalte wie Urlaub oder Materialbestellung mehr

**VALIDATE:**

- `npm run db:reset`
- Manuelle Pruefung: Seed-Datensaetze in `prisma/seed.ts` gegen PRD-Feldmodell lesen

### Task 5: UPDATE `src/app/(app)/antraege/actions.ts`, `src/components/antraege/antrag-form.tsx` und `src/app/(app)/antraege/neu/page.tsx`

**Status:** planned  
**Ziel:** Bestehender Erstellfluss bleibt nach der Datenmodellumstellung funktionsfaehig und verwendet das neue Feldmodell konsistent.  
**IMPLEMENT:** Passe Server Actions und Formularwerte an das neue Feldmodell an, sodass neue Pflichtfelder korrekt geschrieben werden. Fuehre Datum- und `kostenChf`-Parsing entlang der in Task 3 dokumentierten gemeinsamen Strategie aus. Halte den Umfang bewusst minimal: keine finale UX-Politur, aber ein funktionierender MVP-kompatibler Formularsatz fuer den spaeteren Folgefeature-Aufbau.  
**PATTERN:** Weiterhin `react-hook-form` + `zodResolver` + `FormData`-Uebergabe an Server Actions verwenden.  
**IMPORTS:** Vorhandene shadcn-Form-Komponenten, `toast`, `useTransition`, Zod-Typen; kleiner Mapping-Helper nur wenn er echte Duplikate reduziert.  
**GOTCHA:** Wenn die Form in diesem Foundation-Feature nicht mindestens minimal mitzieht, brechen Create und Edit sofort durch neue Pflichtfelder.  
**ACCEPTANCE CRITERIA:**

- [ ] Formular und Server Actions schreiben alle benoetigten Pflichtfelder
- [ ] FormData-Parsing fuer Datum und `kostenChf` ist konsistent dokumentiert und umgesetzt
- [ ] Entwurfserstellung bleibt technisch moeglich

**VALIDATE:**

- Manuelle Pruefung: mit `npm run dev` als Antragstellerin neuen Weiterbildungsantrag anlegen und als Entwurf speichern

### Task 6: UPDATE `src/app/(app)/antraege/[id]/bearbeiten/page.tsx`, `src/app/(app)/antraege/[id]/antrag-actions.tsx`, `src/app/(app)/antraege/page.tsx`, `src/app/(app)/antraege/[id]/page.tsx`, `src/app/api/antraege/route.ts`, `src/app/api/antraege/[id]/route.ts`, `src/lib/services/antragEmailService.ts` und `src/app/(app)/page.tsx`

**Status:** planned  
**Ziel:** Bearbeiten-, Listen-, Detail-, API-, Service- und Dashboard-Pfade bleiben mit dem neuen Datenmodell konsistent und zeigen keine alten Demo-Felder oder PRD-widrige Entscheidungs-UI mehr.  
**IMPLEMENT:** Entferne Anzeige- und Serialisierungslogik fuer fachfremde Felder, ersetze sie durch sinnvolle Weiterbildungsantragsinformationen und stelle sicher, dass GET/POST/PUT-Pfade dieselben Zod-/Parsing-Regeln wie Server Actions verwenden. Hebe Bearbeiten-Seite und Default-Werte auf das neue Feldmodell. Deaktiviere oder entferne Reviewer-/Admin-Entscheidungsbuttons aus dem MVP-Portalfluss. Passe `antragEmailService` so an, dass entfernte Felder wie `notizen` nicht unkontrolliert Build oder Tests brechen. Nimm das Dashboard als Smoke-Check fuer Statuszaehler mit.  
**PATTERN:** Vorhandene Server-Component-Listen/Detailseiten, `NextResponse.json`-Route-Handler und bestehende Service-Struktur fortfuehren.  
**IMPORTS:** Bestehende Badge-, Card-, Table-, Auth- und Service-Imports weiterverwenden; nur feld- und rollenbezogene Anpassungen vornehmen.  
**GOTCHA:** Aktuelle Detailseite, Bearbeiten-Seite, API und Service sind stark auf `beschreibung`, `plzOrt`, `kanton`, `notizen` und Review-Statuswechsel zugeschnitten; nach der Modellumstellung drohen sonst Laufzeitfehler, irrefuehrende Anzeigen oder PRD-widriges Verhalten.  
**ACCEPTANCE CRITERIA:**

- [ ] Keine aktive Seite, API oder Service-Datei referenziert entfernte Demo-Felder unbeabsichtigt weiter
- [ ] Listen-, Detail- und Bearbeiten-Ansicht zeigen sinnvolle Weiterbildungsantragsdaten
- [ ] API-Validierung und Server-Rendering sind mit dem neuen Modell konsistent
- [ ] Reviewer-/Admin-Entscheidungs-UI ist fuer den MVP-Portalfluss deaktiviert oder entfernt

**VALIDATE:**

- Manuelle Pruefung: Liste, Detailansicht, Bearbeiten, Dashboard und API-Schema stichprobenartig gegen das neue Modell kontrollieren

### Task 7: UPDATE `__tests__/unit/schemas/antrag.test.ts`, `__tests__/unit/antrag-status.test.ts` und `__tests__/unit/services/antragEmailService.test.ts`

**Status:** planned  
**Ziel:** Die fachliche Grundlage und kritische Regressionen sind durch schnelle Unit-Tests abgesichert.  
**IMPLEMENT:** Erweitere Schema-Tests auf Pflichtfelder, Datumsregeln, Zahlenbereiche, Laengenregeln und optionale Felder. Erweitere Status-Tests auf Labels und Transitionen fuer das vollstaendige Enum. Passe Service-Tests so an, dass sie keine veraltete Feldstruktur konservieren.  
**PATTERN:** Bestehende `vitest`-Struktur mit `safeParse`, `expect(result.success)` und Konstantenpruefung spiegeln.  
**IMPORTS:** Nur bestehende Vitest- und Modul-Imports anpassen.  
**GOTCHA:** Tests sollen die neue Fachlichkeit absichern, nicht die alte generische Demo-Struktur konservieren oder PRD-widriges Rollenverhalten festschreiben.  
**ACCEPTANCE CRITERIA:**

- [ ] Unit-Tests decken die neuen Pflichtfelder, wichtigen Grenzwerte und Fehlfaelle ab
- [ ] Status-Tests enthalten die neuen Enum-Werte und relevante Transitionen
- [ ] Service-Tests sichern nur noch bewusst erhaltene Service-Verantwortung ab

**VALIDATE:**

- `npm run test`

### Task 8: VALIDATE Gesamtintegration

**Status:** planned  
**Ziel:** Der umgestellte Foundation-Stand ist als Basis fuer Folgefeatures stabil.  
**IMPLEMENT:** Fuehre nach Abschluss aller Code- und Testanpassungen die Gesamtvalidierung aus und dokumentiere manuelle Smoke-Checks fuer Applicant- und Admin-Sicht.  
**PATTERN:** Projektregel aus `KILO_INSTRUCTIONS.md`: nach groesseren Aenderungen `npm run build`, manuelle Pruefung ueber `npm run dev`.  
**IMPORTS:** Keine.  
**GOTCHA:** Erst diese Gesamtvalidierung liefert ein belastbares Signal; fruehere Zwischenzustaende koennen erwartbar unvollstaendig sein.  
**ACCEPTANCE CRITERIA:**

- [ ] `npm run test` ist gruen
- [ ] `npm run build` ist gruen
- [ ] Applicant- und Admin-Smoke-Checks passen zum MVP-Scope

**VALIDATE:**

- `npm run test`
- `npm run build`
- Manuelle Pruefung: Applicant erstellt Entwurf, Applicant sieht nur eigene Daten, Admin sieht alle Daten, aber keine fremde Bearbeitungs-/Entscheidungs-UI

## Testing Strategy

### Unit Tests

Vitest ist die Hauptabsicherung fuer dieses Feature. Besonders wichtig sind:

- positive und negative Zod-Faelle fuer alle Pflichtfelder
- `enddatum` darf nicht vor `startdatum` liegen
- `kostenChf` muss Zahlenbereich und Typ sauber pruefen
- leere Pflichtfelder sowie Laengenregeln fuer `titel`, `anbieter`, `kostenstelle`
- Statuslabels und Statustransitionen fuer alle Enum-Werte
- Regressionen fuer Service-Pfade, die frueher `notizen` oder andere Altfelder benutzt haben

### E2E Tests

Nicht primaer Teil dieses initialen Foundation-Features. E2E kann spaeter im Formular-/Workflow-Feature sinnvoller ergaenzt werden, wenn die UI nicht mehr nur minimal kompatibel ist.

### Regression Tests

Bestehende Schema-, Status- und relevante Service-Tests werden erweitert, nicht ersetzt. Falls waehrend der Umsetzung weitere Unit-Tests fuer API-Body-Parsing sinnvoll erscheinen, sollen sie im bestehenden `__tests__/unit/`-Muster ergaenzt werden.

### Edge Cases

- `enddatum` leer oder vor `startdatum`
- `kostenChf` negativ, zu hoch oder kein numerischer Wert
- FormData liefert Strings fuer Datum und Betrag
- leere optionale Texte wie `bemerkung` werden inkonsistent als leerer String gespeichert
- alte Seed-/UI-/Service-Pfade referenzieren entfernte Felder
- neue Enum-Werte fehlen an einer Stelle in Label-/Transition-Maps
- API-POST/PUT und Server Actions validieren dieselben Felder unterschiedlich
- Admin- oder Reviewer-Logik bleibt entgegen MVP-Scope sichtbar

## Validation Commands

Fuehre diese Befehle nur aus, wenn sie fuer das Feature relevant sind. Dokumentiere nicht ausfuehrbare Schritte mit Begruendung.

### Level 1: Prisma und Datenbasis

```bash
npx prisma generate
npm run db:reset
```

### Level 2: Syntax, Types and Unit Tests

```bash
npm run test
```

### Level 3: Build

```bash
npm run build
```

### Level 4: End-to-End Tests

```bash
npm run test:e2e
```

Nur wenn spaeter explizit angefragt oder wenn ein relevanter E2E-Test tatsaechlich vorhanden ist.

### Level 5: Manual Validation

Nutzer startet `npm run dev` und prueft:

1. Login als `applicant@example.com`
2. Neuer Antrag zeigt Weiterbildungsfelder statt generischer Demo-Struktur
3. Entwurf kann gespeichert werden
4. Liste zeigt den neuen Antrag mit sinnvollen Fachdaten
5. Detail- und Bearbeiten-Seite rendern ohne Verweise auf alte Demo-Felder
6. Admin sieht alle Demo-Antraege, aber keine fremde Bearbeitungs-/Entscheidungs-UI
7. Nach `npm run db:reset` sind nur fiktive Weiterbildungsantraege vorhanden

## Acceptance Criteria

- [ ] Datenmodell bildet alle MVP-Felder fuer Weiterbildungsantraege ab
- [ ] Status-Enum ist auf PRD `v002` angehoben
- [ ] Seed-Daten sind fachlich passend und fiktiv
- [ ] Bestehende Kernpfade fuer Formular, Bearbeiten, Liste, Detail, Service und API brechen nach der Schema-Aenderung nicht
- [ ] Relevante Unit-Tests sind aktualisiert und gruen
- [ ] `npm run build` ist fuer die umgestellten Pfade gruen
- [ ] Reviewer-/Admin-Entscheidungslogik ist im MVP-Portalfluss deaktiviert oder entfernt
- [ ] Dokumentationsbedarf fuer Folgefeatures ist im Plan sichtbar

## Completion Checklist

- [ ] Alle Tasks sind umgesetzt
- [ ] Jeder Task wurde validiert
- [ ] `npx prisma generate` und `npm run db:reset` wurden an der passenden Stelle ausgefuehrt
- [ ] Alle relevanten Tests laufen erfolgreich oder Ausnahmen sind begruendet
- [ ] `npm run build` wurde ausgefuehrt oder begruendet ausgelassen
- [ ] Manuelle Pruefung ist dokumentiert
- [ ] Plan-/PRD-Abweichungen sind dokumentiert und genehmigt
- [ ] Feature ist bereit fuer `/document` und `/commit`

## Documentation Notes

Spaetere Dokumentation sollte mindestens festhalten:

- welches Weiterbildungs-Feldmodell das MVP verwendet
- dass das Prisma-Modell technisch weiterhin `Antrag` heisst, fachlich aber Weiterbildungsantraege abbildet
- wie der Generate-/Reset-Workflow nach Schema-Aenderungen funktioniert
- dass das Datenmodell bewusst schon zukunftsfaehige Statuswerte enthaelt, obwohl die MVP-UI nur einen Teil aktiv nutzt

## Notes and Trade-offs

Der Plan zieht minimale Formular-, Bearbeiten-, Anzeige-, API- und Service-Anpassungen in dieses Datenmodell-Feature hinein. Das ist absichtlich so gewaehlt, damit das Repo nicht zwischen zwei Features in einen kaputten Zwischenzustand faellt. Umfangreiche UX-Verbesserungen bleiben trotzdem klar ausserhalb dieses Features.

Ein weiterer Trade-off ist das Beibehalten des Modellnamens `Antrag`. Das vermeidet grosse Umbauten, macht aber gute Dokumentation wichtig, damit Team und Agenten die neue Fachsemantik verstehen.

`kostenChf` wird hier bewusst als `Float` festgelegt, um im Starter-Kit mit SQLite und Formular-Parsing pragmatisch zu bleiben. Fuer produktionsnaehere Geldlogik waere spaeter eine praezisere Persistenzstrategie denkbar, ist aber nicht Teil dieses MVP-Foundation-Features.

## Offene Fragen

- Keine blockierenden Fragen. Fuer `plan-v002` ist festgelegt, dass `kostenChf` als `Float` geplant wird und PRD-widrige Entscheidungs-UI im MVP-Portalfluss deaktiviert oder entfernt wird.

## Plan Review Notes

Review `plan-v001-r01` wurde in `v002` eingearbeitet. Uebernommen wurden insbesondere: konkrete Prisma-Typen, verbindliche Generate-/Reset-Reihenfolge, zusaetzliche betroffene Altpfade, praezisierte Task-Reihenfolge, realistischere Validierung pro Task und explizite MVP-Abgrenzung fuer Admin-/Reviewer-Entscheidungslogik. Teilweise uebernommen wurde der `notizen`-/E-Mail-Service-Punkt, indem `plan-v002` eine klare Execute-Entscheidung verlangt, ohne bereits eine fachlich neue Kommunikationsfunktion zu planen.
