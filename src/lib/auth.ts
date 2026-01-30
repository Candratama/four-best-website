import bcrypt from "bcryptjs";
import { getDB } from "./cloudflare";

// Types
export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  name: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

export interface SessionUser {
  id: number;
  username: string;
  name: string | null;
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session utilities
function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createSession(userId: number): Promise<string> {
  const db = await getDB();
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db
    .prepare(
      "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
    )
    .bind(sessionId, userId, expiresAt.toISOString())
    .run();

  return sessionId;
}

export async function validateSession(
  sessionId: string
): Promise<SessionUser | null> {
  const db = await getDB();

  const session = await db
    .prepare(
      `SELECT s.*, u.username, u.name, u.is_active
       FROM sessions s
       JOIN admin_users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > datetime('now') AND u.is_active = 1`
    )
    .bind(sessionId)
    .first<Session & { username: string; name: string | null; is_active: number }>();

  if (!session) return null;

  return {
    id: session.user_id,
    username: session.username,
    name: session.name,
  };
}

export async function deleteSession(sessionId: string): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
}

// User utilities
export async function getUserByUsername(
  username: string
): Promise<AdminUser | null> {
  const db = await getDB();
  return db
    .prepare("SELECT * FROM admin_users WHERE username = ? AND is_active = 1")
    .bind(username)
    .first<AdminUser>();
}

export async function createAdminUser(
  username: string,
  password: string,
  name?: string
): Promise<number> {
  const db = await getDB();
  const passwordHash = await hashPassword(password);

  const result = await db
    .prepare(
      "INSERT INTO admin_users (username, password_hash, name) VALUES (?, ?, ?)"
    )
    .bind(username, passwordHash, name || null)
    .run();

  return result.meta.last_row_id as number;
}

// Clean up expired sessions
export async function cleanupExpiredSessions(): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
}
