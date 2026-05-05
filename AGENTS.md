# AGENTS.md — astro-auth (Astro Course)

> ⚠️ **INSTRUCCIÓN PARA EL AGENTE**: ANTES de leer cualquier otro archivo, leé esto completo. Contiene el estado actual, decisiones tomadas y pendientes.
>
> **PROTOCOLO DE MEMORIA OBLIGATORIO**: Antes de actuar, consultá `engram` (`mem_context` / `mem_search`) para verificar si ya tratamos el tema en sesiones previas. Después de cambios significativos, guardá en `engram` (`mem_save`).

---

## 📚 Contexto

Proyecto de autenticación con middleware en Astro. Ejercicio práctico de Basic Auth.

**Stack**: Astro (latest), TypeScript (stricto), Bun/Node. Sin librerías externas.

---

## 🗂 Estructura Actual

```text
src/
├── middleware/
│   └── index.ts          # Middleware implementado (Basic Auth, ver detalles abajo)
├── pages/
│   ├── index.astro       # Pública
│   └── protected.astro   # Protegida
├── env.d.ts              # ✅ EXISTE (tipa App.Locals y env vars)
└── ...
```

| Archivo                     | Estado          | Nota                                                |
| --------------------------- | --------------- | --------------------------------------------------- |
| `src/middleware/index.ts`   | ✅ Implementado | Ver sección "Middleware" abajo                      |
| `src/pages/index.astro`     | ✅ Existe       | Pública                                             |
| `src/pages/protected.astro` | ✅ Existe       | Requiere Basic Auth                                 |
| `src/env.d.ts`              | ✅ Existe       | Tipa `App.Locals` y `import.meta.env`               |
| `.env`                      | ✅ Existe       | Credenciales `AUTH_USER`, `AUTH_PASS`. NO commitear |

---

## 🔐 Middleware (src/middleware/index.ts)

**Ya implementado**. Características:

- Rutas protegidas: `['/protected']`.
- Mecanismo: Basic Auth via header `Authorization`.
- **Credenciales**: Leídas desde `import.meta.env.AUTH_USER` y `import.meta.env.AUTH_PASS` (variables de entorno).
- **Funciones privadas**:
  - `isAuthorized(request: Request): boolean` → Valida credenciales. Retorna `boolean`. **NO recibe `next`**.
  - `requestAuthentication(): Response` → Retorna 401 con `WWW-Authenticate`.
- `onRequest` es el **orquestador**: decide si la ruta es privada → si está autorizado → si pide auth.

### Decisiones Arquitectónicas (NO CAMBIAR)

1. **NO pasar `next` a helpers**: `isAuthorized` devuelve `boolean`. El orquestador decide el flujo. Desacopla lógica del framework.
2. **Arrow functions** para helpers privados.
3. **`.at(-1)`** para extraer el token base64 del header.
4. **Respuesta 401 extraída** en función separada.

---

## 📋 Convenciones (OBLIGATORIAS)

- **Middleware**: Usar `defineMiddleware`. `onRequest` es orquestador. Helpers devuelven `boolean`, no reciben `next`.
- **Seguridad**: NUNCA hardcodear credenciales. Leer siempre desde `import.meta.env`. No commitear `.env`.
- **TypeScript**: Estricto. `atob` nativo. Preferir `.at(-1)` sobre `[index]`.
- **Arquitectura**: SRP. Validación → función pura. Respuestas → función separada. Orquestación → `onRequest`.

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
