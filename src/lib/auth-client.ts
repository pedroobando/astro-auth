import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: import.meta.env.BETTER_AUTH_URL,
});

// También podés exportar métodos específicos si preferís:
// export const { signIn, signUp, useSession } = createAuthClient();
