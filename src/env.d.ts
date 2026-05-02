/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    // TODO: Extender con datos del usuario cuando se implemente Astro.locals
  }
}

interface ImportMetaEnv {
  readonly AUTH_USER: string;
  readonly AUTH_PASS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}