-----

```markdown
# 📚 awd-booksApi: Die Buch- und Benutzer-Bibliothek API

## 🚀 Überblick

Die `awd-booksApi` ist eine robuste RESTful-Schnittstelle, die das Management einer Sammlung von Büchern sowie die Benutzerverwaltung inklusive Authentifizierung ermöglicht. Der Fokus liegt auf klaren, standardisierten CRUD-Operationen und der strikten Sicherung aller kritischen Endpunkte mittels JSON Web Tokens (JWT).

Dieses Projekt dient als Basis für unsere Fullstack-Webentwicklung und demonstriert sauberes Digital Product Thinking an der Schnittstelle von Code und Konzept.

### 🌐 API Basis-URL

Alle Endpunkte sind unter der folgenden Basis-URL zugänglich:

`http://localhost:3000/api`

## ⚙️ Kernfunktionalitäten & Struktur

Die API ist in zwei Hauptbereiche unterteilt:

### I. Authentifizierung (Auth)
Der Einstiegspunkt für jeden Benutzer. Die Registrierung ist öffentlich, der Login liefert das benötigte Zugriffstoken.

| Pfad | Methode | Beschreibung | Sicherheit |
| :--- | :--- | :--- | :--- |
| `/users` | `POST` | Registriert einen neuen Benutzer. | **Öffentlich** |
| `/auth` | `POST` | Meldet Benutzer an und gibt den **Bearer Token** zurück. | **Öffentlich** |

### II. Ressourcen-Management

Alle Operationen in diesen Bereichen erfordern einen gültigen `Bearer Token`, der im `Authorization`-Header gesendet werden muss (z.B. `Authorization: Bearer <token>`).

#### 📚 Buch-Management (`/books`)

| Pfad | Methode | Zusammenfassung | Erforderliche Daten (Body) |
| :--- | :--- | :--- | :--- |
| `/books` | `GET` | Ruft alle Bücher ab. | - |
| `/books` | `POST` | Fügt ein neues Buch hinzu. | `title`, `author`, `publishedYear` |
| `/books/{id}` | `GET` | Ruft ein Buch anhand seiner ID ab. | - |
| `/books/{id}` | `PUT` | Aktualisiert ein Buch anhand seiner ID. | `title`, `author`, `publishedYear` |
| `/books/{id}` | `DELETE` | Löscht ein Buch anhand seiner ID. | - |

#### 👤 Benutzer-Management (`/users`)

| Pfad | Methode | Zusammenfassung | Erforderliche Daten (Body) |
| :--- | :--- | :--- | :--- |
| `/users` | `GET` | Ruft alle registrierten Benutzer ab. | - |
| `/users/{id}` | `GET` | Ruft Benutzerdetails anhand der ID ab. | - |
| `/users/{id}` | `PUT` | Aktualisiert einen Benutzer (Details ändern sich je nach Implementierung). | `username`, `email`, `password` |
| `/users/{id}` | `DELETE` | Löscht einen Benutzer. | - |

## 🏗️ Datenmodelle (Schemas)

### Book / BookInput

| Feld | Typ | Anmerkung |
| :--- | :--- | :--- |
| `id` | `string` | Nur bei Antwort (Read). |
| `title` | `string` | **Erforderlich** bei Erstellung/Aktualisierung. |
| `author` | `string` | **Erforderlich** bei Erstellung/Aktualisierung. |
| `publishedYear` | `integer` | **Erforderlich** bei Erstellung/Aktualisierung. |

### User / UserInput

| Feld | Typ | Anmerkung |
| :--- | :--- | :--- |
| `id` | `string` | Nur bei Antwort (Read). |
| `username` | `string` | **Erforderlich** (für Input). |
| `email` | `string` | **Erforderlich** (für Input). |
| `password` | `string` | **Erforderlich** (für Input, gesalzen/gehasht speichern). |

## 🛡️ Authentifizierung

Für alle geschützten Endpunkte muss der HTTP-Header wie folgt konfiguriert werden:

```

Authorization: Bearer \<JWT\_TOKEN\>

```

Der Token wird durch den erfolgreichen Aufruf von `POST /auth` bereitgestellt.

## ⚠️ Wichtige Antwortcodes

| Code | Bedeutung | Beispielhafte Endpunkte |
| :--- | :--- | :--- |
| `200 OK` | Erfolgreiche Abfrage oder Aktualisierung. | `GET`, `PUT` |
| `201 Created` | Erfolgreiche Erstellung. | `POST /books`, `POST /users` |
| `204 No Content` | Erfolgreiche Löschung. | `DELETE` |
| `401 Unauthorized` | **Fehlgeschlagene Authentifizierung** (ungültiger Token oder Login-Daten). | `POST /auth`, alle geschützten Endpunkte |
| `404 Not Found` | Die angeforderte ID existiert nicht. | `GET /{id}`, `PUT /{id}`, `DELETE /{id}` |
```

---

--
