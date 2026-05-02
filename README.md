# astro-auth

> Parte del curso **"Astro: La Guía Completa"** impartido por [Fernando Herrera](https://fernando-herrera.com/) en [Udemy](https://www.udemy.com/course/astro-guia-completa/?couponCode=KEEPLEARNING).

Proyecto de Astro.js con autenticación básica mediante middleware. Implementa protección de rutas usando **Basic Auth** con una arquitectura limpia y desacoplada.

## 🚀 Características

- **Middleware de Autenticación**: Intercepta solicitudes a rutas protegidas antes de renderizar.
- **Arquitectura Limpia**: Lógica de validación desacoplada del framework.
- **Type Safety**: Uso de `defineMiddleware` y tipado estricto.

## 📁 Project Structure

```text
/
├── public/
├── src/
│   ├── middleware/
│   │   └── index.ts          # Middleware de autenticación
│   └── pages/
│       ├── index.astro       # Página pública
│       └── protected.astro   # Ruta protegida
├── package.json
└── README.md
```

## 🔐 Autenticación

El proyecto utiliza un middleware (`src/middleware/index.ts`) que intercepta todas las solicitudes. Si la ruta está en la lista de `privateRoutes`, exige autenticación **Basic Auth**.

### Credenciales por defecto

| Usuario | Contraseña |
| :------ | :--------- |
| `admin` | `admin`    |

> ⚠️ **IMPORTANTE**: En producción, las credenciales deben configurarse mediante variables de entorno. Ver sección [TODOs](#-todos).

### Cómo funciona

1. El usuario accede a `/protected`.
2. El middleware detecta que es una ruta protegida.
3. Si no hay header `Authorization` o las credenciales son inválidas, devuelve `401 Unauthorized`.
4. El navegador muestra el prompt nativo de usuario/contraseña.
5. Si las credenciales son correctas, se permite el acceso.

## 🧞 Commands

Todos los comandos se ejecutan desde la raíz del proyecto:

| Command       | Action                           |
| :------------ | :------------------------------- |
| `bun install` | Instala las dependencias         |
| `bun dev`     | Inicia el servidor de desarrollo |
| `bun build`   | Compila el sitio para producción |
| `bun preview` | Previsualiza el build localmente |

## 📝 TODOs

- [ ] Mover credenciales a variables de entorno (`import.meta.env.AUTH_USER`, `import.meta.env.AUTH_PASS`).
- [ ] Tipar `Astro.locals` para compartir datos del usuario logueado en las páginas.
- [ ] Implementar logout (el navegador cachea las credenciales de Basic Auth).

## 👀 Want to learn more?

- [Documentación de Middleware en Astro](https://docs.astro.build/en/guides/middleware/)
