import { createRouteHandler } from "uploadthing/next";
import { fileRouter } from "./core";

// This is where the API route handler for the uploadThing is present this is what gets hit
// via the fileRouter when we upload a file to the uploadThing to save the URL and return the newAvatarUrl
export const { GET, POST } = createRouteHandler({
  router: fileRouter,
});
