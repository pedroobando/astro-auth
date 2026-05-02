import { z } from 'astro/zod';
import { defineAction } from 'astro:actions';

export const registerUser = defineAction({
  // Validación automática con Zod
  accept: 'form',
  input: z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional().default(false),
  }),

  // La lógica del servidor
  handler: async ({ name, email, password, remember_me }): Promise<boolean> => {
    console.log({ name, email, password, remember_me });
    return true;
  },
});
