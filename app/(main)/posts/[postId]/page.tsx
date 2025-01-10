import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { Metadata } from "next";
import React, { cache } from "react";
import NotFound from "../../not-found";

interface PostDetailPageProps {
  postId: string;
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  console.log("Post id obtained: ", postId);
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
  postId,
}: PostDetailPageProps): Promise<Metadata> {
  const { user } = await validateRequest();
  if (!user) return {};
  const postDetail = await getPost(postId, user.id);
  return {
    title: `${postDetail?.user.displayName}: ${postDetail?.content.slice(0, 20)}...`,
  };
}

export default async function Page({ postId }: PostDetailPageProps) {
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
  return <div>This is the post detail page</div>;
}
