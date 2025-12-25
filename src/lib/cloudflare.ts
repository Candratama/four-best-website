import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Get Cloudflare environment bindings
 * Use this in Server Components, Server Actions, and API Routes
 */
export async function getCloudflareEnv() {
  const { env } = await getCloudflareContext({ async: true });
  return env as CloudflareEnv;
}

/**
 * Get D1 Database instance
 */
export async function getDB() {
  const env = await getCloudflareEnv();
  return env.DB;
}

/**
 * Get R2 Storage instance
 */
export async function getStorage() {
  const env = await getCloudflareEnv();
  return env.STORAGE;
}

/**
 * Helper to upload file to R2
 */
export async function uploadToR2(
  key: string,
  file: File | Blob | ArrayBuffer,
  contentType?: string
): Promise<string> {
  const storage = await getStorage();

  const body = file instanceof File || file instanceof Blob
    ? await file.arrayBuffer()
    : file;

  await storage.put(key, body, {
    httpMetadata: contentType ? { contentType } : undefined,
  });

  return key;
}

/**
 * Helper to delete file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const storage = await getStorage();
  await storage.delete(key);
}

/**
 * Helper to get file URL from R2
 * Note: You'll need to set up a public bucket or use signed URLs
 */
export function getR2Url(key: string): string {
  // For public bucket access, configure your R2 bucket for public access
  // and use the public URL pattern
  return `/api/storage/${key}`;
}
