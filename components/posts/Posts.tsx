"use client";

import { PostData } from "@/lib/types";
import Link from "next/link";
import React, { use } from "react";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import PostMoreButton from "./PostMoreButton";
import { useSession } from "@/app/(main)/SessionProvider";
import Linkify from "../Linkify";
import UserToolTip from "../UserToolTip";
import MediaPreviews from "../MediaPreview";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";

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
          <UserToolTip user={post.user}>
            <Link href={`/users/${post.userId}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserToolTip>
          <div>
            <UserToolTip user={post.user}>
              <Link
                href={`/users/${post.userId}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserToolTip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              // We add 'suppressHydrationWarning' because this cause an hydration error i.e when you create a fresh post and navigate to the post details page
              // the post that is rendered in the server is 2 seconds ago and when that is rendered in the client-side it is 2 seconds ago which cause this error
              // this happens in the formatRelativeDate() fn so to avoid this error we supress that warning
              suppressHydrationWarning
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
      <Linkify>
        <div className="whitespace-pre-line break-words break-all">
          {post.content}
        </div>
      </Linkify>
      {!!post.attachments.length && <MediaPreviews medias={post.attachments} />}
      <hr />
      <div className="flex items-center justify-between">
        <LikeButton
          postId={post.id}
          initialState={{
            likes: post._count.likes,
            isLikedByUser: post.likes.some((like) => like.userId === user.id),
          }}
        />
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
    </article>
  );
}
