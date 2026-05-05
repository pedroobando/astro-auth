import { z } from 'astro/zod';
import { ActionError, defineAction } from 'astro:actions';
import { auth } from '@/lib/auth';

export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string({ message: 'Indique el nombre, mayor de dos caracteres' }).min(2),
    email: z.string().email(),
    password: z.string().min(8),
    remember_me: z
      .union([z.literal('true'), z.literal('false'), z.boolean()])
      .optional()
      .transform((val) => val === 'true' || val === true)
      .pipe(z.boolean()),
  }),
  handler: async ({ name, email, password, remember_me }) => {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
      });

      return { success: true, user: result.user };
    } catch (error) {
      let message = 'Error al registrar el usuario';

      if (error instanceof Error) {
        message = error.message;
      }

      throw new ActionError({
        code: 'CONFLICT',
        message,
      });
    }
  },
});
