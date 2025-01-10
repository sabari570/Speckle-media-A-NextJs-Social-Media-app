import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

/**
 *
 * @param {req} Request
 * @description This API is executed by cron job once everyday to delete the orphaned media from the DB and also from uploadThing
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { message: "Invalid authorization header" },
        { status: 401 },
      );
    }
    // Finds all the medias that has the postId as null and that are created before 24 hours
    // We dont want to delete the posts that are fresh
    const unusedMedias = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    // Delete the files from uploadThing by extracting the key from url
    new UTApi().deleteFiles(
      unusedMedias.map((media) => media.url.split(`/f/`)[1]),
    );

    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedias.map((m) => m.id),
        },
      },
    });

    return new Response();
  } catch (error) {
    console.error("Error while deleting media from DB: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
