import { Prisma } from "@prisma/client";

// This function is actually written to get the userData properties based on the userId given
export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        // We dont need the details of all followers, instead what we require is we only want to know whether the loggedInUser
        // is following the user or not for that we try to fetch the user follower where the followerId is same as the loggedInUser id ie. us
        followerId: loggedInUserId,
      },
      //   We Select only that follower id
      select: {
        followerId: true,
      },
    },
    // We return the total count of the followers of that user
    _count: {
      select: {
        Post: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

// This returns the return type of the getUserDataSelect function
// we place select here because we are using the getUserDataSelect function within the select key
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
  } satisfies Prisma.PostInclude; // The 'satisfies' keyword ensures that the postDataInclude is compatible with the Prisma.PostInclude type.
}

// Defining a TypeScript type `PostData` to represent the payload of a `Post` object when queried with the `postDataInclude` configuration.
// We place include as the key for the returnType because we use the getPostDataInclude in the include key
export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
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

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}
