import type { SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

export type SessionUser = {
  id: string;
  name: string;
  email?: string;
};

export type AppSession = {
  user?: SessionUser;
};

// Compute a safe password for iron-session.
// - In production: require IRON_PASSWORD and ensure it's >= 32 chars.
// - In development: if IRON_PASSWORD is missing or too short, use a long fallback.
const LONG_DEV_FALLBACK = 'dev-password-change-me-please-use-env-local-32chars-min-xxxxxxxx';
function computePassword() {
  const env = process.env.IRON_PASSWORD;
  const isProd = process.env.NODE_ENV === 'production';
  if (env && env.length >= 32) return env;
  if (isProd) {
    throw new Error('IRON_PASSWORD must be set and at least 32 characters long in production.');
  }
  // Dev: fall back to a long constant
  return LONG_DEV_FALLBACK;
}
const password = computePassword();

export const sessionOptions: SessionOptions = {
  cookieName: 'buyer-intake-session',
  password,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession() {
  if (!password) {
    // Make the error explicit in production
    throw new Error('IRON_PASSWORD is not set. Define it in .env.local');
  }
  // Next.js 15: cookies() is async; await it before passing to iron-session
  const cookieStore = await cookies();
  // Cast types to satisfy differing package signatures across Next/iron-session versions
  const session = await getIronSession<AppSession>(cookieStore as any, sessionOptions as any);
  return session;
}

export async function requireUser() {
  const session = await getSession();
  if (!session.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
}
