import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";

/**
 * Handles the GET request for follower details of an user.
 *
 * API Endpoint: /api/users/[userId]/followers
 * @param {req} Request
 * @param {postId} postId
 * @description This API is used to fetch the follower info of a particular user
 */
export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = await params;
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        // followers: All the users that follow the userId (In params)
        followers: {
          where: {
            // We dont need the details of all followers, insteas what we require is we only want to know whether the loggedInUser
            // is following the user or not for that we try to fetch the user follower where the followerId is same as the loggedInUser id ie. us
            followerId: loggedInUser.id,
          },
          //   We Select only that follower id
          select: {
            followerId: true,
          },
        },
        // We return the total count of the followers of that user
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    const data: FollowerInfo = {
      isFollowedByUser: !!user.followers.length, // if we are a follower to that user we get back a list of followerId(our userId) else we get back an empty list
      followers: user._count.followers,
    };
    return Response.json(data);
  } catch (error) {
    console.error("Error while fetching user follower details: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles the POST request for following a user.
 *
 * API Endpoint: /api/users/[userId]/followers
 *
 * Description:
 * This endpoint is triggered when a user clicks the "Follow" button.
 * It ensures the user is authenticated and either creates or updates the follow relationship.
 *
 * @param req - The HTTP request object.
 * @param userId - Contains route parameters, that is the userId.
 * @returns A response indicating the success or failure of the operation.
 */
export async function POST(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = await params;
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    // upsert -> First checks if the record is present, if yes then it updates else it creates
    await prisma.follow.upsert({
      where: {
        // A unique key to identify the records uniquely
        followerId_followingId: {
          followerId: loggedInUser.id, // Since we are the follower when we click on the follow button
          followingId: userId, // Since this is the person we are following
        },
      },
      create: {
        followerId: loggedInUser.id,
        followingId: userId,
      },
      //   If the data is already present then dont perforn anything
      update: {},
    });
    return new Response();
  } catch (error) {
    console.error("Error while following the user: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles the DELETE request for following a user.
 *
 * API Endpoint: /api/users/[userId]/followers
 *
 * Description:
 * This endpoint is triggered when a user clicks the "Unfollow" button.
 * It ensures the user is authenticated and deletes the follow relationship.
 *
 * @param req - The HTTP request object.
 * @param userId - Contains route parameters, that is the userId.
 * @returns A response indicating the success or failure of the operation.
 */
export async function DELETE(
  reg: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = await params;
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // deleteMany -> * It is most commonly used with the upsert operation
    //               * and also the deleteMany doesnt throw an error if the record is not found it silently completes the execution
    await prisma.follow.deleteMany({
      where: {
        followerId: loggedInUser.id,
        followingId: userId,
      },
    });
    return new Response();
  } catch (error) {
    console.error("Error while unfollowing the user: ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
