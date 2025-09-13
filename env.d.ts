/// <reference types="next" />

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    DATABASE_PROVIDER?: 'sqlite' | 'postgresql';
    IRON_PASSWORD: string;
    NEXT_PUBLIC_APP_NAME?: string;
  }
}
