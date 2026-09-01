"use client";

import Image from "next/image";
import type { DesignMediaRow } from "@/types/database";
import { IMAGE_DISPLAY_QUALITY, IMAGE_FIT_CONTAIN } from "@/lib/image-display";
import { cn } from "@/lib/utils";

export function MediaThumbnail({
  media,
  className,
  sizes = "200px",
  priority,
}: {
  media: Pick<DesignMediaRow, "public_url" | "display_name" | "alt_text" | "media_kind" | "mime_type">;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const alt = media.alt_text?.trim() || media.display_name;

  if (media.media_kind === "svg") {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[color:var(--color-surface-muted)] p-4",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media.public_url} alt={alt} className="max-h-full max-w-full object-contain" />
      </div>
    );
  }

  return (
    <Image
      src={media.public_url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={IMAGE_DISPLAY_QUALITY}
      className={cn(IMAGE_FIT_CONTAIN, className)}
      unoptimized={media.media_kind === "animated"}
    />
  );
}
