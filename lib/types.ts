import { Prisma } from "@prisma/client";

export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

// Defining an object `postDataInclude` to specify the related data to include when querying the `Post` model.
export const postDatInclude = {
  user: {
    select: userDataSelect,
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

// This is defined inorder to solve the type issue for the BigInt.prototype.toJSON
declare global {
  interface BigInt {
    toJSON: () => Number;
  }
}

// The type of this is defined and declared globally inside the types.ts file
// This is inorder to solve the serialization of the bigint issue
// Through this statement instead of using the default JSON.stringify to convert the bigint it uses
// Number to convert it into number
BigInt.prototype.toJSON = function () {
  return Number(this);
};

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}
