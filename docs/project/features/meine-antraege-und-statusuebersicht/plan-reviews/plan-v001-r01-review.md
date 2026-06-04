# Feature Plan Review: Meine Antraege und Statusuebersicht v001 Runde 01

## Metadaten

| Feld | Wert |
|---|---|
| Feature-Plan | `docs/project/features/meine-antraege-und-statusuebersicht/plan-v001.md` |
| Logische Plan-Version | `v001` |
| Review-Runde | `r01` |
| Reviewer-Kontext | Frische Session nach `/prime` bestätigt: ja |
| Vorherige Review-/Integration-Datei | Nicht relevant |
| Referenziertes PRD | `docs/project/prds/self-service-portal-v002.md` |

## Kurzfazit

Der Plan ist insgesamt sehr detailliert, gut durchdacht und passt hervorragend zu den Starter-Kit-Konventionen. Die Entscheidung für eine URL-basierte Filterung in Server Components ist genau der richtige Architekturansatz für Next.js. Die Granularität der Tasks und die Validierungsschritte sind hervorragend. 
Es gibt jedoch einen logischen Widerspruch zwischen Task 2 und Task 3 bezüglich der Status-Validierung, der vor `/execute` zwingend korrigiert werden muss, damit die Dashboard-Karten wie gewünscht funktionieren.

## Stärken

- **Next.js Architektur:** URL-basierte Filterung über `searchParams` und Server Components ist optimal gewählt (kein unnötiger Client-State).
- **Gotchas bedacht:** Die Asynchronität von `searchParams` in Next.js 16 (`await searchParams`) wurde explizit und korrekt als Gotcha notiert.
- **Formular-Verhalten:** Dass beim Such-Formular der aktive Status als "Hidden Field" mitgeführt werden muss, wurde vorausschauend erkannt.
- **MVP vs. Enum:** Es wurde klug unterschieden zwischen Statuswerten, die im Enum existieren, und solchen, die im MVP als Filter-Buttons angezeigt werden.

## Kritische Findings

Findings, die vor `/execute` geklärt oder im Plan verbessert werden sollten.

| Bereich | Finding | Warum relevant | Konkreter Verbesserungsvorschlag |
|---|---|---|---|
| Filterlogik vs. Dashboard | **Widerspruch zwischen Task 2 und Task 3**: Task 2 validiert den Suchparameter nur gegen `ANTRAG_STATUS_MVP`. Task 3 verlinkt das Dashboard auf `?status=GENEHMIGT`. Da `GENEHMIGT` nicht in `ANTRAG_STATUS_MVP` enthalten ist, würde dieser Link nicht filtern. | Die Dashboard-Karte für "Genehmigt" wäre dysfunktional (sie würde alle Anträge zeigen). | In **Task 2** die Validierung anpassen: Der URL-Parameter darf gegen das gesamte `AntragStatus` Enum validiert werden (z. B. `Object.values(AntragStatus).includes(status)`), auch wenn für die Filter-Buttons nur `ANTRAG_STATUS_MVP` verwendet wird. |

## Architektur und Codebase-Fit

- Ausgezeichneter Fit. Keine Client-Komponenten für Listendarstellungen erzwungen.
- URL-Parameter als *Single Source of Truth* ist ein Best Practice.

## Scope und PRD-Abgleich

- Scope (MVP Prio 3) ist korrekt erfasst (Anzeige eigener Anträge, Filtern, Dashboard-Links).
- Spalte "Kosten" ergänzt eine Lücke des vorherigen Features und fügt sich gut ein.
- Rollenspezifischer Zugriff (`erstellerId` vs Admin) wird ausdrücklich beibehalten.

## Versionierung und Plan-Änderungshistorie

- Plan ist sauber als `v001` versioniert und die Änderungshistorie ist korrekt initialisiert.

## Implementation Plan und Task-Qualität

- Reihenfolge ist logisch (zuerst Status-Konstanten, dann Page, dann Dashboard, dann Skeleton, dann Tests).
- Tasks sind atomar, lesbar und enthalten exzellente Validierungsanleitungen für die manuelle Prüfung.

## Betroffene Dateien und Pflichtlektüre

- Alle notwendigen Dateien (Page, Dashboard, Loading, lib, E2E) wurden identifiziert. Keine überflüssigen Dateien angefasst.

## Datenmodell, Rollen und Berechtigungen

- Keine Prisma-Schema-Änderung, daher kein DB-Reset nötig (korrekt).
- Rollenkonzept bleibt intakt und wird sicher angewendet.

## Testing und Validierung

- Vitest-Unit-Tests für die neue Statusliste und Playwright-E2E für den Filter-Flow sind eingeplant. Das ist vollständig und ausreichend.

## Risiken, Gotchas und Edge Cases

- Sehr gute Erfassung der Edge Cases (leerer Suchbegriff, ungültiger Parameter, 0 Treffer).

## Übergabereife für Execute

- Bis auf den kritischen Fehler in Task 2 (Filter-Validierung vs. Dashboard-Link) ist der Plan zu 100 % bereit für `/execute`.

## Verbesserungsvorschläge nach Priorität

### Muss vor `/execute` geklärt werden

- **Validierungslogik in Task 2 anpassen**: `searchParams.status` muss gegen alle gültigen Werte im `AntragStatus` Enum geprüft werden, nicht nur gegen `ANTRAG_STATUS_MVP`. Sonst funktionieren Links auf Medium/Extended-Statuswerte (wie in Task 3 geplant) nicht.

### Sollte verbessert werden

- **`next/form` anstelle von standard `<form>`**: Next.js 15+ bietet die `Form` Komponente (`import Form from 'next/form'`), die bei GET-Submits eine weiche Client-Side-Navigation durchführt anstelle eines harten Page Reloads. Dies in Task 2 als Option oder Vorgabe aufnehmen.

### Optional

- **Debounce / Auto-Submit:** Da nur serverseitig gefiltert wird, erfordert die Textsuche aktuell einen Klick auf "Suchen" oder "Enter". Für ein MVP ist das absolut in Ordnung. Man könnte erwähnen, dass ein Auto-Submit per JS vorerst Out of Scope ist.

## Offene Fragen für die Integration

- Keine offenen fachlichen Fragen. Die Korrektur in Task 2 ist rein technisch zur Behebung des logischen Widerspruchs.

## Nächster Schritt

Gehe zurück in die Autor-Session, in der der Feature-Plan erstellt wurde. Führe dort aus:

```text
/integrate-feature-plan-review docs/project/features/meine-antraege-und-statusuebersicht/plan-v001.md docs/project/features/meine-antraege-und-statusuebersicht/plan-reviews/plan-v001-r01-review.md
```

## Qualitätscheck vor Abschluss

- [x] Das Review ändert den Feature-Plan nicht.
- [x] Kritische Findings sind konkret und handlungsorientiert.
- [x] Architektur, Task-Reihenfolge, betroffene Dateien, Tests und Validierung wurden geprüft.
- [x] PRD-Abgleich und Scope-Grenzen wurden betrachtet.
- [x] Plan-Version und Plan-Änderungshistorie wurden geprüft.
- [x] Verbesserungsvorschläge sind so formuliert, dass `/integrate-feature-plan-review` sie einzeln bewerten kann.
- [x] Der nächste Schritt verweist zurück in die Autor-Session mit `/integrate-feature-plan-review`.
