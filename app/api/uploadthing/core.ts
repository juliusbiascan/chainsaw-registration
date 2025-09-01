import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth();

      // Get the referer header to check if the request is coming from a public route
      const referer = req.headers.get('referer');
      const isPublicRoute = referer && (
        referer.includes('/equipments/registration') ||
        referer.includes('/equipments/verify-email') ||
        referer.includes('/equipments/verify-otp')
      );

      // If it's a public route, allow upload without authentication
      if (isPublicRoute) {
        return {
          userId: 'public',
          userEmail: 'public@example.com',
          isPublicUpload: true
        };
      }

      // For authenticated routes, require session
      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {
        userId: session.user.id,
        userEmail: session.user.email,
        isPublicUpload: false
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      console.log("Is public upload:", metadata.isPublicUpload);

      // Return a simple object to avoid callback errors
      return {
        uploadedBy: metadata.userId
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
