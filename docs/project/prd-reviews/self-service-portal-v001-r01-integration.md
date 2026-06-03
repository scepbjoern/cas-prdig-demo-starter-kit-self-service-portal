# PRD Review Integration: Self-Service-Portal v001 Runde r01

## Metadaten

| Feld | Wert |
|---|---|
| Ausgangs-PRD | `docs/project/prds/self-service-portal-v001.md` |
| Neue PRD-Version | `docs/project/prds/self-service-portal-v002.md` |
| Review | `docs/project/prd-reviews/self-service-portal-v001-r01-review.md` |
| Ausgangsversion | `v001` |
| Zielversion | `v002` |
| Review-Runde | `r01` |
| Integrationskontext | Autor-Session bestaetigt |

## Kurzfazit

Die Review wurde weitgehend uebernommen. Das PRD `v002` schaerft vor allem das MVP-Feldmodell, die Statusentscheidung, die Admin-Rechte, die lokale Backend-Architektur und den Input fuer `/adapt-to-project`. Der Scope wurde nicht erweitert: Medium und Extended bleiben realistische Ausbaustufen, waehrend die spaetere Live-Demo auf MVP-Features fokussieren soll.

## Entscheidungen

| ID | Review-Punkt | Entscheidung | Begruendung | Aenderung in neuer PRD-Version |
|---|---|---|---|---|
| R-01 | MVP-Feldmodell mit Pflichtgrad, Typ, Beispiel und Validierung fehlt | uebernehmen | Hilft Datenmodell, Formular, Seed und Tests einheitlich zu planen | MVP-Feldtabelle mit Pflichtgrad, Typ, Beispiel und Validierung ergaenzt |
| R-02 | `Zeitraum oder Startdatum` ist unklar | uebernehmen | MVP braucht eindeutige Feldentscheidung | `startdatum` als Pflichtfeld, `enddatum` optional |
| R-03 | Kostenstelle/Organisationseinheit Freitext oder Auswahl unklar | uebernehmen | Freitext reicht fuer Demo-MVP | `kostenstelle` als Freitextfeld festgelegt |
| R-04 | Backend-API-Abweichung widerspricht `AGENTS.md` | teilweise uebernehmen | PRD kann Entscheidung klaeren; `AGENTS.md`-Aenderung ist separater Schritt | Entscheidungsnotiz im PRD ergaenzt und Harmonisierung von `AGENTS.md` als Risiko notiert |
| R-05 | Status-Enum-Entscheidung fehlt | uebernehmen | Wichtig fuer Prisma-Schema und Erweiterbarkeit | Alle Statuswerte initial im Datenmodell, MVP nutzt nur `ENTWURF` und `EINGEREICHT` |
| R-06 | Starter-Kit-Bereinigung fuer `/adapt-to-project` zu ungenau | uebernehmen | Direkter Input fuer naechsten Workflow | Tabelle "Starter-Kit-Bereinigung" ergaenzt |
| R-07 | Admin-Rechte im MVP unklar | uebernehmen | Rollenverhalten muss vor Planung klar sein | Admin darf alle lesen und eigene Demo-Antraege erstellen/einreichen; keine fremde Bearbeitung/Statuswechsel im MVP |
| R-08 | Speichern als Entwurf vs. direkt Einreichen unklar | uebernehmen | Statusworkflow soll demonstrierbar bleiben | Zwei Aktionen festgelegt: Entwurf speichern und Einreichen |
| R-09 | LLM, File Upload und KI-/Upload-Seiten nach Adapt unklar | teilweise uebernehmen | Zielzustand gehoert ins PRD, konkrete Dateibearbeitung spaeter in `/adapt-to-project` | Bausteintabelle und Bereinigungstabelle konkretisiert |
| R-10 | Rollenfilter und kein Audit Trail im MVP explizieren | uebernehmen | Security-Akzeptanz wird klarer | Security-Abschnitt um Listen-, Detail- und Mutationsfilter sowie "kein Audit Trail im MVP" ergaenzt |
| R-11 | Feature-Kandidaten sollen nur MVP-Prioritaeten 1-4 als naechste Planung markieren | uebernehmen | Entspricht Autor-Entscheidung fuer Live-Demo | Hinweis vor Feature-Tabelle ergaenzt |
| R-12 | Seed-Daten sollen fiktive Anbieter, Kostenstellen und Testpersonen nutzen | uebernehmen | Datenschutz und Demo-Qualitaet | Seed-/Datenschutzabschnitte konkretisiert |
| R-13 | Offene Frage "nur MVP?" soll nicht offen bleiben | uebernehmen | Autor hat MVP-Fokus bestaetigt | Offene Frage zu Entscheidung umformuliert |
| R-14 | Weitere Review-Runde? | ablehnen | Aenderungen schaerfen konkrete Punkte, veraendern aber den Scope nicht grundlegend | Empfehlung: `v002` fachlich bestaetigen und danach committen sowie `/adapt-to-project` nutzen |

## Uebernommene Aenderungen an der neuen PRD-Version

- Dokumentversion auf `v002` aktualisiert.
- Aenderungshistorie um Review-Integration ergaenzt.
- Bestaetigte Projektentscheidung zur lokalen Next.js-Backend-Logik statt separater Backend API ergaenzt.
- Rollen und Admin-Rechte fuer das MVP praezisiert.
- MVP um separate Aktionen "Entwurf speichern" und "Einreichen" geschaerft.
- MVP-Feldmodell mit Pflichtgrad, Typ, Beispiel und Validierungsregeln ergaenzt.
- Statusentscheidung fuer initiales Datenmodell und MVP-Nutzung ergaenzt.
- Schnittstellenabschnitt auf Server Actions als bevorzugte lokale Backend-Grenze geschaerft.
- Starter-Kit-Nutzung um konkrete Bereinigungstabelle fuer `/adapt-to-project` erweitert.
- Security- und Datenschutzabschnitt um Rollenfilter, Mutationsschutz, fiktive Seed-Daten und "kein Audit Trail im MVP" ergaenzt.
- Demo-Szenarien und Feature-Kandidaten an die geschaerften MVP-Entscheidungen angepasst.

## Aenderungshistorie im PRD

In `docs/project/prds/self-service-portal-v002.md` wurde folgende Zeile ergaenzt:

| Version | Datum | Anlass | Kurzbeschreibung |
|---|---|---|---|
| v002 | 2026-06-03 | Review-Integration r01 | MVP-Feldmodell, Statusentscheidung, Admin-Rechte, Starter-Kit-Bereinigung und Backend-Vereinfachung praezisiert |

## Teilweise uebernommene Punkte

- **Backend-API-Abgleich mit `AGENTS.md`:** Die fachliche Entscheidung wurde im PRD sichtbar gemacht. Eine direkte Aenderung an `AGENTS.md` wurde nicht vorgenommen, weil dieser Skill nur PRD und Integration-Datei schreiben soll.
- **LLM/File Upload/KI-Demo-Zielzustand:** Das PRD beschreibt den Zielzustand fuer `/adapt-to-project`, ohne konkrete Code- oder Dateioperationen vorwegzunehmen.

## Abgelehnte Punkte

- **Zwingende weitere Review-Runde:** Abgelehnt. Die Integration praezisiert konkrete Review-Findings, ohne den Scope grundlegend umzubauen. Eine weitere Review kann optional erfolgen, ist aber nicht zwingend.

## Offene Punkte

- **Dozentenvalidierung des Umfangs:** Weiterhin offen. Falls im Kurskontext noetig, soll der Umfang vor der Feature-Planung kurz mit dem Dozenten validiert werden.
- **Harmonisierung von `AGENTS.md`:** Das PRD dokumentiert die Backend-Vereinfachung. `AGENTS.md` nennt noch Backend-API-Anbindung und sollte spaeter in einem separaten Dokumentationsschritt angepasst werden.

## Empfehlung fuer den naechsten Schritt

`docs/project/prds/self-service-portal-v002.md` sollte fachlich bestaetigt werden. Danach sollten `v002`, die Review-Datei und diese Integration-Datei committed werden. Nach PRD-Bestaetigung ist der naechste Workflow:

```text
/adapt-to-project docs/project/prds/self-service-portal-v002.md
```

Eine weitere PRD-Review-Runde ist nicht zwingend, kann aber optional in einer frischen Session erfolgen, wenn die geschaerften Feld-, Status- oder Adapt-Entscheidungen nochmals kritisch geprueft werden sollen.

## Qualitaetscheck vor Abschluss

- [x] Ausgangs-PRD, Review-Datei, Ausgangsversion, Zielversion und Review-Runde sind korrekt dokumentiert.
- [x] Jede relevante Review-Empfehlung ist als uebernommen, teilweise uebernommen, abgelehnt oder offen dokumentiert.
- [x] Ablehnungen sind nachvollziehbar begruendet.
- [x] Die neue PRD-Version ist genannt und bleibt von der Ausgangsversion unterscheidbar.
- [x] Die Aenderungshistorie der neuen PRD-Version enthaelt einen Eintrag fuer die Review-Integration.
- [x] Offene Punkte enthalten einen konkreten naechsten Klaerungsschritt.
- [x] Die Empfehlung fuer den naechsten Schritt nennt `/adapt-to-project` mit dem neuen PRD-Pfad.
