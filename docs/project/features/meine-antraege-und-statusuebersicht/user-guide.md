# User Guide: Meine Antraege und Statusuebersicht

## Überblick

Mit diesem Feature können Antragstellerinnen und Administratoren ihre Weiterbildungsanträge effizient filtern, durchsuchen und verwalten. Es ermöglicht eine schnelle Statusübersicht direkt über das Dashboard und detaillierte Filter- und Suchoptionen auf der Antragsliste, um den aktuellen Stand eines Antrags jederzeit transparent nachzuvollziehen.

## Rollen

| Rolle | Kann dieses Feature nutzen? | Rechte / Einschränkungen |
|---|---|---|
| `user_applicant` | Ja | Sieht, filtert und durchsucht nur die eigenen Weiterbildungsanträge. |
| `admin` | Ja | Sieht, filtert und durchsucht alle im System vorhandenen Weiterbildungsanträge. |
| `user_reviewer` | Ja | Sieht, filtert und durchsucht alle im System vorhandenen Weiterbildungsanträge (Leserechte). |

## Voraussetzungen

- Erfolgreicher Login im Portal.
- Mindestens ein erstellter Weiterbildungsantrag im System (entweder durch den Benutzer oder über die Seed-Daten vorhanden).

## Schritt-für-Schritt

### 1. Dashboard-Statuskarten nutzen
1. Navigieren Sie nach dem Login auf das **Dashboard** (`/`).
2. Sie sehen drei Status-Karten:
   - **Meine/Alle Weiterbildungsantraege** (Gesamtanzahl)
   - **Eingereicht** (Anzahl der Anträge im Status `EINGEREICHT`)
   - **Genehmigt** (Anzahl der Anträge im Status `GENEHMIGT`)
3. Klicken Sie auf eine beliebige Karte. Sie werden direkt auf die Antragsliste (`/antraege`) weitergeleitet, wobei die Liste automatisch nach dem entsprechenden Status gefiltert wird.

### 2. Statusfilter auf der Antragsliste anwenden
1. Navigieren Sie zur Liste **Weiterbildungsantraege** (`/antraege`).
2. Über der Tabelle befinden sich die Status-Buttons: **Alle**, **Entwurf** und **Eingereicht**.
3. Klicken Sie auf einen Button (z. B. **Entwurf**), um nur Anträge in diesem Status anzuzeigen. Der aktive Button wird dunkel hervorgehoben.
4. Es erscheint eine Filter-Leiste (z. B. "Gefiltert nach: Status: Entwurf") mit einem **Zurücksetzen**-Button.

### 3. Suche nach Titel durchführen
1. Geben Sie im Suchfeld oben rechts einen Teil des Antragstitels ein (z. B. "CAS" oder "Sigma").
2. Drücken Sie **Enter** oder klicken Sie auf **Suchen**.
3. Die Liste zeigt nur noch Anträge an, deren Titel den Suchbegriff enthält.
4. Die Suche kann mit dem Statusfilter kombiniert werden (z. B. nur Entwürfe, die "Design" enthalten).

### 4. Filter zurücksetzen
1. Klicken Sie in der aktiven Filter-Leiste auf **Zurücksetzen** oder klicken Sie auf den Status-Button **Alle**, um alle Filter und Suchbegriffe zu entfernen und wieder die vollständige Liste anzuzeigen.

## Typische Fälle

- **Normalfall:** Der Klick auf eine Dashboard-Karte oder einen Status-Button filtert die Tabelle sofort (Client-Side-Navigation via Next.js).
- **Kombinierter Filter:** Suche nach "Six Sigma" im Status "Genehmigt" zeigt nur den entsprechenden Antrag an.
- **Leerer Zustand:** Wenn kein Antrag zu den gewählten Filtern passt, zeigt die Tabelle die Meldung: `"Keine Anträge gefunden."`

## Hinweise für die Demo

Für die Live-Präsentation können folgende Accounts genutzt werden (Passwort jeweils `a`):
- `applicant@example.com` (Antragstellerin) – zeigt nur eigene Anträge, z. B. "CAS Prozessdigitalisierung" (Eingereicht), "Lean Six Sigma" (Genehmigt), "Workshop Service Design" (Entwurf).
- `admin@example.com` (Administrator) – zeigt alle Anträge aller Benutzer im System.
- Klicken Sie auf die Dashboard-Karte **Genehmigt** – verifizieren Sie, dass nur genehmigte Anträge gelistet werden (obwohl es für "Genehmigt" keinen Filter-Button in der Liste gibt, funktioniert die URL-Validierung für alle Status-Enum-Werte).

## Bekannte Einschränkungen

- Es ist keine Paginierung implementiert (nicht erforderlich für MVP-Datenmengen).
- Die Suche reagiert nicht live bei der Eingabe (Debounce), sondern erfordert das Absenden mit "Enter" oder Klick auf "Suchen" (bewusste MVP-Entscheidung).
