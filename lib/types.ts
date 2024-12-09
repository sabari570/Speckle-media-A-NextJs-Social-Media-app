import { Prisma } from "@prisma/client";

// Defining an object `postDataInclude` to specify the related data to include when querying the `Post` model.
export const postDatInclude = {
  user: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.PostInclude;
// The 'satisfies' keyword ensures that the postDataInclude is compatible with the Prisma.PostInclude type.

// Defining a TypeScript type `PostData` to represent the payload of a `Post` object when queried with the `postDataInclude` configuration.
export type PostData = Prisma.PostGetPayload<{
  include: typeof postDatInclude;
}>;

// Summary:
// - `postDataInclude` is used to define what related data to include in a Prisma query for the `Post` model.
// - The `satisfies` keyword ensures that `postDataInclude` is compatible with the `Prisma.PostInclude` type, providing type safety.
// - The `PostData` type is created to define the shape of the data returned when querying the `Post` model with the `postDataInclude` configuration.
