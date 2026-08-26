import { describe, expect, it } from "vitest";
import { resolveImageMime } from "@/lib/uploads/resolve-image-mime";

// Minimal JPEG header (SOI + APP0 marker start)
const JPEG_HEADER = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);

function fakeFile(name: string, type: string, buffer: Buffer): File {
  return {
    name,
    type,
    size: buffer.length,
    arrayBuffer: async () =>
      buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
  } as File;
}

describe("resolveImageMime", () => {
  it("détecte JPEG via magic bytes même sans type navigateur", () => {
    const file = fakeFile("photo.jpg", "", JPEG_HEADER);
    expect(resolveImageMime(file, JPEG_HEADER)).toBe("image/jpeg");
  });

  it("accepte image/jpg déclaré par certains navigateurs", () => {
    const file = fakeFile("photo.jpg", "image/jpg", JPEG_HEADER);
    expect(resolveImageMime(file, JPEG_HEADER)).toBe("image/jpeg");
  });

  it("retombe sur l'extension si le type est vide", () => {
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    const file = fakeFile("capture.PNG", "", png);
    expect(resolveImageMime(file, png)).toBe("image/png");
  });
});
