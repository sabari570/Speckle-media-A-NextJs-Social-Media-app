import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { MEDIA_TYPE } from "@prisma/client";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

async function handleMiddleware() {
  const { user } = await validateRequest();
  if (!user) throw new UploadThingError("Unauthorized");

  return { user };
}

export const fileRouter = {
  avatar: f({
    image: {
      maxFileSize: "512KB",
    },
  })
    .middleware(handleMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      // metaData contains the user details from the middleware
      const oldAvatarUrl = metadata.user.avatarUrl;

      if (oldAvatarUrl) {
        // Extract the key and delete the file
        const key = oldAvatarUrl.split(
          `/f/`,
        )[1];
        if (key) await new UTApi().deleteFiles(key);
      }

      // We replace the default provided url by uploadthing to our own app's url
      // Such that it stays unique and no one from outside can use the url to resize their image
      const newAvatarUrl = file.url;

      await prisma.user.update({
        where: {
          id: metadata.user.id,
        },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });

      return { avatarUrl: newAvatarUrl };
    }),
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "16MB", maxFileCount: 5 },
  })
    .middleware(handleMiddleware)
    .onUploadComplete(async ({ file }) => {
      // const newAttachmentUrl = file.url.replace(
      //   "/f/",
      //   `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      // );
      // console.log("New attachment url: ", newAttachmentUrl);
      const media = await prisma.media.create({
        data: {
          url: file.url,
          type: file.type.startsWith("image")
            ? MEDIA_TYPE.IMAGE
            : MEDIA_TYPE.VIDEO,
        },
      });
      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
