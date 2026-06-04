# Developer Notes: Antrag erfassen, als Entwurf speichern und einreichen

## Überblick

Dieses Feature liefert den UX-Kernfluss des Self-Service-Portals: Antragstellende können einen Weiterbildungsantrag erfassen, als Entwurf speichern oder direkt verbindlich einreichen. Es ergänzt die Foundation (`datenmodell-weiterbildungsantrag`) um zwei atomare Submit-Server-Actions, einen Bestätigungsdialog im Formular und eine serverseitige Re-Validierung beim Einreichen.

## Referenzen

- Plan: `docs/project/features/antrag-erfassen-und-einreichen/plan-v001.md`
- PRD: `docs/project/prds/self-service-portal-v002.md` (US-1 bis US-4)
- Foundation-Feature: `docs/project/features/datenmodell-weiterbildungsantrag/plan-v002.md`
- Relevante Guides: `KILO_INSTRUCTIONS.md`, `AGENTS.md`

## Betroffene Dateien

| Datei | Zweck / Änderung |
|---|---|
| `src/app/(app)/antraege/actions.ts` | `submitAntrag` gehärtet (Re-Validierung, Eigentümer-Schaerfung); `createAntragAndSubmit` und `updateAntragAndSubmit` als neue atomare Actions |
| `src/components/antraege/antrag-form.tsx` | Props von `action` auf `onSaveDraft`/`onSubmitFinal` umgestellt; Bestätigungsdialog für Direkt-Einreichen integriert |
| `src/app/(app)/antraege/neu/page.tsx` | Reicht beide Actions an `AntragForm` durch |
| `src/app/(app)/antraege/[id]/bearbeiten/page.tsx` | Zwei Inline-Server-Action-Wrapper für Draft und Submit |
| `__tests__/unit/schemas/antrag.test.ts` | Neue Tests für Re-Validate: valider DB-Datensatz und zu kurze Begründung |
| `__tests__/unit/antrag-status.test.ts` | Testname auf "Direkter Statuswechsel ENTWURF -> EINGEREICHT" präzisiert |
| `e2e/antraege.spec.ts` | E2E "Antrag erfassen und direkt einreichen" ergänzt; alter Test ans Feldmodell angepasst |
| `docs/project/features/antrag-erfassen-und-einreichen/plan-v001.md` | Alle Tasks auf `done`, Checklisten abgehakt |
| `TASKS.md` | Feature-Status auf `done` aktualisiert |

## Architektur und Datenfluss

Das Feature bleibt im bestehenden Starter-Kit-Muster: React Hook Form im Client (`AntragForm`), Zod-Validierung zentral über `src/lib/schemas/antrag.ts`, schreibende DB-Operationen über Server Actions in `actions.ts`. Kein Prisma-Schema-Wechsel, keine neuen ENV-Werte, keine neuen npm-Pakete.

### Server-Action-Landschaft

| Action | Zweck |
|---|---|
| `createAntrag(fd)` | Entwurf anlegen (Status `ENTWURF`) |
| `createAntragAndSubmit(fd)` | Neuen Antrag anlegen und sofort einreichen (Status `EINGEREICHT`) |
| `updateAntrag(id, fd)` | Entwurf aktualisieren (Status bleibt) |
| `updateAntragAndSubmit(id, fd)` | Entwurf aktualisieren und einreichen (Status `EINGEREICHT`) |
| `submitAntrag(id)` | Bestehenden Entwurf einreichen, mit Re-Validierung |
| `decideAntrag(id, status)` | Admin-/Reviewer-Entscheidung (im MVP-Portalfluss nicht UI-erreichbar) |
| `deleteAntrag(id)` | Antrag löschen |

### Einreichen-Pfad (re-validated)

`submitAntrag(id)` liest den kompletten DB-Datensatz, normalisiert ihn über `normalizeAntragInput(...)` und lässt `antragCreateSchema.safeParse(...)` laufen. Nur bei Erfolg wird der Status auf `EINGEREICHT` gesetzt. Dadurch sind später invalide Entwürfe (manuelle DB-Eingriffe, zukünftige Schema-Verschärfungen) abgesichert.

### Direkt-Einreichen-Pfad (atomar)

`createAntragAndSubmit` und `updateAntragAndSubmit` validieren, persistieren und setzen den Status in einem einzigen Prisma-Aufruf. Es gibt keinen separaten HTTP-Roundtrip für Speichern und Einreichen.

### Formular-Validierung

Der "Speichern und einreichen"-Button führt vor dem Öffnen des Dialogs `form.trigger()` aus. Bei Validierungsfehlern bleibt der Dialog geschlossen und React Hook Form zeigt die Fehler unter den Feldern. Erst nach erfolgreichem `form.trigger()` und Benutzerbestätigung im Dialog wird die Server Action aufgerufen.

## Rollen und Berechtigungen

- `user_applicant`: Erstellen, Speichern, Bearbeiten, Einreichen eigener Anträge.
- `admin`: Erstellen, Speichern, Bearbeiten, Einreichen eigener Anträge. Darf *keine* fremden Anträge einreichen – die Prüfung `antrag.erstellerId !== session.user.id` in `submitAntrag`, `updateAntragAndSubmit` und `bearbeiten/page.tsx` wurde entsprechend geschärft.
- `user_reviewer`: Kein aktiver Zugang zum Erstellen/Einreichen im MVP.

Im Edit-Modus (`bearbeiten/page.tsx`) ist die Bearbeitung nur erlaubt, wenn der Antrag `status === 'ENTWURF'` und der Nutzer der Ersteller ist (oder Admin mit eigenem Antrag). Andernfalls folgt ein `redirect`.

## Datenmodell und Persistenz

Keine Prisma-Schema-Änderung. Genutzt werden die Felder des Weiterbildungsantrags aus dem Foundation-Feature (`titel`, `anbieter`, `startdatum`, `enddatum?`, `kostenChf`, `kostenstelle`, `begruendung`, `bemerkung?`). Status ist `ENTWURF` (Default) oder `EINGEREICHT`. `npm run db:reset` ist für dieses Feature nicht zwingend, da das Schema unverändert ist.

## Validierung und Tests

| Prüfung | Ergebnis / Hinweis |
|---|---|
| `npm run test` | Erfolgreich, 65 Tests gruen (8 Dateien) |
| `npm run build` | Erfolgreich, Turbopack, alle Routen und Typen geprüft |
| Manuelle Prüfung Entwurf speichern | Entwurf wird mit `ENTWURF` auf Detailseite angezeigt |
| Manuelle Prüfung Direkt einreichen | Formular → Dialog → Status `EINGEREICHT` auf Detail- und Listenseite |
| Manuelle Prüfung Admin-Sicht | Admin sieht alle Anträge, keine Bearbeiten-/Einreichen-Buttons bei fremden |
| `npm run test:e2e` | Auf expliziten Auftrag; benötigt laufenden Dev-Server |

## Betriebs- und Setup-Hinweise

- Keine neuen ENV-Variablen oder externen Provider.
- Better-Auth-Warnungen zu `BETTER_AUTH_SECRET` wurden bewusst nicht als Blocker behandelt.
- Für lokale Tests kann `npm run seed` verwendet werden, wenn die Datenbasis voll ist.

## Wartungshinweise

- Die Server Actions sind absichtlich als eigenständige, typsichere Funktionen (je Intent) implementiert – kein Magic-String-intent, kein Flag. Das ist im Demo-Kontext leichter lesbar und testbar.
- Der Bestätigungsdialog ist inline im `AntragForm` implementiert. Bei Bedarf kann er in eine wiederverwendbare Komponente extrahiert werden, was aktuell aber nicht nötig ist.
- `submitAntrag` revalidiert die Daten gegen `antragCreateSchema`. Bei Schema-Verschärfungen oder manuellen DB-Änderungen schlägt die Einreichung defensiv fehl, anstatt invalide Daten durchzulassen.
- Die E2E-Tests in `e2e/antraege.spec.ts` verwenden `loginAsApplicant` / `loginAsAdmin` über das UI-Form, keinen Storage State.

## Bekannte Einschränkungen

- Nur die Status `ENTWURF` und `EINGEREICHT` sind im MVP aktiv über die UI erreichbar.
- Keine E-Mail-Benachrichtigungen, keine Rückfragen/Kommentare, kein Zurückziehen.
- Keine parallele Admin/Reviewer-Entscheidungslogik im MVP-Portalfluss.
