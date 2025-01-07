import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import UserPosts from "./UserPosts.component";
import Linkify from "@/components/Linkify";

interface ProfilePageProps {
  params: { userId: string };
}

/**
 *  This function is used inorder to get the user details from the database and what it does is
 * it caches the data such that each time you call this function it doesnt have to fetch the data from the database
 * it only fetches it from the database only when the entire website is reloaded again
 */
const getUser = cache(async (userId: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: {
        equals: userId,
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();
  return user;
});

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return {};

  const { userId } = await params;
  const user = await getUser(userId, loggedInUser.id);
  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function page({ params }: ProfilePageProps) {
  const { user: loggedInUser } = await validateRequest();
  const { userId } = await params;

  if (!loggedInUser) {
    return (
      <div className="w-full">
        <p className="text-center text-destructive">
          You &apos;re not authorized to view this page
        </p>
      </div>
    );
  }

  const user = await getUser(userId, loggedInUser.id);
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <div className="hidden w-1/2 md:block md:w-2/3">
        <TrendsSidebar />
      </div>
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="shadow-light h-fit w-full space-y-5 rounded-2xl bg-card p-5">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        classname="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span className="font-semibold">
              Posts: <span>{formatNumber(user._count.Post)}</span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit Profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words text-sm italic">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
