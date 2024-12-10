// This is the API ROUTE FOR: /api/posts/for-you
// In NextJS this is how we create API endpoints

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDatInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

// This is te GET API endpoint we write GET in caps
export async function GET(req: NextRequest) {
  try {
    // This cursor indicates the id of the next post that is the 11th post, after displaying the first 10 posts
    // so that we can actually fetch the next 10 posts from the starting from the 11th postid
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: postDatInclude,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1, // totally fetches 11 posts so that we get the postid of the next posts we are about to fetch
      cursor: cursor ? { id: cursor } : undefined, //cursor indicates the postid of the next post from where we start fetching the next batch
    });

    // Sending the nextCursor that is the postId along with the response
    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;
    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error("Error while fetching posts: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
