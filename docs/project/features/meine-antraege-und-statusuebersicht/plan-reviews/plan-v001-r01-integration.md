# Feature Plan Review Integration: Meine Antraege und Statusuebersicht v001 Runde 01

## Metadaten

| Feld | Wert |
|---|---|
| Ausgangsplan | `docs/project/features/meine-antraege-und-statusuebersicht/plan-v001.md` |
| Neue Plan-Version | `docs/project/features/meine-antraege-und-statusuebersicht/plan-v002.md` |
| Review | `docs/project/features/meine-antraege-und-statusuebersicht/plan-reviews/plan-v001-r01-review.md` |
| Ausgangsversion | v001 |
| Zielversion | v002 |
| Review-Runde | r01 |
| Integrationskontext | Autor-Session bestätigt |
| Aktualisierter TASKS.md-Eintrag | ja, Zeiger auf `plan-v002.md` aktualisiert |

## Kurzfazit

Alle drei Review-Punkte wurden eingearbeitet. Das kritische Finding (Widerspruch zwischen Task-2-Validierung und Dashboard-Links auf `GENEHMIGT`) wurde durch Umstellung der URL-Validierung auf das gesamte `AntragStatus`-Enum behoben. Das Suchformular nutzt neu `next/form` für Client-Side-Navigation. Auto-Submit/Debounce wurde explizit als Out of Scope dokumentiert. Der Plan ist damit bereit für `/execute`.

## Entscheidungen

| ID | Review-Punkt | Entscheidung | Begründung | Änderung in neuer Plan-Version |
|---|---|---|---|---|
| R-01 | Validierungslogik in Task 2: `searchParams.status` muss gegen alle `AntragStatus`-Werte validiert werden, nicht nur `ANTRAG_STATUS_MVP` | übernehmen | Kritischer Fehler: Dashboard-Karte `?status=GENEHMIGT` würde sonst nicht filtern. `ANTRAG_STATUS_MVP` steuert nur die Filter-Button-Anzeige, nicht die serverseitige Validierung. | Task 2 IMPLEMENT: Validierung von `ANTRAG_STATUS_MVP` auf `Object.values(AntragStatus).includes(status as AntragStatus)` geaendert. GOTCHA angepasst. Task 3 GOTCHA präzisiert. Acceptance Criteria in Task 2 erweitert. |
| R-02 | `next/form` anstelle von standard `<form method="GET">` | übernehmen | `next/form` führt bei GET-Submits eine Client-Side-Navigation durch und erhält den Seitenzustand besser als ein harter Page Reload. Next.js-eigene Komponente, kein zusätzliches Package. | Task 2 IMPLEMENT: `<form>` durch `next/form` ersetzt. IMPORTS: `Form` aus `next/form` ergänzt. Anti-Patterns: `<form method="GET">` explizit als zu vermeiden markiert. Patterns to Follow: `next/form` hinzugefügt. |
| R-03 | Debounce / Auto-Submit erwähnen, dass es Out of Scope ist | übernehmen | Klare Dokumentation vermeidet Rückfragen während `/execute`. | Scope "Nicht im Scope": Auto-Submit/Debounce explizit aufgeführt. Notes and Trade-offs: Hinweis ergänzt, dass expliziter Submit für MVP ausreichend ist. |

## Übernommene Änderungen an der neuen Plan-Version

- Task 2: Status-Validierung in IMPLEMENT und GOTCHA von `ANTRAG_STATUS_MVP` auf gesamtes `AntragStatus`-Enum geändert
- Task 2: Suchformular von `<form method="GET">` auf `next/form` (`import Form from 'next/form'`) umgestellt
- Task 2: `next/form` in IMPORTS und Anti-Patterns ergänzt
- Task 3: GOTCHA präzisiert, dass `GENEHMIGT`-Link dank Enum-weiter Validierung korrekt funktioniert
- Task 2 und Task 3: Acceptance Criteria erweitert (Dashboard-Link "Genehmigt" testbar)
- Scope "Nicht im Scope": Auto-Submit/Debounce explizit aufgeführt
- Solution Statement und Architekturentscheidungen: `next/form` erwähnt
- Validation Commands Level 4: Explizite Prüfung der "Genehmigt"-Karte hinzugefügt
- Notes and Trade-offs: `next/form` und Auto-Submit Out of Scope dokumentiert
- Plan Review Notes am Ende von v002 eingefügt
- Plan-Änderungshistorie: v002-Eintrag ergänzt
- Confidence Score von 9/10 auf 10/10 angehoben

## Plan-Änderungshistorie

Neuer Eintrag in `plan-v002.md` unter `## Plan-Änderungshistorie`:

| Version | Datum | Anlass | Kurzbeschreibung |
|---|---|---|---|
| v002 | 2026-06-04 | Review-Integration r01 | Status-Validierung in Task 2 auf gesamtes Enum korrigiert, `next/form` fuer Suchformular, Auto-Submit als Out of Scope dokumentiert |

## Teilweise übernommene Punkte

- Keine.

## Abgelehnte Punkte

- Keine. Alle Review-Punkte wurden übernommen.

## Offene Punkte

- Keine.

## Empfehlung für den nächsten Schritt

Der Plan ist bereit für fachliche Bestätigung. Nach Bestätigung durch den Nutzer soll der aktualisierte Plan (`plan-v002.md`), die Integration-Datei und das aktualisierte `TASKS.md` committed werden. Danach kann `/execute docs/project/features/meine-antraege-und-statusuebersicht/plan-v002.md` die Implementierung starten. Keine weitere Review-Runde nötig.

## Qualitätscheck vor Abschluss

- [x] Ausgangsplan, Review-Datei, Ausgangsversion, Zielversion und Review-Runde sind korrekt dokumentiert.
- [x] Jede relevante Review-Empfehlung ist als übernommen, teilweise übernommen, abgelehnt oder offen dokumentiert.
- [x] Ablehnungen sind nachvollziehbar begründet.
- [x] Die neue Plan-Version ist genannt und bleibt von der Ausgangsversion unterscheidbar.
- [x] Die Plan-Änderungshistorie der neuen Plan-Version enthält einen Eintrag für die Review-Integration.
- [x] `TASKS.md` zeigt auf die neue Plan-Version.
- [x] Offene Punkte enthalten einen konkreten nächsten Klärungsschritt (keine offen).
- [x] Die Empfehlung für den nächsten Schritt nennt `/execute` mit dem neuen Plan-Pfad.