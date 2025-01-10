"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import React, { ClipboardEvent } from "react";
import "./postEditor.styles.css";
import useCreatePostMutation from "./mutations";
import useUploadAttachments from "./useUploadAttachments";
import AttachmentButton from "./AttachmentButton.component";
import AttachmentPreviews from "./AttachmentPreviews.component";
import LoadingButton from "@/components/LoadingButton";
import { Loader2 } from "lucide-react";
import { useDropzone } from "@uploadthing/react";
import { cn } from "@/lib/utils";

export default function PostEditor() {
  const { user } = useSession();
  const mutation = useCreatePostMutation();
  const {
    handleStartUpload,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetAttachments,
    attachments,
  } = useUploadAttachments();

  // useDropzone can be used for dragging and dropping files into the input field for uploading them
  // getRootProps - this is given to the input field where we want to allow the drag and drop to happen
  // getInputProps - this is required inorder to attain the functionality of opening the files when clicking on the input
  // basically it does the functionality of <input type='file' />
  // isDragActive - this is needed for styling through which we can actually style the input div when dragging and dropping
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleStartUpload,
  });

  // Here we remove the onClick prop from getRootProps because if we keep it once we click on the input field it will
  // open the files to input them, since we already created a seperate button for uploading and selecting the files we can
  // ignore the onClick and keep the rest of the props
  const { onClick, ...rootProps } = getRootProps();

  // This function handles to upload an image when an image address is pasted on to the input field
  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    // Convertes the clipboard items to an array
    const pastedFiles = Array.from(e.clipboardData.items);

    // Checks and filters only those files whose file kind is 'file' and then converts them
    // to file type and then uploads it to uploadThing
    const filesToUpload = pastedFiles
      .filter((pastedFile) => pastedFile.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    handleStartUpload(filesToUpload);
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      // Inorder to see this placeholder we need to setup some style.css for this component
      Placeholder.configure({
        placeholder: "What's on your mind? 💭",
      }),
    ],
    immediatelyRender: false,
  });

  // This handles when new lines are added to the editor
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  async function onSubmit() {
    // This is how we call the mutationFn from the useMutation object returned
    // and the passed input will be given to the createPost function provided
    // the mutation object given by the useMutation hook also has an onSucess callback which can be used to perform
    // some action that we need to perform after successfull execution
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          // Inorder to clear the input after submission
          editor?.commands.clearContent();
          resetAttachments();
        },
      },
    );
  }

  return (
    <div className="flex gap-5 rounded-2xl bg-card px-5 py-5">
      <UserAvatar avatarUrl={user.avatarUrl} />
      <div className="flex w-full flex-col flex-wrap gap-3">
        <div {...rootProps}>
          <input {...getInputProps()} />
          <EditorContent
            editor={editor}
            onPaste={onPaste}
            className={cn(
              "text-md max-h-[20rem] w-full max-w-[25rem] overflow-y-auto break-normal break-words rounded-2xl bg-secondary px-5 py-3",
              isDragActive && "outline-dashed",
            )}
          />
        </div>
        {!!attachments.length && (
          <AttachmentPreviews
            attachments={attachments}
            onRemoveAttachment={removeAttachment}
          />
        )}
        <div className="flex items-center justify-end gap-5">
          {isUploading && (
            <>
              <span className="text-sm">{uploadProgress ?? 0}%</span>
              <Loader2 className="size-5 animate-spin text-primary" />
            </>
          )}
          <AttachmentButton
            onAttachmentsSelected={handleStartUpload}
            disabled={isUploading || attachments.length >= 5}
          />
          <LoadingButton
            loading={mutation.isPending}
            onClick={onSubmit}
            className="min-w-28 px-7 py-3"
            disabled={!input.trim()}
          >
            Post
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
