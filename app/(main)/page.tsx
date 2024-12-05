import PostEditor from "@/components/posts/editor/PostEditor";
import React from "react";

export default function Home() {
  return (
    <main className="min-h-[100vh] w-full">
      <div className="px-3 py-5">
        <PostEditor />
      </div>
    </main>
  );
}
