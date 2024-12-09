import PostEditor from "@/components/posts/editor/PostEditor";
import Posts from "@/components/posts/Posts";
import TrendsSidebar from "@/components/TrendsSidebar";
import prisma from "@/lib/prisma";
import { PostData, postDatInclude } from "@/lib/types";
import React from "react";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: postDatInclude,
  });
  return (
    <main className="m-win-0 flex h-[200vh] w-full gap-5">
      <div className="w-full px-3 py-5">
        <PostEditor />
        {posts.map((post: PostData, index: number) => (
          <Posts key={index} post={post} />
        ))}
      </div>
      <div className="w-1/2">
        <TrendsSidebar />
      </div>
    </main>
  );
}
