import Image from "next/image";
import { cn } from "@/lib/utils";

type PlacementImageProps = {
  imageUrl?: string;
  altText?: string;
  overlayOpacity?: number;
  imagePosition?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function PlacementImage({
  imageUrl,
  altText = "",
  overlayOpacity = 0.45,
  imagePosition = "center",
  className,
  priority,
  sizes = "100vw",
}: PlacementImageProps) {
  if (!imageUrl) return null;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={imageUrl}
        alt={altText}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
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
