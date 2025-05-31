# Checkliste: Neuen Endpoint in NestJS erstellen

## 1. Modul anlegen

- [ ] Modul erstellen
  - Befehl: `nest generate module <name>`

## 2. Endpoint/Controller anlegen

- [ ] Controller/Route erstellen
  - Befehl: `nest generate controller <name>`
- [ ] Passende HTTP-Methode wählen (`@Get`, `@Post`, ...)

### 2a. Zugriffsschutz/Öffentlichkeit festlegen

- [ ] Prüfen, ob Endpoint öffentlich zugänglich sein soll
  - Falls ja: mit `@Public()` dekorieren
  - Falls nein: keinen `@Public()`-Decorator setzen (AuthGuard schützt dann automatisch)

## 3. Service/Business-Logik

- [ ] Service anlegen/für Logik nutzen
  - Befehl: `nest generate service <name>`
- [ ] Datenbankzugriff über Repository/TypeORM (CRUD)

## 3a. (Optional) Template Engine für Views nutzen

- [ ] Template Engine (z.B. Pug) installieren
  - Befehl: `npm install pug`
- [ ] In `main.ts` konfigurieren:
  ```typescript
  app.setBaseViewsDir(join(__dirname, "../views"));
  app.setViewEngine("pug");
  ```
- [ ] Controller-Methoden mit `@Render('template-name')` dekorieren
  - Beispiel:
    ```typescript
    @Get('route')
    @Render('template-name')
    handler() {
      return { /* Daten für das Template */ };
    }
    ```
- [ ] Templates im `views`-Verzeichnis anlegen (z.B. `views/register-notification.pug`)
- [ ] Keine Benutzereingaben ungefiltert im Template ausgeben (XSS-Schutz beachten)

## 4. DTO mit Validierung

- [ ] DTO-Klasse für Request-Body anlegen
  - Befehl: `nest generate class <name>.dto`
- [ ] Felder mit `class-validator` dekorieren (`@IsString()`, `@MinLength()`, ...)

## 5. ValidationPipe aktivieren (global oder lokal)

- [ ] In `main.ts` prüfen/ergänzen:
  ```typescript
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );
  ```

## 6. Guards/Security

- [ ] Guard für Authentifizierung/Autorisierung erstellen
  - Befehl: `nest generate guard <name>`
- [ ] Guard im Controller/Endpoint verwenden (`@UseGuards()`)
- [ ] Bei Session-Cookies: CSRF-Schutz aktivieren/bedenken
- [ ] Bei JWT: Token-Validierung und ggf. Rollen prüfen

## 7. Rate-Limiting

- [ ] Rate-Limit für Endpoint prüfen/ausnehmen
  - Standard: global über ThrottlerGuard
  - Ausnahme: `@SkipThrottle()` setzen

## 8. Fehlerbehandlung

- [ ] Fehler abfangen und sinnvolle HTTP-Statuscodes/Fehlermeldungen zurückgeben
- [ ] Keine sensiblen Daten in Fehlermeldungen

## 9. Logging

- [ ] Wichtige Aktionen/Fehler loggen (z.B. mit Winston/Pino)

## 10. CORS/Sicherheit

- [ ] CORS-Konfiguration prüfen/anpassen
- [ ] Helmet für HTTP-Header nutzen
- [ ] HTTPS verwenden
- [ ] **XSS (Cross-Site Scripting) vermeiden**
  - [ ] Keine Benutzereingaben ungefiltert im Response ausgeben
  - [ ] Output-Encoding im Frontend sicherstellen
  - [ ] Content-Security-Policy (CSP) Header setzen (z.B. via Helmet)
- [ ] **CSRF (Cross-Site Request Forgery) vermeiden**
  - [ ] CSRF-Schutz für stateful Auth aktivieren (z.B. mit `csurf`-Middleware)
  - [ ] Bei stateless JWT-Auth: CORS und SameSite-Cookies korrekt konfigurieren
  - [ ] Nur notwendige HTTP-Methoden zulassen (z.B. `GET`, `POST`)

## 11. OpenAPI/Swagger (optional)

- [ ] Endpoint mit Swagger-Dekoratoren dokumentieren
  - Befehl: `npm install --save @nestjs/swagger swagger-ui-express`

## 12. Tests

- [ ] Unit- und/oder E2E-Tests für Endpoint schreiben
  - Befehl: `nest generate spec <name>`

## 13. Dokumentation

- [ ] Endpoint, Request/Response und Besonderheiten dokumentieren

## 14. Serialization/Sensible Felder schützen

- [ ] Sensible Felder (z.B. Passwort) in Entities mit `@Exclude()` aus `class-transformer` markieren
  - Beispiel:
    ```typescript
    import { Exclude } from 'class-transformer';
    // ...
    @Exclude()
    password: string;
    ```
- [ ] `ClassSerializerInterceptor` global aktivieren, z.B. in `main.ts`:
  ```typescript
  import { ClassSerializerInterceptor } from "@nestjs/common";
  import { Reflector } from "@nestjs/core";
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  ```
- [ ] **Beim Rückgeben von Entities an den Client immer serialisieren, z.B.:**
  ```typescript
  import { instanceToPlain } from "class-transformer";
  // ...
  return instanceToPlain(user);
  ```
- [ ] Sicherstellen, dass sensible Felder nicht im Response enthalten sind

---

# Checkliste: Datenbankmigration mit TypeORM

1. **Entität(en) anlegen oder ändern**

   - Neue Entity-Klasse(n) in `src/` anlegen oder bestehende anpassen.

2. **DataSource konfigurieren**

   - Datei `src/data-source.ts` anlegen oder prüfen.
   - Entities und Migrations korrekt eintragen.

3. **Migration generieren**

   - Projekt bauen: `npm run build` (damit dist/data-source.js aktuell ist)
   - Migration generieren:
     ```bash
     npx typeorm migration:generate -d dist/data-source.js src/migrations/<MigrationName>
     ```
   - Beispiel: `npx typeorm migration:generate -d dist/data-source.js src/migrations/CreatePushSubscription`

4. **Migration prüfen**

   - Die neue Datei erscheint unter `src/migrations/`.
   - Prüfe, ob die SQL-Befehle korrekt sind.

5. **Migration anwenden**

   - Migration ausführen:
     ```bash
     npx typeorm migration:run -d dist/data-source.js
     ```

6. **Ergebnis kontrollieren**

   - Prüfe in der Datenbank, ob die Tabelle(n) und Spalten wie gewünscht angelegt wurden.

7. **(Optional) Migration rückgängig machen**
   - Falls nötig:
     ```bash
     npx typeorm migration:revert -d dist/data-source.js
     ```

---

**Hinweise:**

- `synchronize: false` in der DataSource belassen, damit nur Migrationen die DB-Struktur ändern.
- Migrationen versionieren (z.B. mit Git).
- Bei Fehlern: Migrationen und Entity-Definitionen abgleichen.

---

**Tipp:**

- Nutze `nest g <type> <name>` für schnelles Generieren von Boilerplate-Code.
- Prüfe, ob alle Sicherheitsaspekte (z.B. Validierung, Auth, Rate-Limit, Logging) umgesetzt sind, bevor du den Endpoint produktiv stellst.
