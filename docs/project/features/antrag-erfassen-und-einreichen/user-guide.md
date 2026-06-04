# User Guide: Antrag erfassen, als Entwurf speichern und einreichen

## Überblick

Eine Antragstellerin kann einen Weiterbildungsantrag mit den MVP-Pflichtfeldern erfassen, als Entwurf speichern oder direkt aus dem Formular heraus verbindlich einreichen. Aus einem bestehenden Entwurf heraus kann sie ihn weiter bearbeiten und einreichen.

## Rollen

| Rolle | Kann dieses Feature nutzen? | Rechte / Einschränkungen |
|---|---|---|
| `user_applicant` | Ja | Eigene Anträge erstellen, als Entwurf speichern, bearbeiten, einreichen (Direkt-Einreichen oder Detail-Einreichen-Button) |
| `admin` | Ja | Darf eigene Demo-Anträge erstellen, als Entwurf speichern, bearbeiten und einreichen. Darf fremde Anträge weder bearbeiten noch einreichen |
| `user_reviewer` | Nicht für diesen MVP-Flow | Rolle ist technisch vorhanden, hat im Portal aber keine aktive Erstellen-/Einreichen-UI |

## Voraussetzungen

- Login im Portal (`npm run dev` läuft)
- Für die Demo eignen sich `applicant@example.com` oder `admin@example.com` mit Passwort `a`
- Vorhandene Demo-Daten aus `npm run db:reset`

## Schritt-für-Schritt

### Entwurf speichern

1. Im Portal anmelden und `Neuer Antrag` auswählen.
2. Alle Pflichtfelder ausfüllen: Titel, Anbieter, Startdatum, Kosten in CHF, Kostenstelle, Begründung.
3. Optional Enddatum und Bemerkung ergänzen.
4. `Entwurf speichern` klicken.
5. Nach dem Speichern zur Detailseite weiterleiten lassen und den Status `Entwurf` prüfen.

### Direkt aus dem Formular einreichen

1. Formular wie oben ausfüllen.
2. `Speichern und einreichen` klicken.
3. Im Bestätigungsdialog `Ja, einreichen` auswählen.
4. Nach dem Einreichen zur Detailseite weiterleiten lassen und den Status `Eingereicht` prüfen.

### Bestehenden Entwurf bearbeiten und einreichen

1. In der Liste `Anträge` einen vorhandenen `Entwurf` auswählen und `Bearbeiten` klicken.
2. Felder bei Bedarf ändern.
3. `Speichern und einreichen` klicken und im Dialog bestätigen.
4. Nach dem Einreichen landest du auf der Detailseite mit Status `Eingereicht`.

### Bestehenden Entwurf über die Detailseite einreichen

1. In der Liste `Anträge` einen vorhandenen `Entwurf` auswählen.
2. Auf der Detailseite den Button `Einreichen` klicken und im Dialog bestätigen.
3. Status wechselt zu `Eingereicht`.

## Typische Fälle

- Normalfall: Ein vollständig ausgefüllter Antrag wird als `ENTWURF` gespeichert oder direkt als `EINGEREICHT` eingereicht.
- Validierungsfehler vor dem Einreichen: Ungültige Felder (z. B. leeres Pflichtfeld, zu kurze Begründung, negative Kosten) verhindern das Öffnen des Bestätigungsdialogs. Die Fehlermeldung erscheint direkt unter dem Feld.
- Berechtigungsgrenze: Antragstellerinnen sehen nur eigene Anträge. Admins sehen alle Anträge, bekommen aber keine Bearbeiten-/Einreichen-Buttons für Anträge, die sie nicht selbst erstellt haben.
- Optionalfelder leer: Leere Felder wie `Enddatum` oder `Bemerkung` blockieren das Speichern oder Einreichen nicht.

## Hinweise für die Demo

- Mit `applicant@example.com` den Hauptablauf zeigen: "Entwurf speichern" und direkt "Speichern und einreichen" demonstrieren, inkl. Bestätigungsdialog.
- Mit `admin@example.com` zeigen, dass der Admin alle Anträge in der Liste sieht, aber bei fremden Anträgen der Bearbeiten-Button fehlt.
- Der bestehende Einreichen-Button auf der Detailseite funktioniert weiterhin und hat jetzt eine serverseitige Re-Validierung.

## Bekannte Einschränkungen

- Nur Status `ENTWURF` und `EINGEREICHT` sind im MVP aktiv nutzbar. `IN_RUECKFRAGE`, `GENEHMIGT`, `ABGELEHNT` und `ZURUECKGEZOGEN` sind im Modell angelegt, aber noch nicht über die UI erreichbar.
- Rückfragen, Kommentare, E-Mail-Benachrichtigungen, Zurückziehen und ERP-/Budget-Integrationen sind nicht Teil dieses Features.
