"use client";

import { PostData } from "@/lib/types";
import Link from "next/link";
import React from "react";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import PostMoreButton from "./PostMoreButton";
import { useSession } from "@/app/(main)/SessionProvider";

export default function Posts({ post }: { post: PostData }) {
  const { user } = useSession();
  return (
    // Here we use the group class to group the div such that only when we hover on the post div we should be able to see the postMoreButton
    // So in this case we provide a group class on to the post div and then inside the PostMoreButton we check if the group-hover then make it visible
    // Here instead of group we write group/more because we are making it unique, since we cant provide more than one group class for a div we actually
    // name it differently so that we can access it accordingly, now in future we will create another group class for likes&comment section so in that case
    // it should not cause any conflict thats why we use group-post & group-comment
    <article className="shadow-light group/more mt-3 space-y-3 rounded-2xl bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${post.userId}`}>
            <UserAvatar avatarUrl={post.user.avatarUrl} />
          </Link>
          <div>
            <Link
              href={`/users/${post.userId}`}
              className="block font-medium hover:underline"
            >
              {post.user.displayName}
            </Link>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(new Date(post.createdAt))}
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton
            // This is where we are using the group-hover/more class to add the opacity
            classname="opacity-0 transition-opacity group-hover/more:opacity-100"
            post={post}
          />
        )}
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}
