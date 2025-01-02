"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Posts from "@/components/posts/Posts";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import ky from "ky";
import { Loader2 } from "lucide-react";
import React from "react";

export default function FollowingFeed() {
  const {
    data,
    fetchNextPage,
    isFetching,
    isSuccess,
    isFetchingNextPage,
    hasNextPage,
    isPending,
    error,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following-feed"],
    queryFn: async ({ pageParam }) => {
      return ky
        .get(
          "api/posts/following-feed",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>();
    },
    initialPageParam: null as string | null,
    // The lastpage contains the api resonse in it thats how we extract the nextCursor from it
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((post) => post.posts) || [];

  if (isPending) {
    return <PostsLoadingSkeleton />;
  }

  if (isSuccess && !posts.length && !hasNextPage) {
    return (
      <p className="mt-5 text-center text-muted-foreground">
        No posts found. Start following someone to see their posts.
      </p>
    );
  }

  if (error) {
    return (
      <p className="mt-5 text-center text-destructive">
        An error occured while loading posts.
      </p>
    );
  }
  return (
    <InfiniteScrollContainer
      classname="spce-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Posts key={post.id} post={post} />
      ))}
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-3 animate-spin text-blue-700" />
      )}
    </InfiniteScrollContainer>
  );
}
