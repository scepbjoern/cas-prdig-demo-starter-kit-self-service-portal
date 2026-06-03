# PRD Review: Self-Service-Portal v001 Runde r01

## Metadaten

| Feld | Wert |
|---|---|
| PRD | `docs/project/prds/self-service-portal-v001.md` |
| Logische PRD-Version | `v001` |
| Review-Runde | `r01` |
| Reviewer-Kontext | Frische Session nach `/prime` bestätigt: ja |
| Vorherige Review-/Integration-Datei | Nicht relevant |

## Kurzfazit

Das PRD ist als Grundlage insgesamt brauchbar: Es beschreibt klar ein einzelnes IT-System, grenzt das Self-Service-Portal gegen Backend API, Fall-Cockpit, Workflow-Worker und Mocks ab und nutzt den Brownfield-/Starter-Kit-Kontext sichtbar. Besonders positiv sind die klare MVP-/Medium-/Extended-Trennung, die nachvollziehbare Rollenbeschreibung und der Abschnitt zur Starter-Kit-Nutzung.

Am meisten gefährdet die spätere Feature-Planung die noch nicht ganz scharfe fachliche Definition des MVP-Datenmodells. Das PRD nennt zwar MVP-Felder, lässt aber offen, welche Felder zwingend sind, wie Zeitraum/Startdatum konkret modelliert werden soll und welche einfachen Plausibilitätsregeln gelten. Für `/adapt-to-project` und die ersten `/plan-feature`-Schritte ist das ein echter Reibungspunkt.

Ein zweiter wichtiger Punkt ist die bewusste Abweichung von der DSL: Das PRD erklärt, dass keine separate Backend API umgesetzt wird, während `AGENTS.md` noch eine Backend-API-Anbindung im Scope nennt. Diese Abweichung ist im PRD sinnvoll dokumentiert, sollte aber als Projektannahme explizit bestätigt oder in den Projektregeln harmonisiert werden.

## Stärken

- Das PRD beschreibt genau ein IT-System: das Self-Service-Portal für Weiterbildungsanträge.
- Die Architekturabweichung gegenüber der DSL wird transparent als bewusste Vereinfachung markiert.
- MVP, Medium, Extended und Out of Scope sind klar getrennt und verhindern, dass optionale Funktionen versehentlich als MVP gelesen werden.
- Rollen und Berechtigungen sind für `user_applicant`, `admin` und `user_reviewer` verständlich beschrieben.
- User Stories, Kernfunktionen, Demo-Szenarien und Erfolgskriterien sind grundsätzlich gut miteinander verknüpft.
- Der Brownfield-Kontext ist sauber berücksichtigt; das PRD entscheidet den Stack nicht neu.
- Der Abschnitt "Starter Kit Nutzung" ist vorhanden und für `/adapt-to-project` bereits eine gute Basis.
- Datenschutz und Testdaten werden prototypengerecht und ohne übertriebene Produktionsanforderungen beschrieben.

## Kritische Findings

Findings, die vor `/adapt-to-project` oder `/plan-feature` geklärt werden sollten.

| Bereich | Finding | Warum relevant | Konkreter Verbesserungsvorschlag |
|---|---|---|---|
| MVP-Datenmodell | Die MVP-Felder sind fachlich genannt, aber Pflichtgrad, Datentypen und Validierungsregeln sind nicht präzise genug. | Das erste Feature "Datenmodell Weiterbildungsantrag" braucht konkrete Felder, sonst werden Schema, Formular, Seed und Tests unterschiedlich interpretiert. | Ergänze eine MVP-Feldtabelle mit Feldname, Pflicht/optional, grobem Typ, Beispiel und Validierung. Mindestens: Titel, Anbieter, Startdatum oder Zeitraum, Kostenbetrag CHF, Kostenstelle/Organisationseinheit, Begründung/Nutzen, Bemerkung. |
| Architekturabgleich | PRD sagt "keine separate Backend API im MVP", während `AGENTS.md` im Scope noch "Anbindung an die Backend API" nennt. | Spätere Agents könnten zwischen Projektkontext und PRD hin- und herspringen und fälschlich REST-Integration planen. | Ergänze im PRD eine explizite Entscheidungsnotiz: Für dieses Repo und MVP ersetzt lokale Next.js-Backend-Logik die separate Backend API. Zusätzlich sollte später `AGENTS.md` harmonisiert werden. |
| Statusmodell | Das PRD nennt spätere Statuswerte, aber keine klare Empfehlung, ob das initiale Datenmodell nur MVP-Status oder bereits alle anschlussfähigen Status enthalten soll. | Prisma-Schema-Änderungen sind koordinationssensibel. Die Entscheidung beeinflusst Feature-Reihenfolge, Tests und spätere Erweiterbarkeit. | Entscheide im PRD: Entweder initial nur `ENTWURF`/`EINGEREICHT`, oder bereits alle dokumentierten Statuswerte im Enum anlegen, aber UI/Logik im MVP nur für die beiden MVP-Status aktivieren. |
| `/adapt-to-project`-Input | Die irrelevanten Demo-Inhalte sind gelistet, aber nicht priorisiert: "ersetzen", "entfernen", "behalten als Platzhalter" oder "fachlich anpassen" bleibt offen. | Der Adapt-Schritt muss wissen, ob `/personen`, KI-Demo, Upload, generische API-Routen und Demo-Tests entfernt, gestubbt oder nur später ignoriert werden sollen. | Ergänze eine Tabelle "Starter-Kit-Bereinigung" mit Baustein/Route/Modell, Zielzustand und Begründung. |
| Admin-Berechtigungen | Admin darf "alle Anträge einsehen"; unklar ist, ob Admin im MVP auch Anträge im Namen anderer erstellen/einreichen darf oder nur Demo-Daten kontrolliert. | Das beeinflusst Formularlogik, Ownership, Seed-Daten und spätere Demo-Abläufe. | Präzisiere Admin-Rechte im MVP: nur alle lesen plus eigene Demo-Anträge erstellen, oder auch fremde Anträge ändern/einreichen. |

## Unklare Anforderungen

| Abschnitt | Unklarheit | Rückfrage an den Menschen oder Autor-Agenten |
|---|---|---|
| 6 / 9 | Soll "Zeitraum oder Startdatum" wirklich alternativ bleiben, oder soll fürs MVP ein konkretes Feld gewählt werden? | Für die Demo besser ein Pflichtfeld `startdatum` oder zwei Felder `startdatum`/`enddatum` verwenden? |
| 9 | Ist "Kostenstelle oder Organisationseinheit" ein Freitextfeld oder soll es Demo-Auswahlwerte geben? | Reicht Freitext fürs MVP, oder braucht die Demo sichtbare Test-Kostenstellen? |
| 8 / 13 | Soll ein Antrag im MVP zuerst als Entwurf gespeichert und danach separat eingereicht werden, oder darf das Formular direkt einreichen? | Muss die Demo beide Schritte zeigen: Speichern als `ENTWURF` und danach Einreichen zu `EINGEREICHT`? |
| 11 | Was soll mit LLM, File Upload und bestehenden KI-/Upload-Seiten nach `/adapt-to-project` passieren? | Sollen sie gestubbt/aus Navigation entfernt werden, oder bleiben sie als Starter-Kit-Demo ausserhalb des Portalflusses erhalten? |
| 14 | Ist "nur MVP soll umgesetzt werden" bereits fachlich bestätigt oder weiterhin offen? | Falls bestätigt, sollte die offene Frage in eine Annahme oder Entscheidung umformuliert werden. |

## Fehlende Elemente gemäss PRD-Template

| Template-Bereich | Befund | Vorschlag |
|---|---|---|
| Daten und Statusmodell | Entitäten und Statuswerte sind vorhanden, aber Validierungs- und Pflichtfelddetails fehlen. | Feldtabelle mit Pflichtgrad, Typ, Beispielwerten und MVP-Plausibilitäten ergänzen. |
| Schnittstellen und Umsysteme | Nachbarsysteme sind beschrieben, aber keine groben lokalen API-/Server-Action-Grenzen für MVP. | Kurz festhalten, ob Feature-Pläne primär Server Actions nutzen und Route Handlers nur optional/für spätere externe Clients. |
| Security, Datenschutz und Compliance | Rollen- und Testdatenhinweise sind vorhanden; Audit/Logging wird nur für Extended erwähnt. | Für MVP explizit sagen, dass kein Audit Trail gebaut wird, aber Rollenfilter in Liste/Detail/Mutation erforderlich sind. |
| Starter Kit Nutzung | Bausteine sind gelistet, aber Bereinigungsziel pro Demo-Seite/Modell ist nicht eindeutig. | Tabelle mit "behalten", "fachlich anpassen", "aus Navigation entfernen", "stubben" ergänzen. |

## Versionierung und Änderungshistorie

Dokumentversion `v001`, Datum und Änderungshistorie sind vorhanden und konsistent. Der Dateiname `self-service-portal-v001.md` passt zur logischen Version. Für die nächste Version sollte die Änderungshistorie nicht nur "Review integriert" nennen, sondern die wichtigsten Review-Entscheidungen knapp sichtbar machen.

## Scope und Ausbaustufen

Die Scope-Trennung ist eine Stärke des PRDs. MVP, Medium, Extended und Out of Scope sind sauber getrennt. Besonders hilfreich ist der wiederholte Hinweis, dass Medium/Extended realitätsnah dokumentiert, aber wahrscheinlich nicht für die Live-Demo umgesetzt werden.

Ein Risiko bleibt: Medium-Funktionen wie Rückfragen/Kommentare und Admin-Statuswechsel wirken in Demo-Szenarien attraktiv und könnten später versehentlich in die MVP-Planung rutschen. Die Feature-Kandidaten-Tabelle priorisiert sie zwar niedriger, sollte aber noch deutlicher sagen: Nach PRD-Bestätigung zuerst nur Priorität 1-4 planen, falls der Mensch nichts anderes bestätigt.

## Rollen, Berechtigungen und Statuslogik

Die Rollen sind grundsätzlich konsistent mit `AGENTS.md` und `KILO_INSTRUCTIONS.md`. `user_applicant` ist Hauptnutzerin, `admin` ist Demo-/Supportrolle, `user_reviewer` bleibt technisch vorhanden, aber fachlich eher Fall-Cockpit.

Unklar ist der genaue Umfang der Admin-Rechte im MVP. "Alle Anträge einsehen" ist eindeutig; "administrative Demo-Nutzung" kann aber auch Erstellen, Bearbeiten, Einreichen oder Statuswechsel bedeuten. Diese Rechte sollten vor der Feature-Planung präzisiert werden.

Die Statuslogik ist fachlich nachvollziehbar. Für die Implementierung fehlt jedoch die Entscheidung, ob alle späteren Statuswerte bereits im Prisma-Enum stehen sollen. Wegen Prisma-Schema-Änderungen und späterer Erweiterbarkeit ist diese Entscheidung vor `/adapt-to-project` oder spätestens vor dem Datenmodell-Feature wichtig.

## Datenmodell, Schnittstellen und Mocks

Das PRD erkennt korrekt, dass `Weiterbildungsantrag` das zentrale Prozessobjekt ist und aktuell generische Starter-Kit-Entitäten angepasst werden müssen. Die Beschreibung ist ausreichend für eine Richtung, aber noch nicht ausreichend für einen robusten Datenmodell-Plan.

Die Schnittstellen sind passend eingeordnet: lokale Prisma/SQLite-Datenbank im MVP, externe Backend API/ERP/E-Mail-Mock nur als Kontext oder spätere Ausbaustufe. Die bewusste Abweichung von der DSL ist fachlich plausibel, muss aber gegen `AGENTS.md` harmonisiert werden.

Mocks sind prototypengerecht beschrieben. Für das MVP ist gut festgehalten, dass ERP-API-Mock und E-Mail-Mock nicht nötig sind. Falls Resend/E-Mail im Starter-Kit technisch schon vorhanden ist, sollte das PRD klarstellen, ob vorhandene E-Mail-Demo-Funktionalität entfernt, ignoriert oder als Extended-Grundlage behalten wird.

## Demo-Szenarien und Erfolgskriterien

Die Demo-Szenarien decken die MVP-User-Stories gut ab. Die Erfolgskriterien sind beobachtbar und für spätere Plan-Akzeptanzkriterien brauchbar.

Noch etwas unscharf ist der Ablauf "Speichern" versus "Einreichen". Das PRD nennt beide Schritte, aber nicht ausdrücklich, ob sie als zwei UI-Aktionen demonstriert werden müssen. Da Status `ENTWURF` und `EINGEREICHT` zentral sind, sollte diese Trennung explizit bestätigt werden.

## Starter-Kit-Nutzung und Adapt-to-Project

Der Abschnitt ist vorhanden und erfüllt die Grundanforderung aus dem PRD-Template. Für `/adapt-to-project` wäre er aber deutlich besser, wenn die Zielzustände der Starter-Kit-Demo-Elemente konkretisiert werden.

Empfohlen ist eine zusätzliche Bereinigungstabelle, zum Beispiel:

| Element | Zielzustand nach Adapt | Begründung |
|---|---|---|
| Generische `/antraege`-Seiten | fachlich zu Weiterbildungsanträgen anpassen | Kern-MVP |
| `/personen` | aus Navigation entfernen oder stubben | nicht zentral für Portal |
| KI-Demo | aus Navigation entfernen oder stubben | kein LLM-Use-Case |
| Upload | behalten nur falls Kursunterlagen später geplant, sonst aus UI entfernen | nicht MVP |
| `Person`-Modell | entfernen oder ungenutzt lassen | abhängig von Adapt-Strategie |

Diese Detaillierung verhindert, dass der Adapt-Schritt zu viel oder zu wenig bereinigt.

## Prototypen-Grenzen und sensible Daten

Das PRD ist hier solide. Es verlangt Demo- und Testdaten, keine echten produktiven Personaldaten, keine vertraulichen Budgetinformationen und keine produktive Security-/Compliance-Umsetzung. Das ist prototypengerecht.

Eine kleine Ergänzung wäre sinnvoll: Demo-Seed-Daten sollten ausdrücklich fiktive Weiterbildungsanbieter, fiktive Kostenstellen und Testpersonen verwenden. Dadurch wird die Datenschutzlinie auch für spätere Seed- und E2E-Planung greifbar.

## Verbesserungsvorschläge nach Priorität

### Muss vor dem nächsten Schritt geklärt werden

- MVP-Feldmodell für `Weiterbildungsantrag` mit Pflichtgrad, Typ, Beispiel und Validierung ergänzen.
- Architekturentscheidung "lokale Next.js-Backend-Logik statt separater Backend API im MVP" als bestätigte Projektentscheidung sichtbar machen und gegen `AGENTS.md` harmonisieren.
- Entscheiden, ob spätere Statuswerte bereits im initialen Prisma-Enum angelegt werden oder erst bei Medium/Extended.
- Admin-Rechte im MVP präzisieren.

### Sollte verbessert werden

- Starter-Kit-Bereinigung für `/adapt-to-project` konkreter beschreiben.
- Demo-Ablauf "Entwurf speichern" und "Einreichen" als separate oder gemeinsame Aktion klären.
- Feature-Kandidaten mit Hinweis versehen, dass vorerst nur MVP-Prioritäten 1-4 geplant werden sollen, sofern der Mensch nichts anderes bestätigt.
- Seed-Daten-Anforderungen für fiktive Weiterbildungsanträge ergänzen.

### Optional

- Glossar für Antrag, Fall, Weiterbildungsantrag und Status ergänzen, falls mehrere Teammitglieder damit arbeiten.
- Kurze Notiz aufnehmen, ob bestehende Resend-/E-Mail-Funktionalität als Extended-Grundlage behalten oder vorerst ausgeblendet wird.
- Dokumentieren, ob `user_reviewer` im Portal nur lesen darf oder in der Navigation möglichst nicht sichtbar sein soll.

## Offene Fragen für die Integration

- Soll das MVP-Feldmodell `startdatum` oder einen Zeitraum mit `startdatum` und `enddatum` enthalten?
- Soll `kostenstelle` Freitext sein oder aus Demo-Auswahlwerten kommen?
- Soll der initiale Prisma-Status-Enum bereits `IN_RUECKFRAGE` und `ZURUECKGEZOGEN` enthalten?
- Welche Aktionen darf `admin` im MVP konkret ausführen: nur lesen, eigene Demo-Anträge erstellen, fremde Anträge bearbeiten/einreichen oder Status ändern?
- Soll `/adapt-to-project` die Seiten `/personen`, `/ai-demo`, Upload und andere Demo-Elemente entfernen, aus der Navigation nehmen oder als Platzhalter erhalten?
- Ist der MVP-only-Fokus für die Live-Demo fachlich bestätigt?

## Nächster Schritt

Gehe zurück in die Autor-Session, in der das PRD erstellt wurde. Führe dort aus:

```text
/integrate-prd-review docs/project/prds/self-service-portal-v001.md docs/project/prd-reviews/self-service-portal-v001-r01-review.md
```

## Qualitätscheck vor Abschluss

- [x] Das Review ändert das PRD nicht.
- [x] Kritische Findings sind konkret und handlungsorientiert.
- [x] Verbesserungsvorschläge sind so formuliert, dass `/integrate-prd-review` sie einzeln bewerten kann.
- [x] Dokumentversion und Änderungshistorie wurden geprüft.
- [x] MVP / Medium / Extended / Out of Scope wurden geprüft.
- [x] Rollen, Berechtigungen, Datenmodell, Schnittstellen, Demo-Szenarien und Starter-Kit-Nutzung wurden betrachtet.
- [x] Prototypen-Grenzen und sensible Daten wurden bewusst kurz geprüft.
- [x] Der nächste Schritt verweist zurück in die Autor-Session mit `/integrate-prd-review`.
