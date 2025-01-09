import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import React, { useRef } from "react";

interface AttachmentButtonProps {
  onAttachmentsSelected: (files: File[]) => void;
  disabled: boolean;
}

export default function AttachmentButton({
  onAttachmentsSelected,
  disabled,
}: AttachmentButtonProps) {
  const attachmentFileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        disabled={disabled}
        className="text-primary hover:text-primary"
        onClick={() => attachmentFileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        multiple
        ref={attachmentFileInputRef}
        accept="image/*, video/*"
        className="sr-only hidden"
        onChange={(e) => {
          // e.target.files is of type FileList so we convert it to File[]
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            onAttachmentsSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}
