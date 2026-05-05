import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db/index';
import { sendVerificationEmail } from '@/utils/send-mail-user';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true, // Descomentar si querés obligar verificación antes de login
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      //   console.log('[better-auth] Disparando sendVerificationEmail para:', user.email);
      try {
        await sendVerificationEmail({
          email: user.email,
          name: user.name,
          url,
        });
        // console.log('[better-auth] Email enviado correctamente');
      } catch (err) {
        console.error('[better-auth] ERROR al enviar email:', err);
        throw err;
      }
    },
  },
  baseURL: import.meta.env.BETTER_AUTH_URL,
});
