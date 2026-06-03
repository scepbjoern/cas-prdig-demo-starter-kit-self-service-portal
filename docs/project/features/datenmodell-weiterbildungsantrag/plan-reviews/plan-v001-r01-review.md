# Feature Plan Review: Datenmodell Weiterbildungsantrag v001 Runde 01

## Metadaten

| Feld | Wert |
|---|---|
| Feature-Plan | `docs/project/features/datenmodell-weiterbildungsantrag/plan-v001.md` |
| Logische Plan-Version | `v001` |
| Review-Runde | `r01` |
| Reviewer-Kontext | Frische Session nach `/prime` bestaetigt: ja |
| Vorherige Review-/Integration-Datei | Nicht relevant |
| Referenziertes PRD | `docs/project/prds/self-service-portal-v002.md` |

## Kurzfazit

Der Plan ist fachlich stark und trifft die Grundrichtung des PRD gut: Das bestehende Modell `Antrag` evolutionaer zum Weiterbildungsantrag anzuheben ist fuer dieses Starter-Kit sinnvoller als eine parallele Entitaet. Auch die Entscheidung, minimale Formular-, Anzeige- und API-Anpassungen im Foundation-Feature mitzuziehen, ist richtig, weil neue Pflichtfelder sonst direkt einen kaputten Zwischenzustand erzeugen wuerden.

Vor `/execute` sollte der Plan aber an einigen Stellen konkreter werden. Das groesste Risiko ist nicht das Prisma-Modell selbst, sondern die Reihenfolge und Vollstaendigkeit der gekoppelten Anpassungen: generierte Prisma-Typen, Seed-Reset, Services, Tests, API-Typen, Detailseite und bestehende Reviewer-/Entscheidungslogik haengen enger zusammen, als die aktuellen Tasks sichtbar machen.

Der Plan ist nah an umsetzungsreif, aber ein frischer Execute-Agent muesste an mehreren Stellen noch selbst entscheiden, wie streng MVP-Scope gegen bestehende Demo-Logik abgegrenzt wird. Diese Entscheidungen sollten in `plan-v002` explizit gemacht werden.

## Staerken

- Der Plan passt zur PRD-Entscheidung, das Self-Service-Portal lokal mit Next.js-Backend-Logik, Prisma und Server Actions umzusetzen.
- Das Beibehalten des Prisma-Modellnamens `Antrag` reduziert Umbauaufwand und passt zur bestehenden Route- und Komponentenstruktur.
- Die PRD-Felder und Statuswerte sind vollstaendig erkannt und als Datenmodell-Grundlage eingeplant.
- Der Plan erkennt, dass Schema-Aenderungen UI, Actions, API, Seed und Tests gemeinsam betreffen.
- Die vorhandenen Zod- und Status-Tests werden als zu erweiternde Muster referenziert.
- Scope-Grenzen zu E-Mail, LLM, Upload, Fall-Cockpit und Medium-/Extended-Funktionen sind grundsaetzlich sauber dokumentiert.

## Kritische Findings

Findings, die vor `/execute` geklaert oder im Plan verbessert werden sollten.

| Bereich | Finding | Warum relevant | Konkreter Verbesserungsvorschlag |
|---|---|---|---|
| Prisma-Workflow | `npx prisma generate` und `npm run db:reset` sind nur als Vormerkung bzw. Nutzeraufgabe formuliert. | Nach Schema-Aenderungen koennen Zod-/Status-Code, Seed und Tests wegen veralteter generierter Typen brechen. `KILO_INSTRUCTIONS.md` verlangt zuerst `npx prisma generate`, danach Reset; ohne Generate schlaegt der Seed mit neuen Feldern fehl. | In Task 1 oder als eigener Task explizit aufnehmen: nach Schema-Aenderung `npx prisma generate` ausfuehren, danach erst Seed/Reset validieren. `npm run db:reset` sollte als Agent-Validierung oder bewusst begruendete Nutzeraktion eindeutig festgelegt werden. |
| Betroffene Dateien | `src/lib/services/antragEmailService.ts` und `__tests__/unit/services/antragEmailService.test.ts` fehlen. | Der Service liest und schreibt `antrag.notizen`. Wenn `notizen` entfernt wird, brechen Build oder Tests. Wenn `notizen` bleibt, ist das eine PRD-/Scope-Entscheidung fuer Kommunikationslogik. | In betroffene Dateien und Tasks aufnehmen. Vor `/execute` entscheiden: Service fuer MVP stubben/entkoppeln, `notizen` bewusst behalten, oder Service/Test entfernen bzw. deaktivieren. |
| Betroffene Dateien | `src/app/(app)/antraege/[id]/bearbeiten/page.tsx` und `src/app/(app)/antraege/[id]/antrag-actions.tsx` fehlen in Task 5 bzw. sind nicht vollstaendig abgedeckt. | Die Bearbeiten-Seite setzt `beschreibung` als Default; `antrag-actions.tsx` nutzt `DecideButton` fuer Reviewer/Admin-Entscheide. Beide koennen nach Feld- und Scope-Aenderungen veraltet oder PRD-widrig bleiben. | Beide Dateien in Pflichtlektuere, betroffene Dateien und Tasks aufnehmen. Bearbeiten-Seite auf neue Felder anheben; Entscheidungsbuttons fuer MVP entweder entfernen, ausblenden oder als bekannte spaetere Demo-Altlast dokumentieren. |
| MVP-Berechtigungen | Der Plan markiert Admin-/Reviewer-Abweichungen nur als Folge-Gotcha, laesst aber offen, was im Foundation-Feature mit existierender Entscheidungslogik passiert. | PRD v002 sagt: Admin darf fremde Antraege nicht bearbeiten/einreichen und keine Statuswechsel im MVP; Reviewer ist im Portal nicht zentral. Der aktuelle Code erlaubt Admin/Reviewer-Entscheide bei `EINGEREICHT`. | In `plan-v002` konkret festlegen, ob diese Logik im Datenmodell-Feature entfernt, voruebergehend belassen und sichtbar dokumentiert, oder in einem separaten Auth-Feature korrigiert wird. Mindestens Build-/UI-Konsistenz und PRD-Abweichung muessen als Acceptance Criteria auftauchen. |
| Task-Reihenfolge | Task 2 Seed kommt vor Task 3 Zod/Status und ohne explizite Generate-/Reset-Sequenz. | Seed-Code importiert den generierten Prisma Client. Neue Pflichtfelder im Seed sind erst nach Generate typisiert; Tests koennen ebenfalls generierte Enum-Typen brauchen. | Reihenfolge schaerfen: Schema aendern, `npx prisma generate`, zentrale Status/Zod-Typen anpassen, dann Seed, dann Actions/UI/API, dann Tests/Build/Reset. Alternativ den Generate-Schritt nach Task 1 als harte Zwischenvalidierung einbauen. |
| Validierung | Mehrere Tasks nennen `npm run test`, obwohl nach Task 1/2 erwartbar noch unvollstaendige Folgepfade brechen. | Taskweise Validierung soll verwertbar sein. Wenn Tests in Zwischenzustaenden erwartbar rot sind, entsteht Scheinsicherheit oder Frust in `/execute`. | Pro Task klar unterscheiden: Syntax-/Generate-Check, erwartbar rote Tests, oder erst nach Integration gruen. Fuer Schema-Task z.B. `npx prisma generate`; fuer Seed-Task `npm run db:reset`; fuer Gesamtabschluss `npm run test` und `npm run build`. |
| Schema-Details | Prisma-Typen fuer `startdatum`, `enddatum` und `kostenChf` sind nicht konkret festgelegt. | SQLite/Prisma-Entscheide wie `DateTime` vs. `String` fuer Datumsfelder und `Decimal` vs. `Float`/`Int` fuer CHF beeinflussen Zod-Parsing, FormData, Seed und UI-Formatierung. | In Datenmodell-Abschnitt konkrete Feldtypen festlegen, z.B. `startdatum DateTime`, `enddatum DateTime?`, `kostenChf Decimal` oder begruendet `Float`. Dazu Parsing-/Serialisierungsregeln fuer FormData und API nennen. |

## Architektur und Codebase-Fit

Der Plan passt insgesamt gut zur bestehenden Architektur. Er bleibt bei `src/app/(app)/antraege`, Server Actions, Route Handlers, Zod und Prisma-Singleton. Das ist der richtige Pfad fuer das Starter-Kit und vermeidet eine neue Architektur neben dem vorhandenen Flow.

Die Server-/Client-Grenze ist ebenfalls plausibel: Formular als Client Component mit React Hook Form und Zod Resolver, DB-Schreiben ueber Server Actions, API als zusaetzliche lokale HTTP-Grenze. Kein Bedarf fuer neue Packages, LLM, Upload oder E-Mail im MVP.

Unvollstaendig ist der Codebase-Fit bei vorhandenen Altpfaden. `antragEmailService` nutzt `notizen`; `pdf-viewer` und `ai.ts` enthalten weiterhin upload-/datei-bezogene Hilfslogik; Detail- und Bearbeiten-Seiten referenzieren alte Felder. Der Plan muss nicht alle Demos entfernen, aber er muss fuer jedes entfernte Prisma-Feld alle aktiven TypeScript-Referenzen erfassen. Sonst ist die Implementation nicht sicher top-to-bottom ausfuehrbar.

## Scope und PRD-Abgleich

Der Plan trifft den PRD-Scope fuer das Datenmodell sehr gut: alle MVP-Felder, alle dokumentierten Statuswerte, fiktive Seed-Daten und keine separate Backend API. Auch die Entscheidung, Medium-/Extended-Statuswerte im Enum zu fuehren, aber UI-Logik vorerst auf MVP zu begrenzen, entspricht PRD v002.

Der Scope wird dort unscharf, wo bestehende Demo-Funktionen bereits mehr tun als das MVP: Reviewer-/Admin-Entscheide, `notizen` als Kommunikationsverlauf und E-Mail-Service. Der Plan sollte klarer sagen, ob diese Altlogik im Foundation-Feature technisch bereinigt wird oder als bekannte PRD-Abweichung temporaer bestehen bleibt. Nur "spaeter bereinigen" reicht bei Code, der direkt von zu entfernenden Feldern abhaengt, nicht aus.

Nicht im Scope bleiben zu Recht: finales UX-Design, vollstaendige Einreichungslogik, E2E-Ausbau, Rueckfragen, Audit, E-Mail-Mock und vollstaendiges Entfernen von `/personen` oder `/ai-demo`.

## Versionierung und Plan-Aenderungshistorie

Plan-Version, Status, Quelle und Aenderungshistorie sind vorhanden und konsistent. Die Datei ist korrekt als `plan-v001.md` abgelegt, `TASKS.md` zeigt auf diesen Plan und der Feature-Status steht auf `planned`.

Fuer die Integration sollte `plan-v002.md` die Review-Findings sichtbar in der Plan-Aenderungshistorie und in `Plan Review Notes` aufnehmen. Es gibt keine vorherige Review- oder Integration-Datei.

## Implementation Plan und Task-Qualitaet

Die Phasen sind sinnvoll, aber die Tasks sind teilweise groesser als "atomic". Task 4 kombiniert Actions, Formular und Neu-Seite; Task 5 kombiniert Listen, Detail und zwei API-Routen. Das ist fuer ein mittleres Foundation-Feature noch handhabbar, aber die Acceptance Criteria sollten dann praeziser sein, damit `/execute` nach jedem Schritt weiss, welcher Zustand erwartet wird.

Die Reihenfolge braucht Nachschaerfung wegen Prisma Generate und wegen generierter Enum-Imports. Ein saubererer Ablauf waere: Schema festlegen, Prisma Client generieren, Status-/Zod-Helfer anpassen, Seed anpassen und resetten, dann Actions/Form/Bearbeiten, dann Listen/Detail/API, dann Tests/Build. Aktuell kommt Seed vor zentralen Schema-/Status-Helfern und ohne harte Generate-Validierung.

Die Task-Bloecke enthalten IMPLEMENT/PATTERN/IMPORTS/GOTCHA/ACCEPTANCE/VALIDATE und sind damit formal gut. Inhaltlich fehlen an kritischen Stellen konkrete Typentscheidungen, konkrete Formular-Feldnamen und konkrete Entscheidung zu alten Demo-Funktionen.

## Betroffene Dateien und Pflichtlektuere

Die wichtigsten Dateien sind enthalten: Prisma-Schema, Seed, Zod-Schema, Status-Helper, Actions, Formular, Liste, Detail, API und Tests. Das ist eine gute Basis.

Ergaenzt werden sollten:

- `src/app/(app)/antraege/[id]/bearbeiten/page.tsx` wegen Default-Werten und Edit-Flow.
- `src/app/(app)/antraege/[id]/antrag-actions.tsx` wegen Einreichen, Entscheiden und Loeschen im UI.
- `src/lib/services/antragEmailService.ts` wegen direktem Zugriff auf `notizen`.
- `__tests__/unit/services/antragEmailService.test.ts` wegen bestehendem Test fuer Notizformatierung.
- Optional `src/app/(app)/page.tsx`, weil Dashboard-Zaehler Statuswerte wie `GENEHMIGT` anzeigen und die MVP-Sprache ggf. angepasst werden sollte.

Bei externen Dokumentationslinks ist der Plan ausreichend allgemein. Fuer `/execute` waere lokale Next.js-16-Doku nur noetig, wenn neue App-Router-APIs genutzt werden; der Plan baut aber auf vorhandenen Patterns auf.

## Datenmodell, Rollen und Berechtigungen

Das geplante Statusmodell entspricht dem PRD. Auch die Relation `User` -> `Antrag` bleibt korrekt. Kritisch ist die fehlende konkrete Prisma-Typisierung der neuen Felder. Fuer einen frischen Execute-Agenten sollte nicht offen bleiben, ob `kostenChf` als `Decimal`, `Float` oder integer-basierte Rappen gespeichert wird. Gleiches gilt fuer Datumstypen und FormData-Parsing.

Bei Rollen und Berechtigungen ist der Plan bewusst zurueckhaltend, aber der existierende Code hat bereits PRD-relevantes Verhalten: Admin kann Entwuerfe fremder Antraege bearbeiten/einreichen, und Reviewer/Admin koennen entscheiden. Das PRD verbietet fuer den MVP fremde Admin-Bearbeitung und Statuswechsel. Wenn das Foundation-Feature diese Regeln nicht behebt, muss es die betroffenen Stellen sauber als bekannte Abweichung dokumentieren und darf keine Tests schreiben, die das falsche Verhalten zementieren.

Der Mehrpersonen-Fall ist nicht relevant: `TASKS.md` enthaelt keine Verantwortlichen, Branches oder parallele Schema-Hinweise. Da das aktive Feature aber `prisma/schema.prisma` betrifft, waere ein kurzer Koordinationshinweis in `plan-v002` trotzdem nuetzlich, falls spaeter weitere Personen parallel arbeiten.

## Testing und Validierung

Die Unit-Test-Strategie ist passend: Zod-Schemas, Statuslabels und Transitions sind genau die richtige schnelle Absicherung. Der Plan sollte zusaetzlich eine Entscheidung fuer Tests rund um API-Body-Parsing treffen, weil `kostenChf` und Datumswerte ueber JSON und FormData verschieden ankommen koennen.

`npm run build` ist fuer dieses Feature Pflicht am Ende, weil Prisma-Felder entfernt werden und TypeScript-Referenzen quer durch UI, Services und Tests brechen koennen. Der Plan nennt Build in Task 5 und Gesamtvalidierung, das ist gut.

E2E nicht vorziehen ist vertretbar. Die manuelle Validierung ist konkret genug, sollte aber um Admin-/Applicant-Sichtbarkeit und um `npm run db:reset` nach `npx prisma generate` ergaenzt werden. Wichtig: Die Plan-Completion-Checklist sollte nicht sagen, der Nutzer fuehre Generate/Reset aus, wenn der Execute-Agent laut Projektregeln eigentlich Validierung selbst ausfuehren soll. Besser ist: Agent fuehrt aus, oder begruendet explizit, warum manuelle Nutzeraktion noetig ist.

## Risiken, Gotchas und Edge Cases

Die wichtigsten fachlichen Edge Cases sind genannt: optionales `enddatum`, Kostenbereich, entfernte Feldreferenzen und Enum-Abdeckung. Ergaenzt werden sollten:

- FormData liefert Strings: `kostenChf`, `startdatum` und `enddatum` muessen vor Prisma sauber geparst werden.
- Leerer optionaler Text wie `bemerkung` sollte konsistent als `null` oder `undefined` behandelt werden.
- API-POST/PUT muss dieselben Regeln wie Server Actions anwenden, sonst entstehen zwei Validierungswahrheiten.
- Seed muss mindestens Admin- und Applicant-Szenarien abdecken, wenn Admin-Leserechte spaeter demonstriert werden sollen.
- Alte Tests fuer E-Mail/Notizen duerfen nicht unbemerkt die entfernte Datenstruktur konservieren.
- Generierte Prisma-Dateien in `src/generated/prisma/` duerfen nicht manuell editiert werden.

## Uebergabereife fuer Execute

Der Plan ist als `v001` eine starke Grundlage, aber noch nicht ganz uebergabereif fuer `/execute`. Ein erfahrener Agent koennte die Luecken vermutlich selbst schliessen, aber der PIV-Anspruch ist hoeher: Ein frischer Execute-Agent soll keine neuen Architekturentscheidungen treffen muessen.

Mit den Review-Anpassungen in `plan-v002` waere der Plan gut ausfuehrbar. Besonders wichtig sind konkrete Feldtypen, Generate-/Reset-Sequenz, Aufnahme der fehlenden betroffenen Dateien und eine klare Entscheidung zum Umgang mit `notizen`/E-Mail-Service sowie Reviewer-/Admin-Entscheidungslogik.

## Verbesserungsvorschlaege nach Prioritaet

### Muss vor `/execute` geklaert werden

- Prisma-Feldtypen fuer `anbieter`, `startdatum`, `enddatum`, `kostenChf`, `kostenstelle`, `begruendung`, `bemerkung` konkret festlegen.
- Generate-/Reset-Reihenfolge als verbindliche Task-Validierung aufnehmen: `npx prisma generate`, danach `npm run db:reset` an passender Stelle.
- `src/lib/services/antragEmailService.ts` und den zugehoerigen Unit-Test in den Plan aufnehmen oder bewusst begruenden, warum `notizen` erhalten bleibt.
- Bearbeiten-Seite und Detail-Actions in betroffene Dateien und Tasks aufnehmen.
- Entscheiden, wie mit bestehender Reviewer-/Admin-Entscheidungslogik im MVP umgegangen wird.

### Sollte verbessert werden

- Task-Reihenfolge so umstellen, dass generierte Prisma-Typen vor Seed-, Zod- und UI-Anpassungen verfuegbar sind.
- Validierung pro Task praezisieren, damit Zwischenzustaende nicht faelschlich als testbar-gruen beschrieben werden.
- API- und Server-Action-Parsing fuer Datum/Kosten ausdruecklich angleichen.
- Dashboard und Navigation kurz als Smoke-Check aufnehmen, weil Statuszaehler und Portal-Sprache sichtbar sind.
- Tests um negative Faelle fuer zu langen Titel, Anbieter/Kostenstelle-Laengen, Kostenmaximum und leere Pflichtfelder erweitern.

### Optional

- Einen kleinen Mapper/Helper fuer FormData-zu-Zod-Rohdaten einplanen, falls Actions und API sonst Parsing-Logik duplizieren.
- In Documentation Notes festhalten, dass das Prisma-Modell weiterhin `Antrag` heisst, fachlich aber Weiterbildungsantraege abbildet.
- Einen kurzen Hinweis fuer Mehrpersonen-Koordination bei Prisma-Schema-Aenderungen in den Plan aufnehmen.

## Offene Fragen fuer die Integration

- Soll `notizen` im Foundation-Feature entfernt werden, obwohl `antragEmailService` es heute nutzt, oder wird der Service fuer spaetere Ausbaustufen bewusst behalten?
- Soll die bestehende Reviewer-/Admin-Entscheidungslogik bereits in diesem Feature aus der Portal-UI verschwinden, damit das MVP strikt dem PRD entspricht?
- Welcher Persistenztyp soll fuer `kostenChf` verwendet werden: `Decimal`, `Float` oder ein integer-basierter Betrag in Rappen?
- Soll `beschreibung` vollstaendig durch `begruendung`/`bemerkung` ersetzt werden, oder braucht es fuer Rueckwaertskompatibilitaet einen temporaeren Uebergang?
- Fuehrt der Execute-Agent `npm run db:reset` selbst aus, oder soll die Plan-Datei diesen Schritt bewusst als manuelle Nutzeraktion markieren?

## Naechster Schritt

Gehe zurueck in die Autor-Session, in der der Feature-Plan erstellt wurde. Fuehre dort aus:

```text
/integrate-feature-plan-review docs/project/features/datenmodell-weiterbildungsantrag/plan-v001.md docs/project/features/datenmodell-weiterbildungsantrag/plan-reviews/plan-v001-r01-review.md
```

## Qualitaetscheck vor Abschluss

- [x] Das Review aendert den Feature-Plan nicht.
- [x] Kritische Findings sind konkret und handlungsorientiert.
- [x] Architektur, Task-Reihenfolge, betroffene Dateien, Tests und Validierung wurden geprueft.
- [x] PRD-Abgleich und Scope-Grenzen wurden betrachtet.
- [x] Plan-Version und Plan-Aenderungshistorie wurden geprueft.
- [x] Verbesserungsvorschlaege sind so formuliert, dass `/integrate-feature-plan-review` sie einzeln bewerten kann.
- [x] Der naechste Schritt verweist zurueck in die Autor-Session mit `/integrate-feature-plan-review`.
