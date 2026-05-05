import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_APIKEY);

interface SendVerificationParams {
  email: string;
  name: string;
  url: string;
}

export async function sendVerificationEmail({ email, name, url }: SendVerificationParams): Promise<void> {
  console.log(`[send-mail-user] Intentando enviar email a ${email}...`);

  const { data, error } = await resend.emails.send({
    from: 'noreply@notification.db9.uk',
    to: email,
    subject: 'Verifica tu email',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Hola ${name},</h2>
        <p>Gracias por registrarte. Hacé clic en el siguiente botón para verificar tu cuenta:</p>
        <a href="${url}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Verificar cuenta</a>
        <p style="color: #666; font-size: 14px;">Si no solicitaste este registro, ignorá este email.</p>
      </div>
    `,
  });

  if (error) {
    console.error(`[send-mail-user] ERROR enviando a ${email}:`, error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }

  console.log(`[send-mail-user] ✅ Email enviado a ${email}. ID:`, data?.id);
}
