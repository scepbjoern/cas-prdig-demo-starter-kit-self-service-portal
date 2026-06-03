# PRD: Self-Service-Portal fuer Weiterbildungsantraege

## 1. Executive Summary

**IT-System / Komponente:** Self-Service-Portal fuer Weiterbildungsantraege  
**Dokumentversion:** v002  
**Datum:** 2026-06-03

Dieses PRD beschreibt das Self-Service-Portal als einzelnes IT-System innerhalb des Demo-Prototyps fuer einen digitalen Antrags- und Genehmigungsprozess. Im Portal koennen Antragstellerinnen Weiterbildungsantraege erfassen, einreichen und den Status ihrer eigenen Antraege einsehen.

Die Gesamtarchitektur liegt nur als `docs/project/architecture/gesamtarchitektur.dsl` vor. Eine ergaenzende `gesamtarchitektur.md` mit textueller Prozessbeschreibung liegt nicht vor. Alle aus der DSL abgeleiteten fachlichen Details werden daher als Annahmen oder bewusste Vereinfachungen markiert.

Das MVP-Ziel ist: Eine Antragstellerin kann einen Weiterbildungsantrag mit klar definierten Pflichtfeldern erfassen, validiert als Entwurf speichern, verbindlich einreichen und danach den Status im Portal einsehen.

Medium- und Extended-Funktionen werden bewusst dokumentiert, damit das PRD realitaetsnah wirkt. Fuer die Live-Demo sollen nach aktueller fachlicher Entscheidung nur MVP-Features umgesetzt werden.

## 2. Aenderungshistorie

| Version | Datum | Anlass | Kurzbeschreibung |
|---|---|---|---|
| v001 | 2026-06-03 | Initiale Erstellung | Erstes PRD fuer das Self-Service-Portal fuer Weiterbildungsantraege erstellt |
| v002 | 2026-06-03 | Review-Integration r01 | MVP-Feldmodell, Statusentscheidung, Admin-Rechte, Starter-Kit-Bereinigung und Backend-Vereinfachung praezisiert |

## 3. Kontext und Einordnung

Das Self-Service-Portal ist laut `docs/project/architecture/gesamtarchitektur.dsl` ein Container im Prototyp-Gesamtsystem. Die DSL beschreibt ein End-to-End-System mit Self-Service-Portal, Fall-Cockpit, Backend API, Workflow-/Regel-Worker, Prototyp-Datenbank, ERP-API-Mock und E-Mail-Mock.

Die DSL ordnet dem Self-Service-Portal folgende Aufgabe zu: Antragstellende erfassen Antraege und sehen Statusinformationen ein. Die Antragstellerin ist damit die Hauptnutzerin dieses Systems.

**Bestaetigte Projektentscheidung:** Die DSL beschreibt eine separate Backend API fuer Fachlogik, Validierung, Statuswechsel und Schnittstellen. Fuer dieses Starter-Kit-Repo und das MVP wird diese Trennung bewusst nicht umgesetzt. Lokale Next.js-Backend-Logik im Self-Service-Portal ersetzt die separate Backend API, zum Beispiel ueber Server Actions, optional Route Handlers und Prisma/SQLite.

**Annahme:** Backend API, Fall-Cockpit, Workflow-/Regel-Worker, ERP-API-Mock und E-Mail-Mock bleiben fuer dieses PRD Architekturkontext oder spaetere Ausbaustufen. Sie werden nur so weit beruecksichtigt, wie es fuer ein realitaetsnahes Portal-PRD sinnvoll ist.

**Hinweis fuer Projektregeln:** `AGENTS.md` nennt noch eine Anbindung an die Backend API. Fuer dieses PRD gilt die obige Projektentscheidung. `AGENTS.md` sollte spaeter harmonisiert werden, damit Folge-Agenten keine separate Backend-API-Integration fuer das MVP planen.

## 4. Zielgruppen und Rollen

| Rolle | Beschreibung | Hauptbeduerfnis | Berechtigungen im MVP |
|---|---|---|---|
| `user_applicant` / Antragstellerin | Mitarbeitende Person, die eine Weiterbildung beantragt | Antrag einfach erfassen und spaeter nachvollziehen, ob er eingereicht wurde | Eigene Antraege erstellen, als Entwurf speichern, einreichen und Status eigener Antraege einsehen |
| `admin` / Administrator | Demo- und Supportrolle im Starter Kit | Live-Demo steuern und alle Daten ueberblicken koennen | Alle Antraege lesen; eigene Demo-Antraege erstellen und einreichen; keine fremden Antraege bearbeiten/einreichen und keine Statuswechsel im MVP |
| `user_reviewer` / Sachbearbeitung oder Pruefer | Rolle aus dem Starter Kit und aus dem Gesamtprozess | Fachlich eher dem Fall-Cockpit zugeordnet | Im MVP des Portals nicht zentral; technisch vorhanden, aber nicht Hauptnutzer |

**Annahme:** Die Teamleitung aus der Gesamtarchitektur wird im Self-Service-Portal nicht als eigene technische Rolle abgebildet. Entscheidungen ueber Ausnahmefaelle gehoeren in der Zielarchitektur eher in das Fall-Cockpit.

## 5. Problemstellung und Ziele

Weiterbildungsantraege werden in vielen Organisationen ueber E-Mail, Formulare oder informelle Absprachen vorbereitet. Dadurch ist fuer Antragstellende oft nicht klar, welche Angaben benoetigt werden, ob der Antrag vollstaendig ist und welchen Status er aktuell hat.

Das Self-Service-Portal loest dieses Problem im Demo-Kontext durch eine gefuehrte, rollenbasierte Antragserfassung und eine einfache Statusuebersicht. Die Fachlogik bleibt bewusst prototypisch und lokal, damit die Live-Demo handhabbar bleibt.

Produktprinzipien fuer das MVP:

- Demo-faehig vor produktionsreif
- Antragstellerinnen-zentrierter Ablauf
- Klare Trennung zwischen MVP und spaeteren Ausbaustufen
- Lokale Persistenz mit fiktiven Testdaten statt echter produktiver Daten
- Vorhandene Starter-Kit-Bausteine nutzen, ohne die Gesamtarchitektur vollstaendig nachzubauen
- Lokale Next.js-Backend-Logik statt separater Backend API fuer das MVP

## 6. Scope und Ausbaustufen

### MVP / Minimalversion

- [ ] Weiterbildungsantrag mit Pflichtfeldern erfassen
- [ ] Eingaben validieren
- [ ] Antrag als Entwurf speichern
- [ ] Antrag verbindlich einreichen
- [ ] Status des eigenen Antrags einsehen
- [ ] Antragstellerin sieht nur eigene Antraege
- [ ] Admin kann alle Antraege lesen und eigene Demo-Antraege erstellen/einreichen

### Medium-Version

- [ ] Antragstellerin kann einen noch nicht endgueltig entschiedenen Antrag zurueckziehen
- [ ] Antragstellerin kann Kommentare oder Rueckfragen der Sachbearbeitung einsehen
- [ ] Admin kann fuer Demo-Zwecke einfache Rueckfragen, Kommentare und Statuswechsel erfassen

Hinweis: Die Medium-Version ist primaer dokumentiert, um das PRD realitaetsnah zu machen. Die spaetere Live-Demo soll nach aktueller Entscheidung auf MVP-Features fokussieren.

### Extended-/Luxus-Version

- [ ] E-Mail-Benachrichtigungen ueber einen E-Mail-Mock bei Eingangsbestätigung, Rueckfrage, Genehmigung oder Ablehnung
- [ ] Antragstellerin kann einen Antrag nach Rueckfrage ergaenzen
- [ ] Optionale Budget- oder Kostenstelleninformationen aus einem ERP-API-Mock anzeigen
- [ ] Einfache Audit-Eintraege fuer relevante Statuswechsel

### Out of Scope

- [ ] Vollstaendiges Fall-Cockpit fuer Sachbearbeitung und Teamleitung
- [ ] Separat betriebene Backend API als eigenes System
- [ ] Workflow-/Regel-Worker fuer automatische Vorpruefung, Eskalation oder Benachrichtigung
- [ ] Produktive ERP-Integration
- [ ] Produktiver E-Mail-Versand an echte Empfaenger
- [ ] LLM-Use-Case
- [ ] File Upload im MVP
- [ ] Mobile-Optimierung
- [ ] Produktions-Deployment mit echten Benutzerdaten
- [ ] Komplexe externe API-Integrationen

## 7. User Stories

| ID | User Story | Ausbaustufe | Demo-Bezug / Erfolgskriterium |
|---|---|---|---|
| US-1 | Als Antragstellerin moechte ich einen Weiterbildungsantrag erfassen, damit ich meine Weiterbildung strukturiert beantragen kann. | MVP | Formular ist ausfuellbar und speichert den Antrag |
| US-2 | Als Antragstellerin moechte ich beim Erfassen klare Pflichtfelder und Fehlermeldungen sehen, damit ich den Antrag vollstaendig einreichen kann. | MVP | Ungueltige Eingaben verhindern das Einreichen |
| US-3 | Als Antragstellerin moechte ich meinen Antrag als Entwurf speichern, damit ich ihn vor dem Einreichen kontrollieren kann. | MVP | Antrag ist mit Status `ENTWURF` gespeichert |
| US-4 | Als Antragstellerin moechte ich meinen Antrag einreichen, damit er im Prozess als bereit zur Pruefung gilt. | MVP | Status wechselt von `ENTWURF` zu `EINGEREICHT` |
| US-5 | Als Antragstellerin moechte ich meine eigenen Antraege und deren Status sehen, damit ich den aktuellen Stand nachvollziehen kann. | MVP | Liste zeigt nur eigene Antraege mit Status |
| US-6 | Als Admin moechte ich alle Antraege sehen, damit ich die Demo steuern und Daten kontrollieren kann. | MVP | Admin-Sicht zeigt alle gespeicherten Antraege |
| US-7 | Als Antragstellerin moechte ich einen noch offenen Antrag zurueckziehen, damit ich irrtuemliche oder nicht mehr noetige Antraege beenden kann. | Medium | Status wechselt zu `ZURUECKGEZOGEN` |
| US-8 | Als Antragstellerin moechte ich Rueckfragen der Sachbearbeitung sehen, damit ich erkenne, warum ein Antrag noch nicht entschieden ist. | Medium | Kommentar oder Rueckfrage wird beim Antrag angezeigt |
| US-9 | Als Antragstellerin moechte ich ueber Statusaenderungen informiert werden, damit ich wichtige Entscheidungen nicht verpasse. | Extended | E-Mail-Mock zeigt eine Benachrichtigung |

## 8. Kernfunktionen

| Funktion | Beschreibung | Ausbaustufe | Prioritaet | Rollen / Konsumenten | Hinweise |
|---|---|---|---|---|---|
| Antragserfassung | Formular fuer Weiterbildungsantrag mit fachlichen Feldern | MVP | Must | `user_applicant`, `admin` | Hauptfunktion des Portals |
| Validierung | Pflichtfelder und einfache Plausibilitaetsregeln pruefen | MVP | Must | System | Zod-Schemas eignen sich fuer Unit Tests |
| Entwurf speichern | Antrag wird mit Status `ENTWURF` lokal gespeichert | MVP | Must | `user_applicant`, `admin` | Separate Aktion vor Einreichen |
| Einreichen | Antrag wird verbindlich eingereicht und erhaelt Status `EINGEREICHT` | MVP | Must | `user_applicant`, `admin` fuer eigene Demo-Antraege | Statuswechsel aus `ENTWURF` |
| Statusuebersicht | Eigene Antraege mit Status anzeigen | MVP | Must | `user_applicant` | Admin darf alle lesen |
| Admin-Uebersicht | Demo-Sicht auf alle Antraege | MVP | Should | `admin` | Keine fremden Bearbeitungen oder Statuswechsel im MVP |
| Zurueckziehen | Antragstellerin kann offenen Antrag zurueckziehen | Medium | Should | `user_applicant` | Nicht fuer MVP-Umsetzung noetig |
| Rueckfragen anzeigen | Kommentare oder Rueckfragen beim Antrag sichtbar machen | Medium | Should | `user_applicant`, `admin` | Sachbearbeitungslogik bleibt vereinfacht im Portal |
| Benachrichtigungen | Statusaenderungen werden im E-Mail-Mock sichtbar | Extended | Could | System, E-Mail-Mock | Kein produktiver Versand |
| Antrag ergaenzen | Antragstellerin kann nach Rueckfrage Angaben ergaenzen | Extended | Could | `user_applicant` | Erst sinnvoll mit `IN_RUECKFRAGE` |

## 9. Daten und Statusmodell

| Objekt | Zweck | Wichtige Felder | Beziehungen / Status | Relevanz fuer Ausbaustufe |
|---|---|---|---|---|
| Weiterbildungsantrag | Zentrales Prozessobjekt des Portals | Titel, Anbieter, Startdatum, optionales Enddatum, Kostenbetrag CHF, Kostenstelle, Begruendung/Nutzen, optionale Bemerkung | gehoert zu einer Antragstellerin; hat Status | MVP |
| Benutzer | Authentifizierte Person mit Rolle | Name, E-Mail, Rolle | erstellt Antraege | MVP |
| Kommentar / Rueckfrage | Sichtbare Nachfrage oder Bemerkung zum Antrag | Text, Autor, Zeitpunkt | gehoert zu einem Antrag | Medium |
| Benachrichtigung | Simulierte Statusinformation | Empfaenger, Betreff, Inhalt, Statusbezug | ausgeloest durch Statuswechsel | Extended |
| Audit-Eintrag | Nachvollziehbarkeit von Statuswechseln | Ereignis, Zeitpunkt, Akteur | gehoert zu Antrag oder Statuswechsel | Extended |

### MVP-Feldmodell fuer Weiterbildungsantrag

| Feld | Pflicht | Grober Typ | Beispiel | MVP-Validierung |
|---|---|---|---|---|
| `titel` | ja | Text | `CAS Prozessdigitalisierung` | 3 bis 120 Zeichen |
| `anbieter` | ja | Text | `ZHAW School of Management and Law` | 2 bis 120 Zeichen |
| `startdatum` | ja | Datum | `2026-09-01` | gueltiges Datum; darf nicht leer sein |
| `enddatum` | nein | Datum | `2026-12-15` | falls gesetzt: nicht vor `startdatum` |
| `kostenChf` | ja | Dezimalzahl | `5900.00` | groesser oder gleich 0; maximal 50000 fuer Demo-Plausibilitaet |
| `kostenstelle` | ja | Text / Freitext | `WB-1000` | 2 bis 50 Zeichen; fiktive Kostenstelle erlaubt |
| `begruendung` | ja | Mehrzeiliger Text | `Die Weiterbildung staerkt Prozessanalyse und Automatisierung.` | 20 bis 2000 Zeichen |
| `bemerkung` | nein | Mehrzeiliger Text | `Unterlagen werden bei Bedarf nachgereicht.` | maximal 2000 Zeichen |

**Entscheidung:** Das MVP verwendet `startdatum` als Pflichtfeld und `enddatum` als optionales Feld. `kostenstelle` ist im MVP ein Freitextfeld; Auswahlwerte oder ERP-gestuetzte Kostenstellen sind hoechstens Extended.

### Statuswerte

| Status | Bedeutung | Ausbaustufe |
|---|---|---|
| `ENTWURF` | Antrag wurde begonnen, aber noch nicht eingereicht | MVP |
| `EINGEREICHT` | Antrag wurde verbindlich eingereicht und wartet auf Pruefung | MVP |
| `IN_RUECKFRAGE` | Sachbearbeitung hat eine Rueckfrage oder braucht Ergaenzungen | Medium / Extended |
| `GENEHMIGT` | Antrag wurde bewilligt | Medium / Extended |
| `ABGELEHNT` | Antrag wurde abgelehnt | Medium / Extended |
| `ZURUECKGEZOGEN` | Antragstellerin hat den Antrag zurueckgezogen | Medium |

**Entscheidung:** Das initiale Datenmodell soll alle dokumentierten Statuswerte enthalten, damit Prisma-Schema und Seed-Daten spaeter anschlussfaehig bleiben. Die UI- und Fachlogik des MVP nutzt aktiv nur `ENTWURF` und `EINGEREICHT`.

### Seed- und Demo-Daten

Seed-Daten duerfen ausschliesslich fiktive Antragstellerinnen, Weiterbildungsanbieter, Kostenstellen und Antragsinhalte verwenden. Beispielhafte Anbieter und Kostenstellen duerfen realistisch klingen, aber keine echten vertraulichen Organisationsdaten abbilden.

## 10. Schnittstellen und Umsysteme

| System / Schnittstelle | Richtung | Art | Zweck | MVP-Verhalten | spaetere Ausbaustufe |
|---|---|---|---|---|---|
| Lokale Prisma/SQLite-Datenbank | intern | SQL ueber Prisma | Speichert Benutzer und Weiterbildungsantraege | genutzt | bleibt Grundlage |
| Next.js Server Actions | intern | TypeScript | Lokale Backend-Logik fuer Formular, Validierung und Speicherung | bevorzugt genutzt | bleibt Grundlage fuer Formularfluesse |
| Next.js Route Handlers | intern / optional | HTTP | Lokale API-Grenze fuer spaetere Clients oder Mocks | nur falls lokal sinnvoll | kann fuer Mocks erweitert werden |
| Backend API aus DSL | aus Sicht DSL ausgehend | REST API | In der Zielarchitektur Fachlogik und Statusdaten | nicht separat umgesetzt | Architekturkontext |
| ERP-API-Mock | ausgehend | REST API | Stammdaten, Kostenstellen, Budgetinformationen | nicht noetig | Extended, optional |
| E-Mail-Mock | ausgehend | E-Mail / Mock-Inbox | Benachrichtigungen fuer Statuswechsel | nicht noetig | Extended |
| Fall-Cockpit | Nachbarsystem | Web UI | Sachbearbeitung und Teamleitung pruefen Faelle | nicht umgesetzt | Out of Scope |

## 11. Architektur und technische Leitplanken

### Brownfield / Starter Kit / CAS-Kontext

Dieses PRD ist ein Brownfield-PRD im CAS-Starter-Kit-Kontext. Das Projekt existiert bereits, und der technische Stack ist durch `AGENTS.md`, `KILO_INSTRUCTIONS.md`, `package.json`, Prisma-Schema und bestehende App-Struktur vorgegeben.

Das PRD entscheidet den Stack nicht neu. Es beschreibt, wie das Self-Service-Portal fuer Weiterbildungsantraege innerhalb des vorhandenen Next.js-16-Starter-Kits umgesetzt werden soll.

Technische Leitplanken:

- Next.js App Router und TypeScript strict
- Server Components als Standard
- Server Actions fuer lokale DB-Operationen aus Formularen
- Prisma 7 mit SQLite und vorhandenem Singleton
- Better Auth mit Rollen `admin`, `user_applicant`, `user_reviewer`
- shadcn/ui und Tailwind fuer UI
- Vitest fuer Validierungs- und Statuslogik
- Playwright nur bei expliziter E2E-Anforderung
- Keine separate Backend API fuer das MVP
- Route Handlers nur verwenden, wenn ein spaeterer API-Konsument oder Mock dies wirklich braucht

### Starter Kit Nutzung

**Genutzte Bausteine:**

| Baustein | Status | Bemerkung |
|---|---|---|
| Auth (Better Auth, Rollen) | genutzt | `user_applicant` und `admin` sind im MVP relevant; `user_reviewer` bleibt technisch vorhanden |
| Prisma DB + SQLite | genutzt | Speichert lokale Antraege und Demo-Daten |
| UI (shadcn/ui, Tailwind) | genutzt | Formular, Listen, Statusanzeigen |
| E-Mail (Resend) | teilweise / spaeter | Fuer MVP nicht noetig; als Extended ueber E-Mail-Mock dokumentiert; vorhandene Bausteine koennen technisch bleiben, aber aus dem MVP-Portalfluss verschwinden |
| LLM-Integration | nicht genutzt | Kein LLM-Use-Case fuer dieses PRD; KI-Demo soll nicht Teil der Portalnavigation sein |
| REST API Route Handlers | teilweise | Fuer MVP nur falls lokal sinnvoll; Hauptlogik soll ueber Server Actions laufen |
| File Upload | nicht genutzt | Nicht Teil des MVP; aus UI/Navigation entfernen oder als technischer Platzhalter behalten, falls spaeter Kursunterlagen relevant werden |

**Starter-Kit-Bereinigung fuer `/adapt-to-project`:**

| Element | Zielzustand nach Adapt | Begruendung |
|---|---|---|
| Generische `/antraege`-Seiten | fachlich zu Weiterbildungsantraegen anpassen | Kern-MVP |
| Generische `Antrag`-Entitaet | zu Weiterbildungsantrag erweitern oder fachlich ersetzen | Zentrales Prozessobjekt |
| Demo-Seiten `/personen` | aus Navigation entfernen und/oder stubben | Nicht zentral fuer das Portal |
| `Person`-Modell | entfernen oder ungenutzt lassen, abhaengig von Adapt-Strategie | Nicht Teil des MVP-Datenmodells |
| `/ai-demo` und LLM-Demo | aus Navigation entfernen und/oder stubben | Kein LLM-Use-Case |
| Upload-/PDF-Demo | aus Portalfluss entfernen; technische Bausteine nur als spaetere Grundlage behalten | File Upload nicht MVP |
| Demo-API-Routen | nur behalten, wenn sie fuer lokale Portal-Logik oder Tests gebraucht werden | Separate Backend API ist nicht MVP |
| Demo-Seed-Daten | auf fiktive Weiterbildungsantraege ausrichten | Demo-Faehigkeit und Datenschutz |
| Demo-Tests | an neue Validierungs- und Statuslogik anpassen | Tests sollen MVP-Fachlogik absichern |

## 12. Security, Datenschutz und Compliance

Das System nutzt im MVP die vorhandene Authentifizierung aus dem Starter Kit. Antragstellerinnen duerfen nur eigene Antraege sehen und bearbeiten. Admins duerfen fuer Demo- und Supportzwecke alle Antraege lesen und eigene Demo-Antraege erstellen/einreichen.

Rollenfilter sind im MVP zwingend fuer Listen, Detailseiten und schreibende Aktionen. Eine Antragstellerin darf keine fremden Antraege lesen, bearbeiten oder einreichen. Admins duerfen im MVP keine fremden Antraege bearbeiten oder deren Status wechseln.

Es werden nur Demo- und Testdaten verwendet. Es duerfen keine echten produktiven Personaldaten, Weiterbildungsentscheide, Kostenstellen oder vertraulichen Budgetinformationen verwendet werden. Seed-Daten muessen fiktive Personen, fiktive Weiterbildungsanbieter und fiktive Kostenstellen verwenden.

Ein Audit Trail wird im MVP nicht gebaut. Einfache Audit-Eintraege bleiben Extended. Produktive Security-, Compliance- und Datenschutzanforderungen sind nicht Teil des Prototyp-Scopes. Trotzdem soll der Prototyp rollenbasierte Sichtbarkeit sauber demonstrieren, weil dies fuer den Prozess fachlich wichtig ist.

## 13. Demo-Szenarien und Erfolgskriterien

| Szenario | Ablauf kurz | Abgedeckte User Stories | Ausbaustufe | Erfolgskriterium |
|---|---|---|---|---|
| Weiterbildung als Entwurf speichern | Antragstellerin meldet sich an, erstellt einen Weiterbildungsantrag und speichert ihn als Entwurf | US-1, US-2, US-3 | MVP | Antrag ist mit Status `ENTWURF` gespeichert |
| Antrag einreichen | Antragstellerin reicht den vollstaendigen Entwurf ein | US-2, US-4 | MVP | Status wechselt zu `EINGEREICHT` |
| Status pruefen | Antragstellerin oeffnet ihre Antragsuebersicht | US-5 | MVP | Eigener Antrag erscheint mit korrektem Status |
| Admin-Demo | Admin oeffnet die Antragsuebersicht | US-6 | MVP | Admin sieht alle Demo-Antraege, ohne fremde Antraege zu bearbeiten |
| Rueckfrage nachvollziehen | Admin hinterlegt eine Rueckfrage, Antragstellerin sieht sie | US-8 | Medium | Rueckfrage wird sichtbar angezeigt |
| Benachrichtigung simulieren | Statuswechsel erzeugt Eintrag im E-Mail-Mock | US-9 | Extended | Mock-Inbox zeigt nachvollziehbare Nachricht |

MVP-Erfolgskriterien:

- [ ] Antragstellerin kann einen Weiterbildungsantrag mit Pflichtfeldern erfassen
- [ ] Fehlende oder ungueltige Pflichtfelder werden abgefangen
- [ ] Antragstellerin kann den Antrag als `ENTWURF` speichern
- [ ] Antragstellerin kann den Entwurf einreichen
- [ ] Status `EINGEREICHT` ist danach sichtbar
- [ ] Antragstellerin sieht nur eigene Antraege
- [ ] Admin kann alle Antraege fuer die Demo lesen
- [ ] Admin kann eigene Demo-Antraege erstellen/einreichen, aber keine fremden Antraege bearbeiten

## 14. Risiken, Annahmen und offene Fragen

| Typ | Beschreibung | Auswirkung | Umgang |
|---|---|---|---|
| Entscheidung | Das Repo bildet das Self-Service-Portal ab, nicht das gesamte Prototyp-Gesamtsystem | Scope bleibt handhabbar | Grundlage fuer `v002` |
| Entscheidung | Die separate Backend API aus der DSL wird im Prototyp nicht umgesetzt | Architektur weicht bewusst von DSL ab | Lokale Next.js-Backend-Logik ersetzt sie im MVP |
| Entscheidung | Weiterbildungsantraege sind das fachliche Beispiel fuer den generischen Antragsprozess | Fachliche Felder und Demo-Daten richten sich danach | Grundlage fuer Datenmodell und Seed |
| Entscheidung | Fuer die Live-Demo werden spaeter voraussichtlich nur MVP-Features umgesetzt | Feature-Planung muss MVP priorisieren | Bei `/plan-feature` zuerst nur MVP-Prioritaeten 1-4 planen |
| Risiko | Bestehende Starter-Kit-Demo-Entitaeten passen nur teilweise zum neuen Fachprozess | Spaetere Umsetzung braucht Bereinigung oder Anpassung | Nach bestaetigtem PRD `/adapt-to-project` verwenden |
| Risiko | DSL nennt Next.js 15, Repo nutzt Next.js 16 | Verwirrung in technischer Dokumentation | Repo-Regeln und `package.json` sind verbindlich |
| Risiko | `AGENTS.md` nennt noch Backend-API-Anbindung | Folge-Agenten koennten falsche Integration planen | `AGENTS.md` spaeter harmonisieren |
| Offene Frage | Soll der Umfang im Kurskontext noch mit dem Dozenten validiert werden? | Relevanz fuer spaetere Feature-Auswahl | Vor Feature-Planung klaeren, falls noetig |

## 15. Feature-Kandidaten fuer plan-feature

Nach PRD-Bestaetigung sollen zuerst nur die MVP-Prioritaeten 1-4 geplant werden, sofern der Mensch nichts anderes bestaetigt.

| Feature-Kandidat | Kurzbeschreibung | Etappe | Abhaengigkeiten | Prioritaet |
|---|---|---|---|---|
| Datenmodell Weiterbildungsantrag | Fachliches Datenmodell, alle Statuswerte im Enum, MVP-Felder und fiktive Seed-Daten | MVP | Prisma, Auth | 1 |
| Antrag erfassen, als Entwurf speichern und einreichen | Formular, Validierung, Speichern als `ENTWURF` und Statuswechsel zu `EINGEREICHT` | MVP | Datenmodell, Zod, Server Actions | 2 |
| Meine Antraege und Statusuebersicht | Liste und Detailansicht eigener Antraege mit Status | MVP | Datenmodell, Auth/Rollen | 3 |
| Admin-Uebersicht fuer Demo | Admin sieht alle Antraege und kann eigene Demo-Antraege erstellen/einreichen | MVP | Rollenmodell | 4 |
| Antrag zurueckziehen | Antragstellerin kann offene Antraege zurueckziehen | Medium | Statusmodell | 5 |
| Rueckfragen und Kommentare | Kommentare/Rueckfragen erfassen und fuer Antragstellerin anzeigen | Medium | Kommentarobjekt, Admin-Demo-Funktion | 6 |
| E-Mail-Mock-Benachrichtigungen | Statuswechsel erzeugen Benachrichtigungen im Mock | Extended | E-Mail-Service, Statuslogik | 7 |
| Antrag nach Rueckfrage ergaenzen | Antragstellerin kann Angaben nachtraeglich ergaenzen | Extended | Rueckfragen, Status `IN_RUECKFRAGE` | 8 |

## 16. Appendix

### Verwendete Quellen

- `AGENTS.md`
- `KILO_INSTRUCTIONS.md`
- `package.json`
- `prisma/schema.prisma`
- `docs/project/architecture/gesamtarchitektur.dsl`
- `docs/project/prd-reviews/self-service-portal-v001-r01-review.md`
- Nutzerbestaetigungen im PRD-Dialog und in der Review-Integration vom 2026-06-03

### Bewusst fehlende Quelle

Eine textuelle Gesamtarchitektur-Datei `gesamtarchitektur.md` liegt nicht vor. Daher wurde die DSL als primaere Architekturquelle genutzt. Fachliche Details, die nicht direkt aus der DSL hervorgehen, sind als Annahmen oder bewusste Demo-Entscheidungen dokumentiert.

### Glossar

| Begriff | Bedeutung |
|---|---|
| Weiterbildungsantrag | Fachliches Prozessobjekt im Portal; Antrag auf Finanzierung oder Bewilligung einer Weiterbildung |
| Fall | Begriff aus der Gesamtarchitektur fuer den bearbeiteten Antrag im Gesamtprozess |
| Entwurf | Gespeicherter Antrag vor verbindlichem Einreichen |
| Einreichen | Fachlicher Schritt, der den Antrag zur spaeteren Pruefung bereitstellt |

### Qualitaetscheck

- [x] Das PRD beschreibt genau ein IT-System: das Self-Service-Portal.
- [x] Rollen und Berechtigungen sind beschrieben.
- [x] MVP, Medium, Extended und Out of Scope sind getrennt.
- [x] Schnittstellen, Mocks und bewusste Vereinfachungen sind dokumentiert.
- [x] User Stories und Demo-Szenarien sind verknuepft.
- [x] Annahmen, Entscheidungen, Risiken und offene Fragen sind markiert.
- [x] Das PRD ist als `v002` gekennzeichnet.
- [x] Die Aenderungshistorie enthaelt Eintraege fuer `v001` und `v002`.
- [x] Die DSL wurde beruecksichtigt; Bildexporte wurden nicht analysiert.
- [x] Brownfield-/Starter-Kit-Kontext und Starter-Kit-Nutzung sind dokumentiert.
