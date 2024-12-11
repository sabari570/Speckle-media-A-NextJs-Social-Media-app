"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export default async function deletePost(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  if (!post) throw new Error("Post not found");

  if (post.userId !== user.id)
    throw new Error("Not allowed to perform this operation");

  const deletedPost = await prisma.$transaction(async (tx) => {
    return await tx.post.delete({
      where: { id },
    });
  });

  return deletedPost;
}
