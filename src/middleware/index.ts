import { defineMiddleware } from 'astro:middleware';
import { auth } from '@/lib/auth';

const privateRoutes = ['/protected'];

export const onRequest = defineMiddleware(async ({ url, request, locals }, next) => {
  // 1. Obtener la sesión actual desde la cookie
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // 2. Inyectar datos del usuario en Astro.locals para las páginas
  locals.user = session?.user ?? null;
  locals.session = session?.session ?? null;

  // 3. ¿Es una ruta protegida?
  const isPrivate = privateRoutes.some((route) => url.pathname.startsWith(route));

  if (!isPrivate) {
    return next();
  }

  // 4. Ruta protegida sin sesión → redirigir al login
  if (!session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/login',
      },
    });
  }

  // 5. Autorizado: continuar
  return next();
});
