import { cn } from "@/lib/utils";
import { Media, MEDIA_TYPE } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface MediaPreviewsProps {
  medias: Media[];
}

interface MediaPreviewProps {
  media: Media;
}

export default function MediaPreviews({ medias }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        medias.length > 1 && "sm:grid sm:grid-cols-2 sm:gap-3",
      )}
    >
      {medias.map((media) => (
        <MediaPreview key={media.id} media={media} />
      ))}
    </div>
  );
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === MEDIA_TYPE.IMAGE) {
    return (
      <Image
        src={media.url}
        alt="Media preview"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  } else if (media.type === MEDIA_TYPE.VIDEO) {
    return (
      <div>
        <video controls className="mx-auto size-fit max-h-[30rem] rounded-2xl">
          <source src={media.url} />
        </video>
      </div>
    );
  }
  return <p className="text-center text-destructive">Unsupported media type</p>;
}
