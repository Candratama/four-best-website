// R2 Storage Library
// Cloudflare R2 integration for 4Best website

export { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "./client";

export {
  uploadImage,
  uploadRawFile,
  type UploadResult,
  type UploadOptions,
} from "./upload";

export { deleteObject, deleteObjects, deleteOldObject } from "./delete";

export {
  getAssetUrl,
  getR2Key,
  generateUniqueFilename,
  getThumbnailPath,
  getContentType,
  isSvg,
  isValidImageType,
  mapPublicPathToR2,
  IMAGE_CATEGORIES,
  type ImageCategory,
} from "./utils";
