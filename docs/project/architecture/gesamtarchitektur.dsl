workspace "CAS Prototyp Gesamtarchitektur" "Realitätsnäheres C4-Beispiel mit mehreren neu gebauten Containern, zwei Mocks und optionaler Component View." {

    model {
        antragstellerin = person "Antragstellerin" "Reicht im Demo-Prozess einen Antrag ein und erhält Statusinformationen."
        sachbearbeitung = person "Sachbearbeitung" "Prüft eingereichte Anträge, ergänzt fehlende Angaben und bereitet Entscheide vor."
        teamleitung = person "Teamleitung" "Entscheidet über Ausnahmefälle, z.B. bei Budgetüberschreitung oder unklaren Daten."

        prototyp = softwareSystem "Prototyp-Gesamtsystem" "Umfasst die neu gebauten Komponenten, mit denen der digitale Antrags- und Genehmigungsprozess end-to-end demonstriert wird." {
            tags "NeuAusgereift"

            portal = container "Self-Service-Portal" "Ermöglicht Antragstellenden, Anträge zu erfassen und den Status einzusehen." "Next.js 15" {
                tags "NeuAusgereift"
            }

            cockpit = container "Fall-Cockpit" "Ermöglicht Sachbearbeitung und Teamleitung, Fälle zu prüfen, zu kommentieren und zu entscheiden." "Next.js 15" {
                tags "NeuAusgereift"
            }

            backendApi = container "Backend API" "Stellt Fachlogik, Statuswechsel, Validierung und Schnittstellen für Portal, Cockpit und Mocks bereit." "Next.js API Routes / TypeScript" {
                tags "NeuAusgereift"

                antragsApi = component "Antrags-API" "Nimmt neue Anträge aus dem Self-Service-Portal entgegen und liefert Falldetails an die UI." "REST Controller" {
                    tags "InternalComponent"
                }

                fallService = component "Fall-Service" "Verwaltet Fallstatus, Kommentare, Entscheide und fachliche Übergänge im Demo-Prozess." "TypeScript Service" {
                    tags "InternalComponent"
                }

                validierungsService = component "Validierungs-Service" "Prüft Pflichtfelder, Budgetgrenzen und einfache Plausibilitätsregeln." "TypeScript Service" {
                    tags "InternalComponent"
                }

                erpClient = component "ERP-Client" "Kapselt den Zugriff auf den ERP-API-Mock für Stammdaten und Budgetinformationen." "REST Client" {
                    tags "InternalComponent"
                }

                notificationService = component "Notification-Service" "Erzeugt Benachrichtigungen für Eingangsbestätigung, Rückfrage, Freigabe und Ablehnung." "TypeScript Service" {
                    tags "InternalComponent"
                }

                auditService = component "Audit-Service" "Schreibt einfache Audit-Einträge für relevante Statuswechsel und Entscheidungen." "TypeScript Service" {
                    tags "InternalComponent"
                }
            }

            workflowWorker = container "Workflow-/Regel-Worker" "Führt einfache automatische Prozessschritte aus, z.B. Vorprüfung, Eskalation und Benachrichtigung." "Node.js Worker" {
                tags "NeuBasic"
            }

            prototypDb = container "Prototyp-Datenbank" "Speichert Demo-Anträge, Fallstatus, Kommentare, Audit-Einträge und Testdaten." "SQLite" {
                tags "NeuBasic" "Database"
            }
        }

        erpApiMock = softwareSystem "ERP-API-Mock" "Mock des ERP-Systems; liefert Antragsteller-Stammdaten, Kostenstellen und Budgetinformationen über eine REST API mit JSON-Testdaten." {
            tags "Mock"
        }

        emailMock = softwareSystem "E-Mail-Mock" "Mock für automatisch erzeugte E-Mails; zeigt Benachrichtigungen in einer gefakten Inbox statt echte E-Mails zu versenden." {
            tags "Mock"
        }

        // Context-Beziehungen
        antragstellerin -> prototyp "reicht Antrag ein und verfolgt Status" "HTTPS"
        sachbearbeitung -> prototyp "prüft und bearbeitet Fälle" "HTTPS"
        teamleitung -> prototyp "entscheidet Ausnahmefälle" "HTTPS"
        prototyp -> erpApiMock "liest Stammdaten und Budgetinformationen" "REST API"
        prototyp -> emailMock "sendet Status- und Entscheidbenachrichtigungen" "E-Mail"

        // Container-Beziehungen
        antragstellerin -> portal "erfasst Antrag und sieht Status" "HTTPS"
        sachbearbeitung -> cockpit "prüft und kommentiert Fälle" "HTTPS"
        teamleitung -> cockpit "prüft eskalierte Fälle und entscheidet" "HTTPS"

        portal -> backendApi "erstellt Antrag und ruft Status ab" "REST API"
        cockpit -> backendApi "liest Fälle, schreibt Kommentare und Entscheide" "REST API"
        workflowWorker -> backendApi "triggert automatische Statuswechsel und Eskalationen" "REST API"

        backendApi -> prototypDb "speichert und liest Anträge, Status und Audit-Einträge" "SQL"
        workflowWorker -> prototypDb "liest offene Fälle und schreibt Verarbeitungsergebnisse" "SQL"
        backendApi -> erpApiMock "liest Stammdaten, Kostenstellen und Budgetinformationen" "REST API"
        backendApi -> emailMock "sendet Benachrichtigungen" "E-Mail"

        // Optionale Component-Beziehungen innerhalb der Backend API
        portal -> antragsApi "sendet neue Anträge und Statusabfragen" "REST API"
        cockpit -> antragsApi "ruft Falldetails ab und übermittelt Entscheide" "REST API"

        antragsApi -> fallService "übergibt Antrags- und Entscheidbefehle" "Funktionsaufruf"
        fallService -> validierungsService "prüft Pflichtfelder und Plausibilität" "Funktionsaufruf"
        fallService -> erpClient "fragt Stammdaten und Budgetinformationen an" "Funktionsaufruf"
        erpClient -> erpApiMock "liest Stammdaten und Budgetinformationen" "REST API"

        fallService -> prototypDb "speichert Fälle, Status und Kommentare" "SQL"
        fallService -> auditService "protokolliert Statuswechsel und Entscheidungen" "Funktionsaufruf"
        auditService -> prototypDb "schreibt Audit-Einträge" "SQL"

        workflowWorker -> fallService "triggert Vorprüfung und Eskalation" "Funktionsaufruf"
        fallService -> notificationService "beauftragt Benachrichtigung" "Funktionsaufruf"
        notificationService -> emailMock "erstellt E-Mail in Mock-Inbox" "E-Mail"
    }

    views {
        systemContext prototyp "context" "Systemkontext des Prototyps" {
            include *
            autoLayout lr
        }

        container prototyp "containers" "Container des Prototyp-Gesamtsystems" {
            include *
            autoLayout lr
        }

        component backendApi "backend-components" "Optionale Component View der Backend API für PRD- oder Feature-Plan-Ebene" {
            include *
            autoLayout lr
        }

        styles {
            element "Person" {
                shape Person
                background #0B3D91
                color #FFFFFF
            }

            element "NeuAusgereift" {
                background #2E7D32
                color #FFFFFF
            }

            element "NeuBasic" {
                background #1565C0
                color #FFFFFF
            }

            element "Mock" {
                background #64B5F6
                color #000000
                border dashed
            }

            element "Extern" {
                background #9E9E9E
                color #000000
            }

            element "Weggelassen" {
                background #C62828
                color #FFFFFF
                opacity 45
            }

            element "Database" {
                shape Cylinder
            }

            element "InternalComponent" {
                background #E3F2FD
                color #000000
            }

            relationship "Relationship" {
                color #707070
                thickness 2
                routing Orthogonal
            }
        }
    }
}