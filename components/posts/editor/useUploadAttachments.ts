import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export default function useUploadAttachments() {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      // This function takes all the files that needs to be uploaded and then renames the filenames according to our needs and then returns
      // the modified file names
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop(); //pop - removes the last element of the array
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          },
        );
      });

      // After changing the filenames we actually set the attachments based on this
      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({
          file,
          isUploading: true,
        })),
      ]);
      return renamedFiles;
    },
    // This sets the uploadProgress number in %
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      // Here res will have the result of the files that have been successfully uploaded to the uploadThing
      // and the database, res will have the same filenames as we modified it earlier before uploading
      // hence we can track the files based on the filenames, so this functions actually sets the attachments with its correct mediaId
      // and then also changes the isUploading to false
      setAttachments((prev) =>
        prev.map((attachment) => {
          // here we check whether the previous attachment is present in the files that are uploaded successfully
          const uploadedFile = res.find((r) => r.name === attachment.file.name);
          if (!uploadedFile) return attachment;
          return {
            ...attachment,
            mediaId: uploadedFile.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        description: e.message,
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload to finish",
      });
      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload up to 5 attachments per post",
      });
      return;
    }

    startUpload(files);
  }

  function removeAttachment(filename: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name != filename));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    handleStartUpload,
    removeAttachment,
    reset,
    attachments,
    isUploading,
    uploadProgress,
  };
}
