"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDatInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function createPost(input: string) {
  const { user } = await validateRequest();
  //   We throw this here in here without any catch inorder to make the end user realize that this opeartion
  // is not possible without a user being authenticated, because only authenticated are allowed to access this page
  // and perform this operation, if any unauthorzed used comes and tries to perform this operation it throws an error
  if (!user) throw new Error("Unauthorized");

  const { content } = createPostSchema.parse({ content: input });

  // Creating a post using transaction in prisma
  const newData = await prisma.$transaction(async (tx) => {
    return await tx.post.create({
      data: {
        content,
        userId: user.id,
      },
      include: postDatInclude,
    });
  });

  // We are returning the created post data
  return newData;
}
