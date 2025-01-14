"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Posts from "@/components/posts/Posts";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import ky from "ky";
import { Loader2 } from "lucide-react";
import React from "react";

export default function BookmarkedPosts() {
  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isPending,
    error,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "bookmarked"],
    queryFn: async ({ pageParam }) => {
      return await ky
        .get(
          `api/posts/bookmarks`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const posts = data?.pages.flatMap((page) => page.posts);
  if (isPending) return <PostsLoadingSkeleton />;

  if (error) {
    return (
      <p className="text-center text-destructive">
        "An error has occurred: " {error.message}
      </p>
    );
  }

  if (status === "success" && !posts?.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any bookmarks yet
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => !isFetching && hasNextPage && fetchNextPage()}
    >
      {posts?.map((post) => <Posts post={post} key={post.id} />)}
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-3 animate-spin text-blue-700" />
      )}
    </InfiniteScrollContainer>
  );
}
