import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';

export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function createSession(): string {
  // Crear un token simple (en producción usar JWT)
  const token = Buffer.from(`${ADMIN_USERNAME}:${Date.now()}`).toString('base64');
  return token;
}

export function verifySession(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, timestamp] = decoded.split(':');
    
    // Verificar que el token no sea muy antiguo (24 horas)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas
    
    return username === ADMIN_USERNAME && tokenAge < maxAge;
  } catch {
    return false;
  }
}

export async function getSessionFromRequest(request: NextRequest): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('admin-session')?.value || null;
}

export function isAuthenticated(sessionToken: string | null): boolean {
  return sessionToken ? verifySession(sessionToken) : false;
}
