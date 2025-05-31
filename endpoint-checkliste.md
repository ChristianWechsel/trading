# Checkliste: Neuen Endpoint in NestJS erstellen

## 1. Endpoint/Controller anlegen

- [ ] Controller/Route erstellen
  - Befehl: `nest generate controller <name>`
- [ ] Passende HTTP-Methode wählen (`@Get`, `@Post`, ...)

## 2. DTO mit Validierung

- [ ] DTO-Klasse für Request-Body anlegen
  - Befehl: `nest generate class <name>.dto`
- [ ] Felder mit `class-validator` dekorieren (`@IsString()`, `@MinLength()`, ...)

## 3. ValidationPipe aktivieren (global oder lokal)

- [ ] In `main.ts` prüfen/ergänzen:
  ```typescript
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );
  ```

## 4. Service/Business-Logik

- [ ] Service anlegen/für Logik nutzen
  - Befehl: `nest generate service <name>`
- [ ] Datenbankzugriff über Repository/TypeORM (CRUD)

## 5. Guards/Security

- [ ] Guard für Authentifizierung/Autorisierung erstellen
  - Befehl: `nest generate guard <name>`
- [ ] Guard im Controller/Endpoint verwenden (`@UseGuards()`)
- [ ] Bei Session-Cookies: CSRF-Schutz aktivieren/bedenken
- [ ] Bei JWT: Token-Validierung und ggf. Rollen prüfen

## 6. Rate-Limiting

- [ ] Rate-Limit für Endpoint prüfen/ausnehmen
  - Standard: global über ThrottlerGuard
  - Ausnahme: `@SkipThrottle()` setzen

## 7. Fehlerbehandlung

- [ ] Fehler abfangen und sinnvolle HTTP-Statuscodes/Fehlermeldungen zurückgeben
- [ ] Keine sensiblen Daten in Fehlermeldungen

## 8. Logging

- [ ] Wichtige Aktionen/Fehler loggen (z.B. mit Winston/Pino)

## 9. CORS/Sicherheit

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

## 10. OpenAPI/Swagger (optional)

- [ ] Endpoint mit Swagger-Dekoratoren dokumentieren
  - Befehl: `npm install --save @nestjs/swagger swagger-ui-express`

## 11. Tests

- [ ] Unit- und/oder E2E-Tests für Endpoint schreiben
  - Befehl: `nest generate spec <name>`

## 12. Dokumentation

- [ ] Endpoint, Request/Response und Besonderheiten dokumentieren

## 13. Serialization/Sensible Felder schützen

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

**Tipp:**

- Nutze `nest g <type> <name>` für schnelles Generieren von Boilerplate-Code.
- Prüfe, ob alle Sicherheitsaspekte (z.B. Validierung, Auth, Rate-Limit, Logging) umgesetzt sind, bevor du den Endpoint produktiv stellst.
