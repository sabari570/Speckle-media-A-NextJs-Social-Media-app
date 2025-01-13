import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostData } from "@/lib/types";
import { Metadata } from "next";
import React, { cache, Suspense } from "react";
import NotFound from "../../not-found";
import Posts from "@/components/posts/Posts";
import UserInfoSidebar from "./UserInfoSidebar";

interface PostDetailPageProps {
  params: { postId: string };
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) NotFound();

  return post;
});

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { postId } = await params;
  const { user } = await validateRequest();
  if (!user) return {};
  const postDetail = await getPost(postId, user.id);
  return {
    title: `${postDetail?.user.displayName}: ${postDetail?.content.slice(0, 20)}...`,
  };
}

export default async function Page({ params }: PostDetailPageProps) {
  const { postId } = await params;
  const { user } = await validateRequest();
  if (!user) {
    return (
      <div className="w-full">
        <p className="text-center text-destructive">
          You &apos;re not authorized to view this page
        </p>
      </div>
    );
  }
  const post = await getPost(postId, user.id);
  if (!post) return NotFound();
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Posts post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}
