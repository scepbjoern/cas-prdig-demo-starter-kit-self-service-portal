# Feature Plan Review Integration: Datenmodell Weiterbildungsantrag v001 Runde 01

## Metadaten

| Feld | Wert |
|---|---|
| Ausgangsplan | `docs/project/features/datenmodell-weiterbildungsantrag/plan-v001.md` |
| Neue Plan-Version | `docs/project/features/datenmodell-weiterbildungsantrag/plan-v002.md` |
| Review | `docs/project/features/datenmodell-weiterbildungsantrag/plan-reviews/plan-v001-r01-review.md` |
| Ausgangsversion | `v001` |
| Zielversion | `v002` |
| Review-Runde | `r01` |
| Integrationskontext | Autor-Session bestaetigt |
| Aktualisierter TASKS.md-Eintrag | ja |

## Kurzfazit

Die Review wurde weitgehend uebernommen und hat den Plan von einer starken Erstfassung zu einer klar execute-faehigen Version geschaerft. Vor allem die Reihenfolge fuer Prisma-Generate/Reset, die konkrete Prisma-Typisierung, die Erfassung kritischer Altpfade wie `antragEmailService`, die Bearbeiten-/Action-Dateien sowie die explizite MVP-Abgrenzung fuer Admin-/Reviewer-Entscheidungslogik wurden verbessert.

Offen geblieben ist keine blockierende Grundsatzfrage. Der Punkt `notizen` bzw. `antragEmailService` wurde bewusst teilweise uebernommen: `plan-v002` erzwingt eine klare Execute-Entscheidung, ohne bereits auf Planungsebene eine neue Kommunikationsfunktion festzuschreiben.

## Entscheidungen

| ID | Review-Punkt | Entscheidung | Begründung | Änderung in neuer Plan-Version |
|---|---|---|---|---|
| R-01 | `prisma generate` und `db:reset` sind nicht verbindlich genug eingeplant | übernehmen | Projektregel aus `KILO_INSTRUCTIONS.md` ist eindeutig und fuer Prisma-7-Schema-Aenderungen kritisch | Eigener Generate-Task, Reset-Validierung im Seed-Task und aktualisierte Validation Commands |
| R-02 | Fehlende betroffene Dateien: `antragEmailService`, zugehöriger Test, Bearbeiten-Seite, `antrag-actions.tsx`, optional Dashboard | übernehmen | Das sind aktive Referenzen, die bei Feldentfernung oder Scope-Korrektur brechen können | Pflichtlektüre, betroffene Dateien, Tasks und Smoke-Checks erweitert |
| R-03 | Umgang mit `notizen` und `antragEmailService` ist unklar | teilweise übernehmen | Review-Finding ist korrekt; die finale technische Entscheidung soll aber im Execute-Kontext mit tatsächlichen Referenzen getroffen werden | Datenmodell-, Scope- und Task-Abschnitte verlangen explizite Behandlung von `notizen`/Service/Test statt stiller Feldentfernung |
| R-04 | Reviewer-/Admin-Entscheidungslogik ist PRD-widrig und im Plan zu vage behandelt | übernehmen | PRD `v002` schliesst fremde Admin-Bearbeitung und Statuswechsel im MVP aus | Rollen-/Berechtigungsabschnitt, Scope, Tasks, Acceptance Criteria und Review Notes präzisiert |
| R-05 | Task-Reihenfolge ist für gekoppelte Prisma-Typen/Seed/UI noch zu unscharf | übernehmen | Ein frischer Execute-Agent braucht eine belastbare Reihenfolge | Reihenfolge umgestellt auf Schema → Generate → Zod/Status → Seed/Reset → UI/API/Service → Tests/Build |
| R-06 | Task-Validierung ist zu optimistisch mit zu frühem `npm run test` | übernehmen | Zwischenstände nach Schema-Refactor sind nicht automatisch testgrün | Validierung pro Task differenziert; Gesamt-`npm run test` und `npm run build` erst an geeigneten Integrationspunkten |
| R-07 | Prisma-Feldtypen für Datum und Geldbetrag sind nicht konkret festgelegt | übernehmen | Execute soll diese Architekturentscheidung nicht neu treffen müssen | Datenmodell mit `DateTime`, `DateTime?` und `Float` sowie Parsing-/Serialisierungsregeln präzisiert |
| R-08 | API- und Server-Action-Parsing für Datum/Kosten muss ausdrücklich angeglichen werden | übernehmen | Sonst drohen zwei widersprüchliche Validierungswahrheiten | Parsing-Strategie in Architekturentscheidungen, Datenmodell, Tasks und Edge Cases ergänzt |
| R-09 | Tests sollten zusätzliche Negativfälle und Service-/Regressionsthemen abdecken | übernehmen | Erhöht Übergabereife ohne Scope-Ausweitung | Teststrategie und Test-Task um Grenzfälle und Service-Regressionen erweitert |
| R-10 | Optionaler Helper für FormData-Mapping und Mehrpersonen-Hinweis | teilweise übernehmen | Nützlich, aber nicht zwingend als harte Strukturvorgabe | Helper als erlaubte Option dokumentiert; kleiner Koordinationshinweis über Prisma-Schema-Risiko indirekt im Plan-Kontext sichtbar gemacht |

## Übernommene Änderungen an der neuen Plan-Version

- Prisma-Typen fuer `startdatum`, `enddatum` und `kostenChf` konkret festgelegt
- Verbindliche Reihenfolge fuer `npx prisma generate` und `npm run db:reset` aufgenommen
- Bearbeiten-Seite, Action-UI, Service-Test und Dashboard als betroffene Pfade ergaenzt
- Rollen- und MVP-Regeln fuer Admin/Reviewer explizit gegen den aktuellen Demo-Stand abgesichert
- Task-Reihenfolge und Task-Validierung realistischer und execute-tauglich geschärft
- Parsing-Regeln fuer FormData und API fuer Datum/Betrag explizit beschrieben
- Teststrategie um Grenzfaelle und Service-Regressionen erweitert

## Plan-Änderungshistorie

In `plan-v002.md` wurde in `## Plan-Aenderungshistorie` die Zeile fuer `v002` ergänzt:

- `v002 | 2026-06-03 | Review-Integration r01 | Reihenfolge, Prisma-Typen, betroffene Altpfade, Generate-/Reset-Sequenz und MVP-Berechtigungen praezisiert`

## Teilweise übernommene Punkte

- `notizen` bzw. `antragEmailService` wurde nicht vorschnell als fachliche Loeschentscheidung festgelegt. Stattdessen verlangt `plan-v002`, dass Execute diesen Altpfad bewusst entkoppelt oder als technische Uebergangsloesung dokumentiert.
- Ein FormData-Mapping-Helper wurde nicht verpflichtend gemacht, aber als erlaubte Option dokumentiert, wenn er echte Duplikate reduziert.

## Abgelehnte Punkte

- Keine.

## Offene Punkte

- Keine blockierenden offenen Punkte. Die zuvor offenen Entscheidungen zu `kostenChf` und zur Reviewer-/Admin-Entscheidungslogik wurden in der Autor-Session bestaetigt und in `plan-v002` festgezogen.

## Empfehlung für den nächsten Schritt

`plan-v002.md` kann jetzt fachlich bestaetigt und danach committed werden. Wenn du mit der geschaerften Plan-Version einverstanden bist, ist der naechste Workflow-Schritt anschliessend `/execute docs/project/features/datenmodell-weiterbildungsantrag/plan-v002.md`.

## Qualitätscheck vor Abschluss

- [x] Ausgangsplan, Review-Datei, Ausgangsversion, Zielversion und Review-Runde sind korrekt dokumentiert.
- [x] Jede relevante Review-Empfehlung ist als übernommen, teilweise übernommen, abgelehnt oder offen dokumentiert.
- [x] Ablehnungen sind nachvollziehbar begründet, insbesondere wenn Autor-Session-Kontext eine Rolle spielt.
- [x] Die neue Plan-Version ist genannt und bleibt von der Ausgangsversion unterscheidbar.
- [x] Die Plan-Änderungshistorie der neuen Plan-Version enthält einen Eintrag für die Review-Integration.
- [x] `TASKS.md` zeigt auf die neue Plan-Version oder eine Abweichung ist begründet.
- [x] Offene Punkte enthalten einen konkreten nächsten Klärungsschritt.
- [x] Die Empfehlung für den nächsten Schritt nennt entweder eine weitere Review der neuen Plan-Version oder `/execute` mit dem neuen Plan-Pfad.
