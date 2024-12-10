import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import React from "react";
import ForYouFeed from "./ForYouFeed.component";

export default async function Home() {
  return (
    <main className="m-win-0 flex w-full gap-5">
      <div className="w-full px-3 py-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <div className="hidden w-1/2 md:block md:w-2/3">
        <TrendsSidebar />
      </div>
    </main>
  );
}
