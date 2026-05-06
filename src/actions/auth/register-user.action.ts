import { z } from 'astro/zod';
import { ActionError, defineAction } from 'astro:actions';
import { auth } from '@/lib/auth';

// ---------------------------------------------------------------------------
// Error-handling helpers (SRP — each function does ONE thing)
// ---------------------------------------------------------------------------

type AuthErrorType =
  | 'duplicate_email'
  | 'weak_password'
  | 'validation'
  | 'signup_disabled'
  | 'unknown';

/**
 * Extract the error body from a better-auth / better-call APIError.
 * APIError instances carry a `body: { code: string; message: string }` property.
 * Falls back to the Error.message for generic errors.
 */
function extractErrorBody(
  error: unknown,
): { code?: string; message?: string } {
  // better-call APIError has a public `body` property
  if (
    typeof error === 'object' &&
    error !== null &&
    'body' in error
  ) {
    const body = (error as Record<string, unknown>).body;
    if (typeof body === 'object' && body !== null) {
      return body as { code?: string; message?: string };
    }
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  return {};
}

/**
 * Classify a better-auth error into one of our known error types.
 * Priority: check the error `code` (most reliable) → check the `message`.
 */
function getAuthErrorType(error: unknown): AuthErrorType {
  const { code, message } = extractErrorBody(error);
  const upperCode = (code ?? '').toUpperCase();
  const lowerMsg = (message ?? '').toLowerCase();

  // 1. Duplicate email
  if (
    upperCode.includes('USER_ALREADY_EXISTS') ||
    lowerMsg.includes('already exists') ||
    lowerMsg.includes('already registered') ||
    lowerMsg.includes('duplicate') ||
    lowerMsg.includes('unique constraint')
  ) {
    return 'duplicate_email';
  }

  // 2. Weak / invalid password
  if (
    upperCode.includes('PASSWORD_TOO_SHORT') ||
    upperCode.includes('PASSWORD_TOO_LONG') ||
    upperCode.includes('INVALID_PASSWORD') ||
    lowerMsg.includes('password too short') ||
    lowerMsg.includes('password too long') ||
    (lowerMsg.includes('password') && lowerMsg.includes('invalid'))
  ) {
    return 'weak_password';
  }

  // 3. Sign-up disabled
  if (
    upperCode.includes('EMAIL_PASSWORD_SIGN_UP_DISABLED') ||
    lowerMsg.includes('sign up is not enabled') ||
    lowerMsg.includes('sign-up is not enabled')
  ) {
    return 'signup_disabled';
  }

  // 4. Validation (invalid email, missing fields, zod errors, etc.)
  if (
    upperCode.includes('INVALID_EMAIL') ||
    upperCode.includes('VALIDATION_ERROR') ||
    upperCode.includes('MISSING_FIELD') ||
    upperCode.includes('FIELD_NOT_ALLOWED') ||
    lowerMsg.includes('invalid email') ||
    lowerMsg.includes('validation')
  ) {
    return 'validation';
  }

  return 'unknown';
}

/**
 * Map an error type to a user-friendly message in Spanish.
 * Includes the original error details for validation errors.
 */
function getErrorMessage(
  type: AuthErrorType,
  originalError: unknown,
): string {
  const { message: originalMsg } = extractErrorBody(originalError);

  switch (type) {
    case 'duplicate_email':
      return 'Este correo electrónico ya está registrado';

    case 'weak_password':
      return 'La contraseña es demasiado débil. Debe tener al menos 8 caracteres';

    case 'validation':
      if (originalMsg) {
        return `Error de validación: ${originalMsg}`;
      }
      return 'Error de validación. Revise los datos ingresados';

    case 'signup_disabled':
      return 'El registro no está habilitado en este momento';

    default:
      return 'Error al registrar el usuario. Intente nuevamente';
  }
}

/**
 * Map an error type to the appropriate ActionError HTTP-like code.
 */
function getErrorCode(
  type: AuthErrorType,
): 'CONFLICT' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR' {
  switch (type) {
    case 'duplicate_email':
      return 'CONFLICT';

    case 'weak_password':
    case 'validation':
    case 'signup_disabled':
      return 'BAD_REQUEST';

    default:
      return 'INTERNAL_SERVER_ERROR';
  }
}

// ---------------------------------------------------------------------------
// Action
// ---------------------------------------------------------------------------

export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string({ message: 'Indique el nombre, mayor de dos caracteres' }).min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  handler: async ({ name, email, password }) => {
    try {
      const result = await auth.api.signUpEmail({
        body: { name, email, password },
      });

      return { success: true, user: result.user };
    } catch (error) {
      const type = getAuthErrorType(error);
      const message = getErrorMessage(type, error);
      const code = getErrorCode(type);

      throw new ActionError({ code, message });
    }
  },
});
