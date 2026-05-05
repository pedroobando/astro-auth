# AGENTS.md — astro-auth (Astro Course)

> ⚠️ **INSTRUCCIÓN PARA EL AGENTE**: ANTES de leer cualquier otro archivo, leé esto completo. Contiene el estado actual, decisiones tomadas y pendientes.
>
> **PROTOCOLO DE MEMORIA OBLIGATORIO**: Antes de actuar, consultá `engram` (`mem_context` / `mem_search`) para verificar si ya tratamos el tema en sesiones previas. Después de cambios significativos, guardá en `engram` (`mem_save`).

---

## 📚 Contexto

Proyecto de autenticación completa en Astro. Migrado de Basic Auth a **better-auth** con Drizzle ORM, Turso (libSQL) y Resend para emails de verificación.

**Stack**: Astro (latest), TypeScript (stricto), Bun/Node, better-auth, Drizzle ORM, Turso, Resend, TailwindCSS.

---

## 🗂 Estructura Actual

```text
src/
├── actions/
│   ├── auth/
│   │   ├── index.ts              # Exporta acciones de auth
│   │   └── register-user.action.ts # Acción de registro con better-auth
│   └── index.ts                  # Exporta server actions
├── db/
│   ├── schema/
│   │   ├── index.ts              # Re-exporta tablas
│   │   ├── schema.ts             # Tablas del proyecto (posts)
│   │   └── user.schema.ts        # Tablas de better-auth (user, session, account, verification)
│   ├── index.ts                  # Conexión Drizzle + Turso
│   └── seed.ts                   # Seed de datos de prueba
├── lib/
│   ├── auth.ts                   # Configuración de better-auth
│   └── auth-client.ts            # Cliente de better-auth para el browser
├── middleware/
│   └── index.ts                  # Middleware de sesión con better-auth
├── pages/
│   ├── api/auth/
│   │   └── [...all].ts           # Endpoint catch-all de better-auth
│   ├── index.astro               # Página pública
│   ├── login.astro               # Login funcional con better-auth
│   ├── protected.astro           # Ruta protegida (requiere sesión)
│   └── registry.astro            # Registro funcional con better-auth
├── utils/
│   └── send-mail-user.ts         # Utilidad para enviar emails con Resend
├── env.d.ts                      # Tipa App.Locals y env vars
└── ...
```

| Archivo                     | Estado          | Nota                                                |
| --------------------------- | --------------- | --------------------------------------------------- |
| `src/middleware/index.ts`   | ✅ Implementado | Sesión con better-auth, inyecta `user` en `locals`  |
| `src/pages/index.astro`     | ✅ Existe       | Pública                                             |
| `src/pages/login.astro`     | ✅ Funcional    | Usa `authClient.signIn.email()`                     |
| `src/pages/registry.astro`  | ✅ Funcional    | Usa `actions.registerUser` → better-auth            |
| `src/pages/protected.astro` | ✅ Existe       | Requiere sesión activa (redirige a `/login`)        |
| `src/pages/api/auth/[...all].ts` | ✅ Existe  | Handler catch-all de better-auth                    |
| `src/lib/auth.ts`           | ✅ Configurado  | Drizzle adapter, email verification con Resend      |
| `src/lib/auth-client.ts`    | ✅ Configurado  | Con `baseURL` desde env                             |
| `src/actions/auth/register-user.action.ts` | ✅ Funcional | Crea usuario real en DB                      |
| `src/db/schema/`            | ✅ Definido     | Tablas de better-auth + tabla `posts`               |
| `src/db/seed.ts`            | ✅ Funcional    | Seed de tabla `posts`                               |
| `src/utils/send-mail-user.ts` | ✅ Configurado | Envía emails de verificación con Resend            |
| `src/env.d.ts`              | ✅ Actualizado  | Tipa `App.Locals` con `User`/`Session` de better-auth |
| `.env`                      | ✅ Existe       | Variables para better-auth, Turso y Resend. NO commitear |
| `src/layaouts/`             | ✅ Existen      | MainLayout, ContentLayout, AuthLayout               |

---

## 🔐 Middleware (src/middleware/index.ts)

**Ya implementado**. Características:

- Rutas protegidas: `['/protected']`.
- Mecanismo: Validación de sesión con **better-auth** via `auth.api.getSession()`.
- **Inyección en `Astro.locals`**: `user` y `session` del usuario logueado disponibles en todas las páginas.
- `onRequest` es el **orquestador**: obtiene sesión → inyecta en locals → si ruta protegida sin sesión → redirige a `/login`.

### Decisiones Arquitectónicas (NO CAMBIAR)

1. **Obtener sesión primero**: Siempre llamar `auth.api.getSession()` antes de decidir el flujo.
2. **Inyectar en `locals` siempre**: Tanto rutas públicas como protegidas deben tener acceso a `locals.user`.
3. **Redirección 302 para rutas protegidas**: En vez de 401, redirigir al login (mejor UX que Basic Auth).

---

## 📋 Convenciones (OBLIGATORIAS)

- **Middleware**: Usar `defineMiddleware`. `onRequest` es orquestador.
- **Seguridad**: NUNCA hardcodear credenciales. Leer siempre desde `import.meta.env`. No commitear `.env`.
- **TypeScript**: Estricto. Preferir `.at(-1)` sobre `[index]`.
- **Arquitectura**: SRP. Validación → función pura. Respuestas → función separada. Orquestación → `onRequest`.
- **better-auth**: Usar `auth.api.*` en el servidor, `authClient.*` en el browser. Nunca mezclar.

---

## 📋 Estado de TODOs

| TODO | Estado | Detalle |
|------|--------|---------|
| Variables de entorno para credenciales | ✅ Completado | Credenciales movidas a `.env` (`AUTH_USER`, `AUTH_PASS`). Middleware actualizado. |
| Extender `Astro.locals` con datos del usuario | ✅ Completado | `env.d.ts` tipado con `User`/`Session` de better-auth. Middleware inyecta datos reales. |
| Implementar logout | ✅ Completado | Botón en `protected.astro` con `authClient.signOut()` y redirección a `/login`. |
| Email de verificación | ✅ Configurado | Resend envía emails al registrarse (`sendOnSignUp: true`). |
| Seed de datos de prueba | ✅ Completado | Seed usa tabla `posts` del schema del proyecto. |

> Si se completa un TODO, **actualizar esta tabla inmediatamente**.

---

## 📖 Referencias

- **Sección**: Middleware y Autenticación.
- **Conceptos clave**: `onRequest`, `context.locals`, `sequence()`, `defineMiddleware()`.
- **Docs**: [Astro Middleware](https://docs.astro.build/en/guides/middleware/)

---

## 🧠 Notas para el Agente

- El usuario está aprendiendo. Explicar el **POR QUÉ**, no solo el qué.
- Comparar con código de Fernando Herrera cuando sea relevante, pero priorizar **buenas prácticas arquitectónicas**.
- Proponer el siguiente paso lógico.
- **NO repetir preguntas resueltas acá**. Si dice "quiero hacer el TODO 1", es "Variables de Entorno".
- Si el estado cambia (ej: se completó un TODO), **actualizar ESTE ARCHIVO** inmediatamente.
- **Reglas de Memoria (Engram)**:
  - ANTES: consultar `engram` si el tema parece familiar.
  - DESPUÉS: guardar en `engram` con `mem_save` tras decisiones, fixes o patterns.
  - Si el usuario dice "recordá", "como hicimos", "la última vez", consultar `engram` automáticamente.
