import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarksInfo } from "@/lib/types";

/**
 * Handles the POST request for liking a post.
 *
 * API Endpoint: /api/posts/[postId]/bookmarks
 * @param {Request} req
 * @param {string} postId
 * @description This API is used to like a post
 */
export async function GET(
  req: Request,
  { params }: { params: { postId: string } },
) {
  try {
    const { postId } = await params;
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId,
        },
      },
    });
    const data: BookmarksInfo = {
      isBookmarkedByUser: !!bookmark,
    };
    return Response.json(data);
  } catch (error) {
    console.error("Error while fetching bookmark info: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles the POST request for bookmarking a post.
 *
 * API Endpoint: /api/posts/[postId]/bookmarks
 * @param {Request} req
 * @param {string} postId
 * @description This API is used to bookmark a post
 */
export async function POST(
  req: Request,
  { params }: { params: { postId: string } },
) {
  try {
    const { postId } = await params;
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.bookmark.upsert({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId,
        },
      },
      create: {
        userId: loggedInUser.id,
        postId,
      },
      update: {},
    });
    return new Response();
  } catch (error) {
    console.error("Error while bookmarking a post: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles the DELETE request for removing a post from bookmark.
 *
 * API Endpoint: /api/posts/[postId]/bookmarks
 * @param {Request} req
 * @param {string} postId
 * @description This API is used to remove a post from bookmark
 */
export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } },
) {
  try {
    const { postId } = await params;
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.bookmark.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId,
      },
    });
    return new Response();
  } catch (error) {
    console.error("Error while removing a post from bookmark: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
