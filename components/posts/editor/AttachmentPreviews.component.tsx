import React from "react";
import { Attachment } from "./useUploadAttachments";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  onRemoveAttachment: (filename: string) => void;
}

export default function AttachmentPreviews({
  attachments,
  onRemoveAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveAttachmentClick={() =>
            onRemoveAttachment(attachment.file.name)
          }
        />
      ))}
    </div>
  );
}

interface AttachmentPreview {
  attachment: Attachment;
  onRemoveAttachmentClick: () => void;
}

function AttachmentPreview({
  attachment: { file, mediaId, isUploading },
  onRemoveAttachmentClick,
}: AttachmentPreview) {
  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={URL.createObjectURL(file)}
          alt="attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          {/* This is how we add video and source of that video to a component */}
          <source src={URL.createObjectURL(file)} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-background/60"
          onClick={onRemoveAttachmentClick}
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
