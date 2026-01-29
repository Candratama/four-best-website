import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME } from "./client";
import { getR2Key, getThumbnailPath } from "./utils";

/**
 * Delete a single object from R2
 * @param keyOrUrl - R2 key or full URL
 * @param deleteThumbnail - Also delete associated thumbnail
 */
export async function deleteObject(
  keyOrUrl: string,
  deleteThumbnail: boolean = true
): Promise<void> {
  const key = getR2Key(keyOrUrl);

  if (!key) {
    throw new Error("Invalid key or URL provided");
  }

  // Delete main object
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );

  // Delete thumbnail if requested
  if (deleteThumbnail) {
    const thumbnailKey = getThumbnailPath(key);
    try {
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: thumbnailKey,
        })
      );
    } catch {
      // Thumbnail might not exist, ignore error
    }
  }
}

/**
 * Delete multiple objects from R2
 * @param keysOrUrls - Array of R2 keys or full URLs
 * @param deleteThumbnails - Also delete associated thumbnails
 */
export async function deleteObjects(
  keysOrUrls: string[],
  deleteThumbnails: boolean = true
): Promise<void> {
  if (keysOrUrls.length === 0) return;

  const keys = keysOrUrls.map(getR2Key).filter(Boolean);

  // Add thumbnail keys if requested
  const allKeys = deleteThumbnails
    ? [...keys, ...keys.map(getThumbnailPath)]
    : keys;

  // R2/S3 allows max 1000 objects per delete request
  const chunks: string[][] = [];
  for (let i = 0; i < allKeys.length; i += 1000) {
    chunks.push(allKeys.slice(i, i + 1000));
  }

  for (const chunk of chunks) {
    await r2Client.send(
      new DeleteObjectsCommand({
        Bucket: R2_BUCKET_NAME,
        Delete: {
          Objects: chunk.map((key) => ({ Key: key })),
          Quiet: true,
        },
      })
    );
  }
}

/**
 * Replace an object in R2 (delete old, upload new handled separately)
 * This is just a convenience wrapper for delete
 * @param oldKeyOrUrl - Old R2 key or URL to delete
 */
export async function deleteOldObject(oldKeyOrUrl: string): Promise<void> {
  if (!oldKeyOrUrl) return;

  // Don't delete if it's a placeholder or default image
  if (
    oldKeyOrUrl.includes("placeholder") ||
    oldKeyOrUrl.includes("default")
  ) {
    return;
  }

  await deleteObject(oldKeyOrUrl, true);
}
