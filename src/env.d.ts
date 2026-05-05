/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: import('better-auth').User | null;
    session: import('better-auth').Session | null;
  }
}

interface ImportMetaEnv {
  readonly BETTER_AUTH_URL: string;
  readonly BETTER_AUTH_SECRET: string;
  readonly TURSO_DATABASE_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
  readonly RESEND_APIKEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
