import {
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "./client";
import {
  IMAGE_CATEGORIES,
  ImageCategory,
  getContentType,
  getThumbnailPath,
  isSvg,
  generateUniqueFilename,
} from "./utils";

export interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  key: string;
  thumbnailKey?: string;
}

export interface UploadOptions {
  category: ImageCategory;
  filename?: string;
  generateThumbnail?: boolean;
}

/**
 * Process image with Sharp (resize, convert to webp, compress)
 */
async function processImage(
  buffer: Buffer,
  maxWidth: number | null,
  quality: number = 80
): Promise<Buffer> {
  let pipeline = sharp(buffer);

  // Get metadata to check dimensions
  const metadata = await pipeline.metadata();

  // Resize if maxWidth is set and image is larger
  if (maxWidth && metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  // Convert to webp with compression
  return pipeline.webp({ quality }).toBuffer();
}

/**
 * Generate thumbnail from image buffer
 */
async function generateThumbnailBuffer(
  buffer: Buffer,
  thumbnailWidth: number,
  quality: number = 75
): Promise<Buffer> {
  return sharp(buffer)
    .resize(thumbnailWidth, null, {
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({ quality })
    .toBuffer();
}

/**
 * Upload buffer to R2
 */
async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  await r2Client.send(new PutObjectCommand(params));
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Upload an image to R2 with processing
 * @param file - File buffer or base64 string
 * @param originalFilename - Original filename for extension detection
 * @param options - Upload options
 * @returns Upload result with URLs
 */
export async function uploadImage(
  file: Buffer | string,
  originalFilename: string,
  options: UploadOptions
): Promise<UploadResult> {
  const { category, filename, generateThumbnail = true } = options;
  const categoryConfig = IMAGE_CATEGORIES[category];

  // Convert base64 to buffer if needed
  const buffer = typeof file === "string" ? Buffer.from(file, "base64") : file;

  // Generate unique filename or use provided
  const finalFilename = filename || generateUniqueFilename(originalFilename, category);

  // Determine if we should process the image
  const shouldProcess = !isSvg(originalFilename) && categoryConfig.maxWidth !== null;

  let processedBuffer: Buffer;
  let finalKey: string;

  if (shouldProcess) {
    // Process image (resize, convert to webp)
    processedBuffer = await processImage(buffer, categoryConfig.maxWidth);
    // Change extension to webp
    finalKey = finalFilename.replace(/\.[^/.]+$/, ".webp");
  } else {
    // Keep original for SVG or branding
    processedBuffer = buffer;
    finalKey = finalFilename;
  }

  // Upload main image
  const contentType = shouldProcess ? "image/webp" : getContentType(originalFilename);
  const url = await uploadToR2(processedBuffer, finalKey, contentType);

  const result: UploadResult = {
    url,
    key: finalKey,
  };

  // Generate and upload thumbnail if needed
  if (
    generateThumbnail &&
    categoryConfig.thumbnailWidth &&
    !isSvg(originalFilename)
  ) {
    const thumbnailBuffer = await generateThumbnailBuffer(
      buffer,
      categoryConfig.thumbnailWidth
    );
    const thumbnailKey = getThumbnailPath(finalKey);
    const thumbnailUrl = await uploadToR2(
      thumbnailBuffer,
      thumbnailKey,
      "image/webp"
    );

    result.thumbnailUrl = thumbnailUrl;
    result.thumbnailKey = thumbnailKey;
  }

  return result;
}

/**
 * Upload a raw file to R2 without processing (for SVGs, etc.)
 */
export async function uploadRawFile(
  buffer: Buffer,
  key: string,
  contentType?: string
): Promise<string> {
  const finalContentType = contentType || getContentType(key);
  return uploadToR2(buffer, key, finalContentType);
}
