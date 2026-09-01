import Image from "next/image";
import { IMAGE_DISPLAY_QUALITY, IMAGE_FIT_CONTAIN, IMAGE_FIT_COVER, IMAGE_FRAME_BG } from "@/lib/image-display";
import { cn } from "@/lib/utils";

type PlacementImageProps = {
  imageUrl?: string;
  altText?: string;
  overlayOpacity?: number;
  imagePosition?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** contain = image entière (défaut) ; cover = remplissage avec recadrage */
  fit?: "contain" | "cover";
};

export function PlacementImage({
  imageUrl,
  altText = "",
  overlayOpacity = 0.45,
  imagePosition = "center",
  className,
  priority,
  sizes = "100vw",
  fit = "contain",
}: PlacementImageProps) {
  if (!imageUrl) return null;

  return (
    <div className={cn("relative overflow-hidden", IMAGE_FRAME_BG, className)}>
      <Image
        src={imageUrl}
        alt={altText}
        fill
        priority={priority}
        sizes={sizes}
        quality={IMAGE_DISPLAY_QUALITY}
        className={fit === "cover" ? IMAGE_FIT_COVER : IMAGE_FIT_CONTAIN}
        style={{ objectPosition: imagePosition }}
        unoptimized={imageUrl.endsWith(".gif")}
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
        aria-hidden
      />
    </div>
  );
}
