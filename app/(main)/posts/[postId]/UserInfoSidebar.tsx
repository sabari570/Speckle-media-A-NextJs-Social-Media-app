import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import Linkify from "@/components/Linkify";
import UserAvatar from "@/components/UserAvatar";
import UserToolTip from "@/components/UserToolTip";
import { UserData } from "@/lib/types";
import Link from "next/link";
import React from "react";

interface UsetInfoSidebarProps {
  user: UserData;
}

export default async function UserInfoSidebar({ user }: UsetInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return;
  return (
    <div className="shadow-light space-y-5 rounded-2xl bg-card p-5">
      <div className="text-xl font-bold">About this user</div>
      <UserToolTip user={user}>
        <Link href={`/users/${user.id}`} className="flex items-center gap-3">
          <UserAvatar avatarUrl={user.avatarUrl} classname="flex-none" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-sm text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserToolTip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words italic text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
}
