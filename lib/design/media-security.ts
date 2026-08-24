/**
 * Validation sécurisée des uploads média Design du site.
 *
 * - Whitelist extensions + MIME
 * - Vérification magic bytes (signature fichier)
 * - Limites taille / dimensions
 * - Noms aléatoires (jamais le nom utilisateur pour le chemin Storage)
 * - Blocage exécutables, HTML, JS
 * - Sanitization SVG stricte
 */

import { randomUUID } from "node:crypto";

import type { MediaUploadResult } from "@/types/design";

export const DESIGN_MEDIA_MAX_BYTES = 8 * 1024 * 1024;
export const DESIGN_MEDIA_MAX_WIDTH = 4096;
export const DESIGN_MEDIA_MAX_HEIGHT = 4096;

/** Extensions autorisées (whitelist). */
export const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "gif",
  "svg",
]);

/** MIME autorisés (whitelist). */
export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

/** MIME interdits — exécutables, contenu actif. */
const BLOCKED_MIME_PREFIXES = [
  "text/html",
  "application/javascript",
  "text/javascript",
  "application/x-msdownload",
  "application/x-sh",
  "application/x-php",
  "application/octet-stream",
];

type DetectedFormat = {
  mime: string;
  extension: string;
  mediaKind: "image" | "svg" | "animated";
};

function readAscii(buffer: Buffer, start: number, len: number): string {
  return buffer.subarray(start, start + len).toString("ascii");
}

/** Détection par magic bytes — ne jamais se fier à l'extension seule. */
export function detectFormatFromBuffer(buffer: Buffer): DetectedFormat | null {
  if (buffer.length < 12) return null;

  // SVG (texte)
  const head = buffer.subarray(0, 256).toString("utf8").trimStart();
  if (head.startsWith("<?xml") || head.startsWith("<svg") || head.includes("<svg")) {
    return { mime: "image/svg+xml", extension: "svg", mediaKind: "svg" };
  }

  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", extension: "jpg", mediaKind: "image" };
  }

  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { mime: "image/png", extension: "png", mediaKind: "image" };
  }

  // GIF
  if (readAscii(buffer, 0, 6) === "GIF87a" || readAscii(buffer, 0, 6) === "GIF89a") {
    return { mime: "image/gif", extension: "gif", mediaKind: "animated" };
  }

  // WebP: RIFF....WEBP
  if (
    readAscii(buffer, 0, 4) === "RIFF" &&
    readAscii(buffer, 8, 4) === "WEBP"
  ) {
    return { mime: "image/webp", extension: "webp", mediaKind: "image" };
  }

  // AVIF: ....ftypavif / ftypmif1
  if (readAscii(buffer, 4, 4) === "ftyp") {
    const brand = readAscii(buffer, 8, 8);
    if (brand.includes("avif") || brand.includes("avis")) {
      return { mime: "image/avif", extension: "avif", mediaKind: "image" };
    }
  }

  return null;
}

function extensionFromName(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? name;
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function parseImageDimensions(
  buffer: Buffer,
  format: DetectedFormat,
): { width: number | null; height: number | null } {
  try {
    if (format.extension === "png" && buffer.length >= 24) {
      return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
      };
    }
    if (format.extension === "gif" && buffer.length >= 10) {
      return {
        width: buffer.readUInt16LE(6),
        height: buffer.readUInt16LE(8),
      };
    }
    if (format.extension === "jpg") {
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        const length = buffer.readUInt16BE(offset + 2);
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8) {
          return {
            height: buffer.readUInt16BE(offset + 5),
            width: buffer.readUInt16BE(offset + 7),
          };
        }
        offset += 2 + length;
      }
    }
  } catch {
    /* dimensions optionnelles si parsing échoue */
  }
  return { width: null, height: null };
}

const SVG_DANGEROUS =
  /<script\b|on\w+\s*=|javascript:|data:text\/html|<foreignObject\b|<iframe\b|<embed\b|<object\b/i;

/** Sanitization SVG stricte — rejette les contenus actifs. */
export function sanitizeSvgContent(text: string): { ok: true; content: string } | { ok: false; reason: string } {
  if (SVG_DANGEROUS.test(text)) {
    return { ok: false, reason: "Le fichier SVG contient du contenu non autorisé." };
  }
  const stripped = text
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .trim();
  if (!/^<svg[\s>]/i.test(stripped)) {
    return { ok: false, reason: "Fichier SVG invalide." };
  }
  return { ok: true, content: stripped };
}

export type MediaValidationError = { code: string; message: string };

export type ValidatedMedia = {
  buffer: Buffer;
  detected: DetectedFormat;
  width: number | null;
  height: number | null;
  sanitizedSvg?: string;
};

/**
 * Valide un fichier uploadé avant envoi Storage.
 * Ne fait jamais confiance au nom ni au type déclaré par le navigateur.
 */
export function validateDesignMediaUpload(
  file: File,
  buffer: Buffer,
): { ok: true; data: ValidatedMedia } | { ok: false; error: MediaValidationError } {
  if (file.size <= 0 || buffer.length === 0) {
    return { ok: false, error: { code: "empty", message: "Fichier vide." } };
  }

  if (file.size > DESIGN_MEDIA_MAX_BYTES || buffer.length > DESIGN_MEDIA_MAX_BYTES) {
    return {
      ok: false,
      error: { code: "too_large", message: "Fichier trop volumineux (max 8 Mo)." },
    };
  }

  const declaredMime = (file.type || "").toLowerCase().split(";")[0]!.trim();
  if (declaredMime && BLOCKED_MIME_PREFIXES.some((p) => declaredMime.startsWith(p))) {
    return { ok: false, error: { code: "blocked", message: "Type de fichier interdit." } };
  }

  const ext = extensionFromName(file.name);
  if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
    return { ok: false, error: { code: "extension", message: "Extension non autorisée." } };
  }

  const detected = detectFormatFromBuffer(buffer);
  if (!detected) {
    return {
      ok: false,
      error: { code: "signature", message: "Format non reconnu ou fichier corrompu." },
    };
  }

  if (!ALLOWED_MIME_TYPES.has(detected.mime)) {
    return { ok: false, error: { code: "mime", message: "Type MIME non autorisé." } };
  }

  if (declaredMime && declaredMime !== detected.mime && declaredMime !== "application/octet-stream") {
    return {
      ok: false,
      error: { code: "mime_mismatch", message: "Le type déclaré ne correspond pas au fichier." },
    };
  }

  if (ext && ext !== detected.extension && !(ext === "jpeg" && detected.extension === "jpg")) {
    return {
      ok: false,
      error: { code: "ext_mismatch", message: "L'extension ne correspond pas au contenu." },
    };
  }

  let sanitizedSvg: string | undefined;
  if (detected.mediaKind === "svg") {
    const svgText = buffer.toString("utf8");
    const sanitized = sanitizeSvgContent(svgText);
    if (!sanitized.ok) {
      return { ok: false, error: { code: "svg", message: sanitized.reason } };
    }
    sanitizedSvg = sanitized.content;
  }

  const { width, height } = parseImageDimensions(buffer, detected);
  if (width && width > DESIGN_MEDIA_MAX_WIDTH) {
    return { ok: false, error: { code: "dimensions", message: "Largeur d'image excessive." } };
  }
  if (height && height > DESIGN_MEDIA_MAX_HEIGHT) {
    return { ok: false, error: { code: "dimensions", message: "Hauteur d'image excessive." } };
  }

  return {
    ok: true,
    data: { buffer: sanitizedSvg ? Buffer.from(sanitizedSvg, "utf8") : buffer, detected, width, height, sanitizedSvg },
  };
}

/** Chemin Storage sécurisé — UUID aléatoire, anti path traversal. */
export function buildDesignStoragePath(extension: string): string {
  const safeExt = extension.replace(/[^a-z0-9]/g, "").slice(0, 8) || "bin";
  if (!ALLOWED_EXTENSIONS.has(safeExt) && safeExt !== "jpg") {
    throw new Error("Extension refusée pour le chemin Storage.");
  }
  const folder = new Date().toISOString().slice(0, 7); // YYYY-MM
  return `${folder}/${randomUUID()}.${safeExt}`;
}

/** Empêche path traversal lors des suppressions. */
export function assertSafeStoragePath(path: string): void {
  const normalized = path.replace(/\\/g, "/").trim();
  if (
    !normalized ||
    normalized.includes("..") ||
    normalized.startsWith("/") ||
    /^[a-z]+:\/\//i.test(normalized)
  ) {
    throw new Error("Chemin Storage invalide.");
  }
  if (!/^[a-z0-9./_-]+$/i.test(normalized)) {
    throw new Error("Caractères non autorisés dans le chemin Storage.");
  }
}

/** Nom affiché dérivé du fichier original — jamais utilisé comme chemin. */
export function safeDisplayName(originalName: string): string {
  const base = originalName.split(/[/\\]/).pop() ?? "media";
  return base.replace(/[^\w.\- àâäéèêëïîôùûüç]/gi, "").slice(0, 120) || "media";
}

export function toMediaUploadResult(args: {
  mediaId: string;
  publicUrl: string;
  storagePath: string;
  detected: DetectedFormat;
  width: number | null;
  height: number | null;
  sizeBytes: number;
}): MediaUploadResult {
  return {
    mediaId: args.mediaId,
    publicUrl: args.publicUrl,
    storagePath: args.storagePath,
    mimeType: args.detected.mime,
    extension: args.detected.extension,
    width: args.width,
    height: args.height,
    sizeBytes: args.sizeBytes,
    mediaKind: args.detected.mediaKind,
  };
}
