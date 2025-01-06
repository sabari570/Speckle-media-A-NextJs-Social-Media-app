import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostData, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

/**
 *
 * @param req
 * @param userId
 * @returns data that contains the posts and the nextCursor
 *
 * DESC: A GET API that returns the users posts in the user profile page
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;
    const { userId } = await params;
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: { userId },
      take: pageSize + 1,
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;
    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };
    return Response.json(data);
  } catch (error) {
    console.error("Error while fetching posts of user: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
