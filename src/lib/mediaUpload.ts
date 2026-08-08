import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

function extFromFile(file: File, fallback: string): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "video/webm") return "webm";
  if (file.type === "video/quicktime") return "mov";
  return fallback;
}

function validateImage(file: File) {
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error("Image must be JPEG, PNG, WebP, or GIF.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 10 MB or smaller.");
  }
}

function validateVideo(file: File) {
  if (!VIDEO_TYPES.has(file.type)) {
    throw new Error("Video must be MP4, WebM, or MOV.");
  }
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error("Video must be 100 MB or smaller.");
  }
}

async function uploadToPath(path: string, file: File): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

export async function uploadComboImage(businessId: string, comboId: string, file: File): Promise<string> {
  validateImage(file);
  const ext = extFromFile(file, "jpg");
  return uploadToPath(`combos/${businessId}/${comboId}/image-${Date.now()}.${ext}`, file);
}

export async function uploadComboVideo(businessId: string, comboId: string, file: File): Promise<string> {
  validateVideo(file);
  const ext = extFromFile(file, "mp4");
  return uploadToPath(`combos/${businessId}/${comboId}/video-${Date.now()}.${ext}`, file);
}

export async function uploadCatalogComboImage(slug: string, file: File): Promise<string> {
  validateImage(file);
  const ext = extFromFile(file, "jpg");
  return uploadToPath(`catalog/${slug}/image-${Date.now()}.${ext}`, file);
}

export async function uploadCatalogComboVideo(slug: string, file: File): Promise<string> {
  validateVideo(file);
  const ext = extFromFile(file, "mp4");
  return uploadToPath(`catalog/${slug}/video-${Date.now()}.${ext}`, file);
}

export async function uploadSiteMediaImage(slot: string, file: File): Promise<string> {
  validateImage(file);
  const ext = extFromFile(file, "jpg");
  return uploadToPath(`site/${slot}/image-${Date.now()}.${ext}`, file);
}

export async function uploadSiteMediaVideo(slot: string, file: File): Promise<string> {
  validateVideo(file);
  const ext = extFromFile(file, "mp4");
  return uploadToPath(`site/${slot}/video-${Date.now()}.${ext}`, file);
}
