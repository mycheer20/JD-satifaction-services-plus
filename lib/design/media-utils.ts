import {
  ALLOWED_EXTENSIONS,
  DESIGN_MEDIA_MAX_BYTES,
  DESIGN_MEDIA_MAX_HEIGHT,
  DESIGN_MEDIA_MAX_WIDTH,
} from "@/lib/design/media-security";

export function formatMediaBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function formatMediaDimensions(width: number | null, height: number | null): string {
  if (!width || !height) return "—";
  return `${width} × ${height} px`;
}

export const MEDIA_UPLOAD_HINT = {
  formats: [...ALLOWED_EXTENSIONS].map((e) => e.toUpperCase()).join(", "),
  maxSize: formatMediaBytes(DESIGN_MEDIA_MAX_BYTES),
  maxDimensions: `${DESIGN_MEDIA_MAX_WIDTH} × ${DESIGN_MEDIA_MAX_HEIGHT} px max`,
  accept: "image/jpeg,image/jpg,image/png,image/webp,image/avif,image/gif,image/svg+xml,.jpg,.jpeg",
} as const;

export const MEDIA_KIND_LABELS: Record<"image" | "svg" | "animated", string> = {
  image: "Image",
  svg: "SVG",
  animated: "Animé",
};
