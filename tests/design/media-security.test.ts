import { describe, expect, it } from "vitest";
import {
  ALLOWED_EXTENSIONS,
  assertSafeStoragePath,
  buildDesignStoragePath,
  detectFormatFromBuffer,
  sanitizeSvgContent,
  safeDisplayName,
} from "@/lib/design/media-security";

// PNG 1x1 transparent
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const SAFE_SVG = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="#2563eb"/></svg>',
  "utf8",
);

const EVIL_SVG = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
  "utf8",
);

describe("media-security", () => {
  it("whitelist les extensions autorisées", () => {
    expect(ALLOWED_EXTENSIONS.has("webp")).toBe(true);
    expect(ALLOWED_EXTENSIONS.has("exe")).toBe(false);
    expect(ALLOWED_EXTENSIONS.has("html")).toBe(false);
  });

  it("détecte PNG par magic bytes", () => {
    const detected = detectFormatFromBuffer(PNG_1X1);
    expect(detected?.mime).toBe("image/png");
    expect(detected?.extension).toBe("png");
  });

  it("détecte SVG par contenu", () => {
    const detected = detectFormatFromBuffer(SAFE_SVG);
    expect(detected?.mediaKind).toBe("svg");
  });

  it("rejette un SVG avec script", () => {
    const result = sanitizeSvgContent(EVIL_SVG.toString("utf8"));
    expect(result.ok).toBe(false);
  });

  it("accepte un SVG propre", () => {
    const result = sanitizeSvgContent(SAFE_SVG.toString("utf8"));
    expect(result.ok).toBe(true);
  });

  it("rejette les chemins Storage dangereux", () => {
    expect(() => assertSafeStoragePath("../secret.png")).toThrow();
    expect(() => assertSafeStoragePath("/abs/path.png")).toThrow();
    expect(() => assertSafeStoragePath("2025-08/uuid.png")).not.toThrow();
  });

  it("génère un chemin Storage avec UUID", () => {
    const storagePath = buildDesignStoragePath("webp");
    expect(storagePath).toMatch(/^\d{4}-\d{2}\/[0-9a-f-]+\.webp$/);
  });

  it("nettoie le nom affiché sans l'utiliser comme chemin", () => {
    expect(safeDisplayName("../../evil.exe")).not.toContain("..");
    expect(safeDisplayName("photo boutique.jpg")).toContain("photo");
  });

  it("retourne null pour un buffer inconnu", () => {
    expect(detectFormatFromBuffer(Buffer.from("not an image"))).toBeNull();
  });
});
