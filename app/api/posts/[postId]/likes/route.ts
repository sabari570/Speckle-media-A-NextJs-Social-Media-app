import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { LikesInfo } from "@/lib/types";

/**
 * Handles the GET request for like details of a post.
 *
 * API Endpoint: /api/posts/[postId]/likes
 * @param {Request} req
 * @param {string} postId
 * @description This API is used to fetch the likes info of a particular post
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
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }
    const data: LikesInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
    };
    return Response.json(data);
  } catch (error) {
    console.error("Error while fetching post like details: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles the POST request for liking a post.
 *
 * API Endpoint: /api/posts/[postId]/likes
 * @param {Request} req
 * @param {string} postId
 * @description This API is used to like a post
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
    await prisma.like.upsert({
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
    console.error("Error while liking a post: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles the DELETE request for unliking a post.
 *
 * API Endpoint: /api/posts/[postId]/likes
 * @param {Request} req
 * @param {string} postId
 * @description This API is used to unlike a post
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
    await prisma.like.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId,
      },
    });
    return new Response();
  } catch (error) {
    console.error("Error while unliking a post: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}