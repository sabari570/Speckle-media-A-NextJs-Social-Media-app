"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";
import "./postEditor.styles.css";
import { createPost } from "./actions";
import useCreatePostMutation from "./mutations";

export default function PostEditor() {
  const { user } = useSession();
  const mutation = useCreatePostMutation();

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
    mutation.mutate(input, {
      onSuccess: () => {
        // Inorder to clear the input after submission
        editor?.commands.clearContent();
      },
    });
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
        <div className="flex items-center justify-end">
          <Button
            onClick={onSubmit}
            className="min-w-28 px-7 py-3"
            disabled={!input.trim()}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
