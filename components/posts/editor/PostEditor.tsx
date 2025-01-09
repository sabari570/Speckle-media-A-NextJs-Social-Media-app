"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";
import "./postEditor.styles.css";
import useCreatePostMutation from "./mutations";
import useUploadAttachments from "./useUploadAttachments";
import AttachmentButton from "./AttachmentButton.component";
import AttachmentPreviews from "./AttachmentPreviews.component";
import LoadingButton from "@/components/LoadingButton";
import { Loader2 } from "lucide-react";

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
        <div>
          <EditorContent
            editor={editor}
            className="text-md max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-secondary px-5 py-3"
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
