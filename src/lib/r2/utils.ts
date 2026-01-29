import { R2_PUBLIC_URL } from "./client";

/**
 * Image category configuration for processing
 */
export const IMAGE_CATEGORIES = {
  slider: { maxWidth: 1920, thumbnailWidth: 400 },
  team: { maxWidth: 800, thumbnailWidth: 200 },
  partners: { maxWidth: 600, thumbnailWidth: 150 },
  properties: { maxWidth: 1600, thumbnailWidth: 400 },
  backgrounds: { maxWidth: 1920, thumbnailWidth: null },
  misc: { maxWidth: 1200, thumbnailWidth: 300 },
  branding: { maxWidth: null, thumbnailWidth: null }, // Keep original
} as const;

export type ImageCategory = keyof typeof IMAGE_CATEGORIES;

/**
 * Get full R2 URL from a path
 * @param path - Path like "/slider/image.webp" or full URL
 * @returns Full URL like "https://cdn.4best.id/slider/image.webp"
 */
export function getAssetUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  // Remove leading /images/ if present (for migration compatibility)
  const cleanPath = path.replace(/^\/images\//, "/");

  // Ensure path starts with /
  const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  return `${R2_PUBLIC_URL}${normalizedPath}`;
}

/**
 * Get R2 key from a full URL or path
 * @param urlOrPath - Full URL or path
 * @returns R2 key without leading slash
 */
export function getR2Key(urlOrPath: string): string {
  if (!urlOrPath) return "";

  // If it's a full URL, extract the path
  if (urlOrPath.startsWith("http")) {
    try {
      const url = new URL(urlOrPath);
      return url.pathname.replace(/^\//, "");
    } catch {
      return urlOrPath.replace(/^\//, "");
    }
  }

  return urlOrPath.replace(/^\//, "");
}

/**
 * Generate a unique filename with timestamp
 * @param originalName - Original filename
 * @param category - Image category
 * @returns Unique filename
 */
export function generateUniqueFilename(
  originalName: string,
  category: ImageCategory
): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split(".").pop()?.toLowerCase() || "webp";
  const baseName = originalName
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace special chars
    .toLowerCase()
    .substring(0, 50); // Limit length

  return `${category}/${baseName}-${timestamp}-${randomStr}.${ext}`;
}

/**
 * Get thumbnail path from original path
 * @param originalPath - Original image path
 * @returns Thumbnail path
 */
export function getThumbnailPath(originalPath: string): string {
  const parts = originalPath.split("/");
  const filename = parts.pop();
  return [...parts, "thumbs", filename].join("/");
}

/**
 * Determine content type from filename
 * @param filename - Filename with extension
 * @returns MIME type
 */
export function getContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    svg: "image/svg+xml",
    gif: "image/gif",
  };
  return mimeTypes[ext || ""] || "application/octet-stream";
}

/**
 * Check if file is an SVG (should not be processed)
 * @param filename - Filename to check
 * @returns True if SVG
 */
export function isSvg(filename: string): boolean {
  return filename.toLowerCase().endsWith(".svg");
}

/**
 * Validate file type for upload
 * @param filename - Filename to validate
 * @returns True if valid image type
 */
export function isValidImageType(filename: string): boolean {
  const validExtensions = ["jpg", "jpeg", "png", "webp", "svg", "gif"];
  const ext = filename.split(".").pop()?.toLowerCase();
  return validExtensions.includes(ext || "");
}

/**
 * Map old public path to R2 category
 * @param publicPath - Path like "/images/slider/apt-1.webp"
 * @returns Category and new path
 */
export function mapPublicPathToR2(publicPath: string): {
  category: ImageCategory;
  r2Path: string;
} {
  // Remove leading slash and /images/ prefix
  const cleanPath = publicPath.replace(/^\/?(images\/)?/, "");
  const parts = cleanPath.split("/");

  // Map folder names to categories
  const folderMapping: Record<string, ImageCategory> = {
    // Direct mappings
    slider: "slider",
    team: "team",
    agents: "team", // agents are team members
    partner: "partners",
    partners: "partners",
    background: "backgrounds",
    backgrounds: "backgrounds",
    misc: "misc",
    properties: "properties",
    // Property-related folders
    apartment: "properties",
    "discover-rooms": "properties",
    "room-single": "properties",
    products: "properties",
    // Misc folders
    demo: "misc",
    "facilities-nearby": "misc",
    gallery: "misc",
    "icons-color": "misc",
    news: "misc",
    "news-thumbnail": "misc",
    svg: "misc",
    ui: "misc",
  };

  const folder = parts[0]?.toLowerCase();
  const category = folderMapping[folder] || "misc";

  // For root level files like logo.webp, logo-black.webp, icon.webp
  if (parts.length === 1) {
    const filename = parts[0].toLowerCase();
    if (filename.startsWith("logo") || filename === "icon.webp") {
      return {
        category: "branding",
        r2Path: `branding/${parts[0]}`,
      };
    }
  }

  // Reconstruct path with correct category
  const filename = parts.slice(1).join("/") || parts[0];
  return {
    category,
    r2Path: `${category}/${filename}`,
  };
}
