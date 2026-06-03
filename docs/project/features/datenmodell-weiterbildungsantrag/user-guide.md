# User Guide: Datenmodell Weiterbildungsantrag

## Überblick

Dieses Feature stellt das Self-Service-Portal fachlich auf Weiterbildungsantraege um. Antragstellerinnen und Admins arbeiten jetzt mit einem Weiterbildungsformular statt mit der generischen Starter-Kit-Demo-Struktur.

## Rollen

| Rolle | Kann dieses Feature nutzen? | Rechte / Einschränkungen |
|---|---|---|
| `user_applicant` | Ja | Kann eigene Weiterbildungsantraege als `ENTWURF` erfassen, speichern, bearbeiten und spaeter einreichen |
| `admin` | Ja | Kann alle Antraege lesen und eigene Demo-Antraege erfassen; keine fremden Bearbeitungs- oder Entscheidungsaktionen im MVP |
| `user_reviewer` | Nicht fuer diesen MVP-Flow | Rolle ist technisch vorhanden, hat im Portal aber keine aktive Entscheidungs-UI |

## Voraussetzungen

- Login im Portal
- Vorhandene Demo-Daten aus `npm run db:reset`
- Fuer die Demo eignet sich besonders `applicant@example.com` oder `admin@example.com`

## Schritt-für-Schritt

1. Im Portal anmelden und zu `Antraege` wechseln.
2. `Neuer Antrag` auswaehlen.
3. Titel, Anbieter, Startdatum, Kosten in CHF, Kostenstelle und Begruendung ausfuellen.
4. Optional Enddatum und Bemerkung ergaenzen.
5. `Entwurf speichern` auswaehlen.
6. Nach dem Speichern zur Detailansicht wechseln und die erfassten Angaben pruefen.

## Typische Fälle

- Normalfall: Ein vollstaendig ausgefuellter Antrag wird als `ENTWURF` gespeichert und kann anschliessend angezeigt oder bearbeitet werden.
- Optionalfelder leer: Leere Felder wie `Enddatum` oder `Bemerkung` blockieren das Speichern nicht.
- Validierungsfehler: Fehlende Pflichtfelder oder ungueltige Eingaben, zum Beispiel ein negatives `kostenChf`, werden direkt am Formular abgefangen.
- Berechtigungsgrenze: Antragstellerinnen sehen nur eigene Antraege. Admins sehen alle Antraege, bekommen im MVP aber keine fremden Entscheidungsaktionen.

## Hinweise für die Demo

- Mit `applicant@example.com` laesst sich der Hauptablauf am besten zeigen: Anlegen, Speichern als Entwurf, Detailansicht, Bearbeiten.
- Mit `admin@example.com` kann zusaetzlich gezeigt werden, dass alle Demo-Antraege sichtbar sind.
- Die Seed-Daten enthalten bereits fiktive Weiterbildungsantraege mit den Statuswerten `ENTWURF`, `EINGEREICHT` und `GENEHMIGT`.

## Bekannte Einschränkungen

- Das Feature bildet die fachliche Grundlage und den Entwurfs-Flow ab, aber noch nicht den vollstaendigen MVP-Endzustand aller Folgefeatures.
- Rueckfragen, Kommentare, E-Mail-Benachrichtigungen, Zurueckziehen und ERP-/Budget-Integrationen sind nicht Teil dieses umgesetzten Stands.
- Die Rolle `user_reviewer` bleibt technisch vorhanden, wird im Portal-MVP aber noch nicht aktiv genutzt.
