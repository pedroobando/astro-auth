import { defineMiddleware } from 'astro:middleware';

const privateRoutes = ['/protected'];

/**
 * Valida las credenciales de Basic Auth contra las variables de entorno.
 * Retorna true si el usuario está autorizado.
 */
const isAuthorized = (request: Request): boolean => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  // Decodificamos base64: "Basic dXNlcjpwYXNz" -> "user:pass"
  const base64Credentials = authHeader.split(' ').at(-1) ?? '';
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');

  const validUser = import.meta.env.AUTH_USER;
  const validPass = import.meta.env.AUTH_PASS;

  return username === validUser && password === validPass;
};

/**
 * Retorna una Response 401 para solicitar autenticación Basic.
 */
const requestAuthentication = (): Response => {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
};

export const onRequest = defineMiddleware(({ url, request }, next) => {
  // 1. ¿Es una ruta protegida?
  if (!privateRoutes.includes(url.pathname)) {
    return next();
  }

  // 2. ¿Está autorizado?
  if (isAuthorized(request)) {
    return next();
  }

  // 3. No autorizado: pedir credenciales
  return requestAuthentication();
});
