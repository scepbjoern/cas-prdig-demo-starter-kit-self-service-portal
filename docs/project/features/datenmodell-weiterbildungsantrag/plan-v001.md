# Plan: Datenmodell Weiterbildungsantrag

## Status

**Feature-Status:** planned  
**Erstellt:** 2026-06-03  
**Plan-Version:** v001  
**Quelle:** User Request `/plan-feature Datenmodell Weiterbildungsantrag` plus `docs/project/prds/self-service-portal-v002.md`  
**Confidence Score:** 9/10 - Die fachlichen Felder, Statuswerte und Scope-Grenzen sind im PRD klar beschrieben. Das Hauptrisiko liegt nur in der notwendigen Kompatibilitaet zu bereits vorhandenen Formular-, API- und Seed-Pfaden.

## Feature Metadata

| Feld | Wert |
|---|---|
| Feature-Typ | New Capability |
| Plan-Version | v001 |
| Komplexitaet | Medium |
| Primaer betroffene Systeme | Prisma / Server Actions / Route Handler / UI / Tests |
| Abhaengigkeiten | Prisma 7 + SQLite, Better Auth Rollen, bestehender `Antrag`-Flow, PRD `self-service-portal-v002.md`, kein neues npm-Paket |

## Plan-Aenderungshistorie

| Version | Datum | Anlass | Kurzbeschreibung |
|---|---|---|---|
| v001 | 2026-06-03 | Initiale Planung | Erster Feature-Plan fuer das fachliche Weiterbildungsantrags-Datenmodell erstellt |

Bei spaeteren Aenderungen ergaenzen `/integrate-feature-plan-review` oder `/update-feature-plan` neue Zeilen, ohne alte Eintraege zu entfernen.

## Feature Description

Das Feature ersetzt das noch generische Starter-Kit-Datenmodell des Objekts `Antrag` durch ein fachlich passendes Weiterbildungsantrags-Modell. Ziel ist nicht nur eine Prisma-Schema-Anpassung, sondern ein belastbares Fundament fuer alle spaeteren MVP-Features: Pflichtfelder, vollstaendiges Statusmodell, fiktive Seed-Daten und ausreichend angepasste bestehende Codepfade, damit die Anwendung nach der Umstellung weiterhin lauffaehig und testbar bleibt.

## User Story

```text
Als Antragstellerin
moechte ich, dass ein Weiterbildungsantrag die fachlich benoetigten Daten und Statuswerte korrekt abbildet,
damit spaetere Erfassung, Einreichung und Statusanzeige auf einem realistischen und konsistenten Datenmodell aufbauen.
```

## Problem Statement

Der aktuelle Stand nutzt noch ein Starter-Kit-Modell mit `titel`, optionaler `beschreibung` und einigen nicht mehr passenden Demo-Feldern wie `plzOrt` oder `kanton`. Das PRD `v002` verlangt hingegen ein klar definiertes MVP-Feldmodell fuer Weiterbildungsantraege und ein erweitertes Enum mit zukunftsfaehigen Statuswerten. Ohne diese Grundlage wuerden Folgefeatures auf einem fachlich falschen Schema planen oder beim Umsetzen in Konflikt mit Seed-Daten, Zod-Schemas, Status-Helpern und bestehenden Seiten geraten.

## Solution Statement

Der geplante Ansatz entwickelt das bestehende Prisma-Modell `Antrag` evolutionaer zu einem Weiterbildungsantrag weiter, statt eine parallele Entitaet einzufuehren. Dabei werden PRD-konforme Felder und Statuswerte eingefuehrt, unpassende Demo-Felder entfernt, Seed-Daten auf fiktive Weiterbildungsfaelle umgestellt und die betroffenen bestehenden UI-/Action-/API-Pfade minimal so angepasst, dass das Repo nach der Schema-Aenderung weiterhin konsistent baut und getestet werden kann. Umfangreiche Formular-UX und Einreichungslogik werden bewusst in spaetere Features verschoben.

## Scope

### Im Scope

- Prisma-Enum `AntragStatus` auf PRD-Statuswerte erweitern
- Prisma-Modell `Antrag` fachlich zum Weiterbildungsantrag ausbauen
- Nicht mehr passende Demo-Felder aus dem Modell entfernen, wenn sie fuer das MVP keine Rolle mehr haben
- Bestehende Zod-Schemas, Status-Helper und Typen auf das neue Feld- und Statusmodell anheben
- Seed-Daten auf fiktive Weiterbildungsantraege umstellen
- Bestehende Seiten, Actions und Route Handlers soweit anpassen, dass sie mit dem neuen Modell weiter funktionieren
- Unit-Tests fuer Schema- und Statuslogik aktualisieren oder ergaenzen

### Nicht im Scope

- Finales UX-Design fuer das Weiterbildungsformular
- Vollstaendige Einreichungs- und Bearbeitungslogik fuer alle Sonderfaelle
- Medium-/Extended-Funktionen wie Rueckfragen, Audit oder E-Mail-Mock
- Entfernung ganzer Starter-Kit-Seiten wie `/personen` oder `ai-demo`
- Playwright-E2E-Implementierung, solange kein ausdruecklicher Auftrag dazu vorliegt

## Rollen und Berechtigungen

Betroffene Rollen:

- `user_applicant`: fachliche Hauptrolle; eigenes Datenmodell fuer spaetere Erstellung, Bearbeitung und Einsicht
- `admin`: liest im MVP alle Antraege und kann eigene Demo-Antraege erstellen; feinere Admin-Regeln werden in spaeteren Features vollstaendig umgesetzt
- `user_reviewer`: bleibt technisch vorhanden, ist fuer dieses Foundation-Feature aber nicht Hauptkonsument

Schutzregeln:

- Das Datenmodell darf keine neue Rolle einfuehren
- Bestehende Besitzregeln fuer Antragsdaten duerfen durch Schema-Aenderungen nicht versehentlich aufbrechen
- Admin-Sonderrechte, die aktuell noch PRD-inkonsistent sind, muessen im Plan als Folge-Gotcha sichtbar bleiben

## Context References

### Pflichtlektuere vor Umsetzung

- `docs/project/prds/self-service-portal-v002.md` - Warum: autoritative fachliche Quelle fuer MVP-Felder, Statuswerte, Seed-Richtung und Scope-Grenzen
- `AGENTS.md` - Warum: Projektkontext wurde auf lokale MVP-Backend-Logik harmonisiert und setzt den Rahmen fuer die Planung
- `KILO_INSTRUCTIONS.md` - Warum: nicht verhandelbare Stack- und Prisma-Regeln, inklusive `npm run db:reset` nach Schema-Aenderungen und Verbot von Prisma Migrations
- `prisma/schema.prisma` - Warum: Ausgangspunkt fuer Enum-, Feld- und Relationen-Aenderungen
- `prisma/seed.ts` - Warum: bestehende Demo-Daten muessen fachlich auf Weiterbildungsantraege gedreht werden
- `src/lib/schemas/antrag.ts` - Warum: aktuelles Formular-/API-Schema ist zu generisch und muss mit dem Prisma-Modell konsistent bleiben
- `src/lib/antrag-status.ts` - Warum: Statuslabels, Badge-Varianten und erlaubte Uebergaenge spiegeln das Enum
- `src/app/(app)/antraege/actions.ts` - Warum: Server Actions erzeugen und veraendern `Antrag`-Datensaetze
- `src/components/antraege/antrag-form.tsx` - Warum: bestehendes Formular wird durch neue Pflichtfelder direkt betroffen sein
- `src/app/(app)/antraege/[id]/page.tsx` - Warum: Detailseite zeigt heute noch veraltete Felder wie `plzOrt`, `kanton` und `notizen`
- `src/app/api/antraege/route.ts` - Warum: bestehende API-Pfade validieren und erstellen `Antrag`-Datensaetze ebenfalls
- `__tests__/unit/schemas/antrag.test.ts` - Warum: direktes Testmuster fuer Zod-Schema-Aenderungen
- `__tests__/unit/antrag-status.test.ts` - Warum: direktes Testmuster fuer Statuskonstanten und Transitionen

### Relevante Dokumentation

- [Prisma ORM Schema Reference](https://www.prisma.io/docs/orm/reference/prisma-schema-reference) - Warum: referenziert Enum-, Feld- und SQLite-kompatible Modellierung fuer die geplante Schema-Aenderung
- [Prisma db push](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#db-push) - Warum: bestaetigt den projektkonformen Schema-Update-Weg ohne Migrationsdateien
- [Zod Documentation](https://zod.dev/) - Warum: relevant fuer objektuebergreifende Validierung wie `enddatum` nach `startdatum` und Zahlen-/Textgrenzen

## Codebase Intelligence

### Projektstruktur und Architektur

Das Repo folgt dem Starter-Kit-Muster mit App Router in `src/app`, UI-Komponenten in `src/components`, Fach- und Infrastrukturcode in `src/lib` sowie Prisma/Seed im Root. Schreibende Formularfluesse laufen primaer ueber Server Actions, waehrend Route Handlers als zusaetzliche API-Schicht weiter existieren. Das Datenmodell-Feature sitzt genau auf dieser Schnittstelle und muss deshalb Prisma, Zod, Actions, API und Anzeige gemeinsam betrachten.

### Patterns to Follow

- Naming: bestaetigte deutsche Fachbegriffe wie `antrag`, `antraege`, `begruendung`, `kostenstelle`; keine neue parallele Entitaet wie `TrainingRequest`
- Datei-Organisation: bestehende `antraege`-Pfade beibehalten und evolutionaer anpassen, statt neue konkurrierende Ordnerstruktur einzufuehren
- Fehlerbehandlung: in Server Actions `throw new Error(...)`, in Route Handlers `NextResponse.json({ error }, { status })`
- UI/shadcn: Formulare ueber `react-hook-form` + Zod + Komponenten aus `@/components/ui`
- Auth/Rollen: Rollen aus `src/lib/auth-helpers.ts` weiterverwenden; keine neue Autorisierungsschicht erfinden
- Prisma: bestehendes Modell `Antrag` und Singleton `src/lib/prisma.ts` erweitern; keine direkte Parallelstruktur oder Raw SQL

### Anti-Patterns to Avoid

- Kein neues zweites Modell neben `Antrag`, wenn nur der Fachinhalt geaendert wird
- Keine stillen PRD-Abweichungen wie Beibehaltung fachfremder Felder ohne Begruendung
- Keine Statuskonstanten, die vom Prisma-Enum und den Tests abweichen
- Kein manueller Eingriff in generierte Prisma-Dateien unter `src/generated/prisma/`
- Kein Einfuehren finaler Review-/Admin-Workflows in diesem Foundation-Feature

### Dependency Analysis

Bestehende Dependencies reichen aus: Prisma 7, Better Auth, Zod, React Hook Form, Next.js 16, Vitest. Es ist kein neues Paket erforderlich. Relevante Integrationspunkte sind bereits im Repo vorhanden; das Risiko liegt in gekoppelten Aenderungen, nicht in fehlenden Libraries.

### Testing Patterns

Vitest-Tests liegen unter `__tests__/unit/` und pruefen heute bereits Zod-Schemas und Statuskonstanten. Dieses Feature sollte dasselbe Muster verwenden: direkte `safeParse`-Assertions fuer Schemafaelle und explizite Erwartungen fuer Labels/Transitionen. E2E bleibt optional und wird hier nicht vorgezogen.

## Architekturentscheidungen

### Gewaehlter Ansatz

Das Feature haelt am bestehenden Modellnamen `Antrag` fest und veraendert nur Semantik und Felder. Dadurch bleiben Imports, Relationen und Routen stabil, waehrend die Fachlichkeit auf Weiterbildungsantraege angehoben wird. Weil neue Pflichtfelder bestehende Create-/Update-Pfade brechen wuerden, umfasst das Feature auch einen Kompatibilitaetsring aus minimalen Anpassungen in Form, Actions, API und Detailansicht.

### Erwaegte Alternativen

- Alternative: neues Prisma-Modell `Weiterbildungsantrag` neben `Antrag` - Entscheidung: nicht gewaehlt, weil es parallelisierte Architektur, doppelten Migrationsaufwand und unnötige Umbauten in Actions, APIs und Tests erzeugen wuerde
- Alternative: nur Prisma-Schema und Seed anpassen, UI/API spaeter nachziehen - Entscheidung: nicht gewaehlt, weil das Repo dadurch zwischenzeitlich nicht mehr lauffaehig waere
- Alternative: neue Felder vorerst optional modellieren - Entscheidung: nicht bevorzugt, weil das PRD klare MVP-Pflichtfelder fordert und spaetere Features sonst auf einem verwässerten Modell starten

### Security, Performance, Maintainability

- Security: alle neuen Eingabefelder muessen serverseitig ueber Zod validiert bleiben; Besitz- und Rollenregeln duerfen durch Refactorings nicht versehentlich verschwinden
- Performance: Auswirkungen sind gering; relevant ist nur, unnoetige doppelte Queries bei Anpassung von Listen/Details zu vermeiden
- Maintainability: ein zentrales Modell, ein zentrales Zod-Schema und konsistente Statuskonstanten senken Folgeaufwand fuer spaetere Features deutlich

## Datenmodell und Prisma

Geplante Aenderung:

- `AntragStatus` um `IN_RUECKFRAGE` und `ZURUECKGEZOGEN` erweitern
- `Antrag` mindestens um PRD-Felder `anbieter`, `startdatum`, optional `enddatum`, `kostenChf`, `kostenstelle`, `begruendung`, optional `bemerkung` erweitern
- bisherige Demo-Felder wie `plzOrt`, `kanton`, `notizen`, `kiAnalyse`, `dateiPfad`, `dateiName` kritisch pruefen und fuer dieses MVP-Foundation-Feature entfernen, wenn sie keine aktive PRD-Funktion tragen
- bestehende Relationen zu `User` beibehalten

Wichtiger Umsetzungs-Hinweis: Nach Umsetzung muss der Nutzer `npx prisma generate` und danach `npm run db:reset` ausfuehren. Prisma Migrations werden nicht verwendet.

## Betroffene Dateien

### Bestehende Dateien

- `AGENTS.md` - bereits harmonisiert; Referenz fuer lokale MVP-Architektur
- `prisma/schema.prisma` - fachliches Kernmodell und Status-Enum
- `prisma/seed.ts` - fiktive Weiterbildungs-Demo-Daten
- `src/lib/schemas/antrag.ts` - Zod-Schema fuer neues Feldmodell und Status-Enum
- `src/lib/antrag-status.ts` - Labels, Varianten und Uebergaenge
- `src/app/(app)/antraege/actions.ts` - Server Actions fuer Create/Update/Submit auf neuem Modell
- `src/components/antraege/antrag-form.tsx` - Pflichtfelder und Formularwerte
- `src/app/(app)/antraege/page.tsx` - Listenansicht und angezeigte Felder
- `src/app/(app)/antraege/[id]/page.tsx` - Detailansicht ohne alte Demo-Felder
- `src/app/api/antraege/route.ts` - API-Create-/List-Kompatibilitaet
- `src/app/api/antraege/[id]/route.ts` - API-Detail-/Update-Kompatibilitaet
- `__tests__/unit/schemas/antrag.test.ts` - Unit-Tests fuer neues Feldmodell
- `__tests__/unit/antrag-status.test.ts` - Unit-Tests fuer Enum-/Transitionsanpassung

### Neue Dateien

- Keine neuen Dateien zwingend erforderlich; das Feature sollte bevorzugt bestehende Strukturen anheben

## Implementation Plan

### Phase 1: Foundation

Prisma-Enum und `Antrag`-Modell auf PRD `v002` anheben, Seed-Richtung festziehen und daraus die zentrale Schema-/Typbasis ableiten.

### Phase 2: Core Implementation

Server Actions, Zod-Schemas und das bestehende Formular auf das neue Feldmodell umstellen, damit Entwuerfe weiterhin erstellt und bearbeitet werden koennen.

### Phase 3: Integration

Bestehende Listen-, Detail- und API-Pfade anpassen, alte Demo-Felder entfernen und Statusdarstellung fuer das erweiterte Enum robust machen.

### Phase 4: Testing and Validation

Vitest-Tests aktualisieren, Build-Stabilitaet pruefen und manuelle Smoke-Checks fuer Seed, Erstellen, Anzeigen und Detailansicht dokumentieren.

## Step-by-Step Tasks

Wichtig: Tasks top-to-bottom ausfuehren. Jeder Task ist atomic und einzeln validierbar.

### Task 1: UPDATE `prisma/schema.prisma`

**Status:** planned  
**Ziel:** Das persistente Datenmodell bildet den PRD-konformen Weiterbildungsantrag fachlich korrekt ab.  
**IMPLEMENT:** Erweitere `AntragStatus` auf alle in PRD `v002` dokumentierten Statuswerte und entwickle das Modell `Antrag` von der generischen Demo-Struktur zum Weiterbildungsantrag mit den MVP-Feldern weiter. Pruefe alte Demo-Felder kritisch und entferne Felder ohne PRD-Funktion.  
**PATTERN:** Bestehende Better-Auth-Modelle und die Relation `User` -> `Antrag` in `prisma/schema.prisma` beibehalten; nur das Prozessobjekt evolutionaer anpassen.  
**IMPORTS:** Keine neuen Imports; nur Prisma-Schema-Aenderungen.  
**GOTCHA:** Wenn neue Pflichtfelder im Schema eingefuehrt werden, muessen Folgepfade im selben Feature nachgezogen werden; generierte Prisma-Dateien nicht manuell editieren.  
**ACCEPTANCE CRITERIA:**

- [ ] `AntragStatus` enthaelt mindestens `ENTWURF`, `EINGEREICHT`, `IN_RUECKFRAGE`, `GENEHMIGT`, `ABGELEHNT`, `ZURUECKGEZOGEN`
- [ ] `Antrag` enthaelt alle in PRD `v002` geforderten MVP-Felder fuer Weiterbildungsantraege
- [ ] Nicht mehr benoetigte Demo-Felder sind bewusst entfernt oder im Plan nachvollziehbar begruendet beibehalten

**VALIDATE:**

- `npm run test`
- Manuelle Pruefung: Schema gegen PRD `v002` querlesen; danach fuer die spaetere Umsetzung `npx prisma generate` und `npm run db:reset` vormerken

### Task 2: UPDATE `prisma/seed.ts`

**Status:** planned  
**Ziel:** Seed-Daten spiegeln ausschliesslich fiktive Weiterbildungsantraege und das neue Feldmodell.  
**IMPLEMENT:** Ersetze generische oder fachfremde Demo-Inhalte durch fiktive Weiterbildungsantraege mit realistisch wirkenden, aber nicht produktiven Anbieter-, Kostenstellen- und Begruendungstexten. Nutze nur Statuswerte, die zum MVP-Storytelling passen.  
**PATTERN:** Bestehende Seed-Struktur mit Better-Auth-Testnutzern und `createMany` fuer `antrag` beibehalten.  
**IMPORTS:** Keine neuen Packages; bestehende Prisma- und Auth-Imports weiterverwenden.  
**GOTCHA:** Seed-Daten muessen zu Pflichtfeldern passen; sonst bricht `db:reset` spaeter direkt.  
**ACCEPTANCE CRITERIA:**

- [ ] Seed erstellt nur fiktive Weiterbildungsfaelle
- [ ] Alle Pflichtfelder des neuen Datenmodells sind in den Seed-Datensaetzen sinnvoll gefuellt
- [ ] Seed verwendet keine fachfremden Inhalte wie Urlaub oder Materialbestellung mehr

**VALIDATE:**

- `npm run test`
- Manuelle Pruefung: Seed-Datensaetze in `prisma/seed.ts` gegen PRD-Feldmodell lesen

### Task 3: UPDATE `src/lib/schemas/antrag.ts` und `src/lib/antrag-status.ts`

**Status:** planned  
**Ziel:** Zentrale Validierungs- und Statuskonstanten sind mit Prisma und PRD synchron.  
**IMPLEMENT:** Erweitere das Create-/Update-Schema auf die neuen Felder und Regeln, inklusive Datums- und Zahlenvalidierung. Aktualisiere Status-Enum, Labels, Badge-Varianten und erlaubte Transitionen auf das neue Enum.  
**PATTERN:** Bestehende Zod-Schema-Datei und bestehende Status-Konstanten in einer einzelnen Helper-Datei fortfuehren.  
**IMPORTS:** Weiterhin `zod` sowie `AntragStatus` aus generierten Prisma-Enums verwenden.  
**GOTCHA:** `update`-Semantik sauber definieren; entweder alle Pflichtfelder fuer bestehende Form-Patterns verlangen oder bewusst ein partielles Schema einfuehren und im Plan begruenden.  
**ACCEPTANCE CRITERIA:**

- [ ] Zod-Schemas decken alle MVP-Felder ab
- [ ] Datumslogik fuer optionales `enddatum` gegen `startdatum` ist serverseitig dokumentiert und validierbar
- [ ] Status-Helper koennen alle neuen Enum-Werte ohne TypeScript-Loch darstellen

**VALIDATE:**

- `npm run test`
- Manuelle Pruefung: Schemafaelle gegen PRD-Tabelle fuer Feldgrenzen querpruefen

### Task 4: UPDATE `src/app/(app)/antraege/actions.ts`, `src/components/antraege/antrag-form.tsx` und `src/app/(app)/antraege/neu/page.tsx`

**Status:** planned  
**Ziel:** Bestehender Erstell-/Bearbeitungsfluss bleibt nach der Datenmodellumstellung funktionsfaehig.  
**IMPLEMENT:** Passe Server Actions und Formularwerte an das neue Feldmodell an, sodass neue Pflichtfelder korrekt geschrieben werden. Halte den Umfang bewusst minimal: keine finale UX-Politur, aber ein funktionierender MVP-kompatibler Formularsatz fuer den spaeteren Folgefeature-Aufbau.  
**PATTERN:** Weiterhin `react-hook-form` + `zodResolver` + `FormData`-Uebergabe an Server Actions verwenden.  
**IMPORTS:** Vorhandene shadcn-Form-Komponenten, `toast`, `useTransition`, Zod-Typen.  
**GOTCHA:** Wenn die Form in diesem Foundation-Feature nicht mindestens minimal mitzieht, brechen Create und Edit sofort durch neue Pflichtfelder.  
**ACCEPTANCE CRITERIA:**

- [ ] Formular und Server Actions schreiben alle benoetigten Pflichtfelder
- [ ] Entwurfserstellung bleibt technisch moeglich
- [ ] Bestehendes Pattern mit Server Actions und deutschen Fehlermeldungen bleibt erhalten

**VALIDATE:**

- `npm run test`
- Manuelle Pruefung: mit `npm run dev` als Antragstellerin neuen Weiterbildungsantrag anlegen und als Entwurf speichern

### Task 5: UPDATE `src/app/(app)/antraege/page.tsx`, `src/app/(app)/antraege/[id]/page.tsx`, `src/app/api/antraege/route.ts` und `src/app/api/antraege/[id]/route.ts`

**Status:** planned  
**Ziel:** Listen-, Detail- und API-Pfade bleiben mit dem neuen Datenmodell konsistent und zeigen keine alten Demo-Felder mehr.  
**IMPLEMENT:** Entferne Anzeige- und Serialisierungslogik fuer fachfremde Felder, ersetze sie durch sinnvolle Weiterbildungsantragsinformationen und stelle sicher, dass GET/POST/PUT-Pfade die neuen Zod-Schemas und das neue Modell verwenden. Halte bestehende Rollenfilter intakt und dokumentiere PRD-Abweichungen, die in spaeteren Features bereinigt werden muessen.  
**PATTERN:** Vorhandene Server-Component-Listen/Detailseiten und `NextResponse.json`-Route-Handler fortfuehren.  
**IMPORTS:** Bestehende Badge-, Card-, Table- und Auth-Helper-Imports weiterverwenden; nur feldbezogene Anpassungen vornehmen.  
**GOTCHA:** Aktuelle Detailseite und API sind stark auf `beschreibung`, `plzOrt`, `kanton` und Review-Statuswechsel zugeschnitten; nach der Modellumstellung drohen sonst Laufzeitfehler oder irrefuehrende Anzeigen.  
**ACCEPTANCE CRITERIA:**

- [ ] Keine aktive Seite oder API referenziert entfernte Demo-Felder
- [ ] Listen- und Detailansicht zeigen sinnvolle Weiterbildungsantragsdaten
- [ ] API-Validierung und Server-Rendering sind mit dem neuen Modell konsistent

**VALIDATE:**

- `npm run test`
- `npm run build`
- Manuelle Pruefung: Liste, Detailansicht und API-Schema stichprobenartig gegen das neue Modell kontrollieren

### Task 6: UPDATE `__tests__/unit/schemas/antrag.test.ts` und `__tests__/unit/antrag-status.test.ts`

**Status:** planned  
**Ziel:** Die fachliche Grundlage ist durch schnelle Unit-Tests abgesichert.  
**IMPLEMENT:** Erweitere Schema-Tests auf Pflichtfelder, Datumsregeln, Zahlenbereiche und optionale Felder. Erweitere Status-Tests auf Labels und Transitionen fuer das vollstaendige Enum. Passe bestehende Assertions an neue Begriffe an.  
**PATTERN:** Bestehende `vitest`-Struktur mit `safeParse`, `expect(result.success)` und Konstantenpruefung spiegeln.  
**IMPORTS:** Nur bestehende Vitest- und Modul-Imports anpassen.  
**GOTCHA:** Tests sollen die neue Fachlichkeit absichern, nicht die alte generische Demo-Struktur konservieren.  
**ACCEPTANCE CRITERIA:**

- [ ] Unit-Tests decken die neuen Pflichtfelder und wichtigsten Fehlfaelle ab
- [ ] Status-Tests enthalten die neuen Enum-Werte und relevante Transitionen
- [ ] Keine veralteten Erwartungen zu der alten Demo-Struktur bleiben bestehen

**VALIDATE:**

- `npm run test`
- Manuelle Pruefung: Testdateien spiegeln nachvollziehbar das PRD-Feldmodell wider

## Testing Strategy

### Unit Tests

Vitest ist die Hauptabsicherung fuer dieses Feature. Besonders wichtig sind:

- positive und negative Zod-Faelle fuer alle Pflichtfelder
- `enddatum` darf nicht vor `startdatum` liegen
- `kostenChf` muss Zahlenbereich und Typ sauber pruefen
- Statuslabels und Statustransitionen fuer alle Enum-Werte

### E2E Tests

Nicht primaer Teil dieses initialen Foundation-Features. E2E kann spaeter im Formular-/Workflow-Feature sinnvoller ergaenzt werden, wenn die UI nicht mehr nur minimal kompatibel ist.

### Regression Tests

Bestehende Schema- und Status-Tests werden erweitert, nicht ersetzt. Falls waehrend der Umsetzung weitere Unit-Tests fuer Actions oder API-Validierung sinnvoll erscheinen, sollen sie im bestehenden `__tests__/unit/`-Muster ergaenzt werden.

### Edge Cases

- `enddatum` leer oder vor `startdatum`
- `kostenChf` negativ, zu hoch oder kein numerischer Wert
- alte Seed-/UI-Pfade referenzieren entfernte Felder
- neue Enum-Werte fehlen an einer Stelle in Label-/Transition-Maps
- Admin- oder Reviewer-Logik referenziert Statuspfade, die fuer MVP spaeter anders begrenzt werden

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

Nur wenn spaeter explizit angefragt oder wenn sich der minimale Formularpfad so stark aendert, dass ein bestehender E2E-Test tatsaechlich vorhanden und relevant ist.

### Level 3: Build

```bash
npm run build
```

### Level 4: Manual Validation

Nutzer startet `npm run dev` und prueft:

1. Login als `applicant@example.com`
2. Neuer Antrag zeigt Weiterbildungsfelder statt generischer Demo-Struktur
3. Entwurf kann gespeichert werden
4. Liste zeigt den neuen Antrag mit sinnvollen Fachdaten
5. Detailseite rendert ohne Verweise auf alte Demo-Felder
6. Nach `npm run db:reset` sind nur fiktive Weiterbildungsantraege vorhanden

## Acceptance Criteria

- [ ] Datenmodell bildet alle MVP-Felder fuer Weiterbildungsantraege ab
- [ ] Status-Enum ist auf PRD `v002` angehoben
- [ ] Seed-Daten sind fachlich passend und fiktiv
- [ ] Bestehende Kernpfade fuer Formular, Liste, Detail und API brechen nach der Schema-Aenderung nicht
- [ ] Relevante Unit-Tests sind aktualisiert und gruen
- [ ] `npm run build` ist fuer die umgestellten Pfade gruen
- [ ] Dokumentationsbedarf fuer Folgefeatures ist im Plan sichtbar

## Completion Checklist

- [ ] Alle Tasks sind umgesetzt
- [ ] Jeder Task wurde validiert
- [ ] Alle relevanten Tests laufen erfolgreich oder Ausnahmen sind begruendet
- [ ] `npm run build` wurde ausgefuehrt oder begruendet ausgelassen
- [ ] Manuelle Pruefung ist dokumentiert
- [ ] Nutzer fuehrt nach Schema-Umsetzung `npx prisma generate` und `npm run db:reset` aus
- [ ] Feature ist bereit fuer `/document` und `/commit`

## Documentation Notes

Spaetere Dokumentation sollte mindestens festhalten:

- welches Weiterbildungs-Feldmodell das MVP verwendet
- wie Seed- und Reset-Workflow nach Schema-Aenderungen funktioniert
- dass das Datenmodell bewusst schon zukunftsfaehige Statuswerte enthaelt, obwohl die MVP-UI nur einen Teil aktiv nutzt

## Notes and Trade-offs

Der Plan zieht minimale Formular- und Anzeigeanpassungen in dieses Datenmodell-Feature hinein. Das ist absichtlich so gewaehlt, damit das Repo nicht zwischen zwei Features in einen kaputten Zwischenzustand faellt. Umfangreiche UX-Verbesserungen bleiben trotzdem klar ausserhalb dieses Features.

Ein weiterer Trade-off ist das Beibehalten des Modellnamens `Antrag`. Das vermeidet grosse Umbauten, macht aber gute Dokumentation wichtig, damit Team und Agenten die neue Fachsemantik verstehen.

## Offene Fragen

- Keine blockierenden Fragen. Annahme: Das Datenmodell-Feature darf bestehende UI/API-Pfade minimal mitziehen, um Lauffaehigkeit nach Schema-Aenderungen sicherzustellen.

## Plan Review Notes

Nicht relevant fuer `plan-v001.md`.
