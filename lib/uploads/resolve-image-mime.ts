import { detectFormatFromBuffer } from "@/lib/design/media-security";

const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MIME_ALIASES: Record<string, string> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
};

function mimeFromExtension(name: string): string | null {
  const ext = name.split(/[/\\]/).pop()?.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return null;
  }
}

/**
 * Détermine le MIME d'une image de façon fiable (magic bytes > type navigateur > extension).
 * Certains navigateurs / appareils envoient un type vide ou `image/jpg` pour les JPEG.
 */
export function resolveImageMime(file: File, buffer: Buffer): string | null {
  const detected = detectFormatFromBuffer(buffer);
  if (detected && ALLOWED_IMAGE_MIMES.has(detected.mime)) {
    return detected.mime;
  }

  const declared = (file.type || "").toLowerCase().split(";")[0]!.trim();
  const normalized = MIME_ALIASES[declared] ?? declared;
  if (normalized && ALLOWED_IMAGE_MIMES.has(normalized)) {
    return normalized;
  }

  const fromExt = mimeFromExtension(file.name);
  if (fromExt && ALLOWED_IMAGE_MIMES.has(fromExt)) {
    return fromExt;
  }

  return null;
}
