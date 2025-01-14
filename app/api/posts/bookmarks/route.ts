import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";
/**
 *
 * @param {NextRequest} req
 * @description This API is used to fetch the posts that are bookmarked with infintely paginated
 */
export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    console.log("Cursor: ", cursor);
    const pageSize = 10;
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const bookmarkedPosts = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        // From bookmarks we are including the posts that belongs to the user
        post: {
          include: getPostDataInclude(user.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      bookmarkedPosts.length > pageSize ? bookmarkedPosts[pageSize].id : null;
    const data: PostsPage = {
      // We are mapping only the posts details and excluding the details of bookmark
      posts: bookmarkedPosts
        .slice(0, pageSize)
        .map((bookmark) => bookmark.post),
      nextCursor,
    };
    return Response.json(data);
  } catch (error) {
    console.error("Error while fetching bookmarked posts: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
