/**
 * Migration Script: Upload all images from /public to Cloudflare R2
 *
 * Usage:
 *   npx tsx scripts/migrate-to-r2.ts
 *
 * Options:
 *   --dry-run    Preview what would be uploaded without actually uploading
 *   --verbose    Show detailed progress
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

// Load environment variables from .env.local
import { config } from "dotenv";
config({ path: ".env.local" });

// Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "4best-assets";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://cdn.4best.id";

// Validate credentials
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error("❌ Missing R2 credentials. Please set environment variables:");
  console.error("   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY");
  process.exit(1);
}

// Initialize R2 client
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Image processing configuration
const IMAGE_CONFIG: Record<string, { maxWidth: number | null; thumbnailWidth: number | null }> = {
  slider: { maxWidth: 1920, thumbnailWidth: 400 },
  team: { maxWidth: 800, thumbnailWidth: 200 },
  partners: { maxWidth: 600, thumbnailWidth: 150 },
  properties: { maxWidth: 1600, thumbnailWidth: 400 },
  backgrounds: { maxWidth: 1920, thumbnailWidth: null },
  misc: { maxWidth: 1200, thumbnailWidth: 300 },
  branding: { maxWidth: null, thumbnailWidth: null },
};

// Folder mapping
const FOLDER_MAPPING: Record<string, string> = {
  slider: "slider",
  team: "team",
  agents: "team",
  partner: "partners",
  partners: "partners",
  background: "backgrounds",
  backgrounds: "backgrounds",
  misc: "misc",
  properties: "properties",
  apartment: "properties",
  "discover-rooms": "properties",
  "room-single": "properties",
  products: "properties",
  demo: "misc",
  "facilities-nearby": "misc",
  gallery: "misc",
  "icons-color": "misc",
  news: "misc",
  "news-thumbnail": "misc",
  svg: "misc",
  ui: "misc",
};

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");

// Tracking
interface MigrationResult {
  oldPath: string;
  newUrl: string;
  thumbnailUrl?: string;
  category: string;
  processed: boolean;
}

const results: MigrationResult[] = [];
const errors: { path: string; error: string }[] = [];

/**
 * Get content type from filename
 */
function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

/**
 * Check if file is SVG
 */
function isSvg(filename: string): boolean {
  return path.extname(filename).toLowerCase() === ".svg";
}

/**
 * Map local path to R2 category and path
 */
function mapToR2Path(localPath: string): { category: string; r2Path: string } {
  // Remove public/images/ prefix
  let relativePath = localPath
    .replace(/^public\/images\//, "")
    .replace(/^public\//, "");

  const parts = relativePath.split("/");
  const folder = parts[0]?.toLowerCase();

  // Handle root level branding files
  if (parts.length === 1) {
    const filename = parts[0].toLowerCase();
    if (filename.startsWith("logo") || filename === "icon.webp") {
      return {
        category: "branding",
        r2Path: `branding/${parts[0]}`,
      };
    }
  }

  // Map folder to category
  const category = FOLDER_MAPPING[folder] || "misc";

  // Preserve original folder structure to avoid filename collisions
  // e.g., gallery/l1.webp → misc/gallery/l1.webp
  // e.g., misc/l1.webp → misc/l1.webp (no subfolder needed)
  const originalFolder = parts[0];
  const filename = parts.slice(1).join("/") || parts[0];

  // Check if folder is essentially the same as category (singular/plural variants)
  // e.g., background → backgrounds, partner → partners
  const isSameAsCategory =
    folder === category ||
    folder + "s" === category ||
    folder === category + "s" ||
    folder.replace(/s$/, "") === category.replace(/s$/, "");

  // If the category is different from original folder, include original folder as subfolder
  // This prevents collisions like gallery/l1.webp and misc/l1.webp both becoming misc/l1.webp
  const r2Path = isSameAsCategory
    ? `${category}/${filename}`
    : `${category}/${originalFolder}/${filename}`;

  return {
    category,
    r2Path,
  };
}

/**
 * Process image with Sharp
 */
async function processImage(
  buffer: Buffer,
  maxWidth: number | null,
  quality: number = 80
): Promise<Buffer> {
  let pipeline = sharp(buffer);
  const metadata = await pipeline.metadata();

  if (maxWidth && metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  return pipeline.webp({ quality }).toBuffer();
}

/**
 * Generate thumbnail
 */
async function generateThumbnail(
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
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Get thumbnail path from original path
 */
function getThumbnailPath(originalPath: string): string {
  const dir = path.dirname(originalPath);
  const filename = path.basename(originalPath);
  return `${dir}/thumbs/${filename}`;
}

/**
 * Process and upload a single file
 */
async function processFile(localPath: string): Promise<void> {
  const { category, r2Path } = mapToR2Path(localPath);
  const config = IMAGE_CONFIG[category] || IMAGE_CONFIG.misc;

  if (VERBOSE) {
    console.log(`  Processing: ${localPath} → ${r2Path}`);
  }

  if (DRY_RUN) {
    results.push({
      oldPath: localPath,
      newUrl: `${R2_PUBLIC_URL}/${r2Path}`,
      category,
      processed: !isSvg(localPath) && config.maxWidth !== null,
    });
    return;
  }

  try {
    const buffer = fs.readFileSync(localPath);
    const shouldProcess = !isSvg(localPath) && config.maxWidth !== null;

    let finalBuffer: Buffer;
    let finalKey: string;
    let contentType: string;

    if (shouldProcess) {
      finalBuffer = await processImage(buffer, config.maxWidth);
      finalKey = r2Path.replace(/\.[^/.]+$/, ".webp");
      contentType = "image/webp";
    } else {
      finalBuffer = buffer;
      finalKey = r2Path;
      contentType = getContentType(localPath);
    }

    // Upload main image
    const url = await uploadToR2(finalBuffer, finalKey, contentType);

    const result: MigrationResult = {
      oldPath: localPath,
      newUrl: url,
      category,
      processed: shouldProcess,
    };

    // Generate and upload thumbnail if needed
    if (config.thumbnailWidth && !isSvg(localPath)) {
      const thumbnailBuffer = await generateThumbnail(buffer, config.thumbnailWidth);
      const thumbnailKey = getThumbnailPath(finalKey);
      const thumbnailUrl = await uploadToR2(thumbnailBuffer, thumbnailKey, "image/webp");
      result.thumbnailUrl = thumbnailUrl;
    }

    results.push(result);
  } catch (error) {
    errors.push({
      path: localPath,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Recursively get all image files from a directory
 */
function getAllImageFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"].includes(ext)) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
  console.log("🚀 Starting R2 Migration");
  console.log(`   Mode: ${DRY_RUN ? "DRY RUN (no uploads)" : "LIVE"}`);
  console.log(`   Bucket: ${R2_BUCKET_NAME}`);
  console.log(`   Public URL: ${R2_PUBLIC_URL}`);
  console.log("");

  // Collect all files to migrate
  const filesToMigrate: string[] = [];

  // 1. Get all files from public/images/
  const imagesDir = "public/images";
  if (fs.existsSync(imagesDir)) {
    getAllImageFiles(imagesDir, filesToMigrate);
  }

  // 2. Get root level branding files (logo.svg, etc.) - exclude favicon
  const rootFiles = fs.readdirSync("public");
  for (const file of rootFiles) {
    const filePath = path.join("public", file);
    const stat = fs.statSync(filePath);
    if (!stat.isDirectory()) {
      const ext = path.extname(file).toLowerCase();
      const filename = file.toLowerCase();
      // Include logo and icon files, exclude favicon
      if (
        [".svg", ".png", ".webp"].includes(ext) &&
        !filename.includes("favicon") &&
        (filename.startsWith("logo") || filename === "icon.webp")
      ) {
        filesToMigrate.push(filePath);
      }
    }
  }

  console.log(`📁 Found ${filesToMigrate.length} files to migrate`);
  console.log("");

  // Process files
  let processed = 0;
  for (const file of filesToMigrate) {
    await processFile(file);
    processed++;

    // Progress indicator
    if (!VERBOSE && processed % 10 === 0) {
      console.log(`   Progress: ${processed}/${filesToMigrate.length}`);
    }
  }

  console.log("");
  console.log("✅ Migration complete!");
  console.log(`   Successful: ${results.length}`);
  console.log(`   Errors: ${errors.length}`);

  // Show errors if any
  if (errors.length > 0) {
    console.log("");
    console.log("❌ Errors:");
    for (const err of errors) {
      console.log(`   ${err.path}: ${err.error}`);
    }
  }

  // Generate mapping file
  const mappingPath = "scripts/r2-migration-mapping.json";
  const mapping: Record<string, { url: string; thumbnail?: string }> = {};

  for (const result of results) {
    // Convert local path to web path
    const webPath = "/" + result.oldPath.replace(/^public\//, "");
    mapping[webPath] = {
      url: result.newUrl,
      ...(result.thumbnailUrl && { thumbnail: result.thumbnailUrl }),
    };
  }

  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log("");
  console.log(`📄 Mapping file saved to: ${mappingPath}`);

  // Summary by category
  console.log("");
  console.log("📊 Summary by category:");
  const categoryCount: Record<string, number> = {};
  for (const result of results) {
    categoryCount[result.category] = (categoryCount[result.category] || 0) + 1;
  }
  for (const [category, count] of Object.entries(categoryCount).sort()) {
    console.log(`   ${category}: ${count} files`);
  }
}

// Run migration
migrate().catch((error) => {
  console.error("❌ Migration failed:", error);
  process.exit(1);
});
