"use client";

// The useQuery is always written inside a client component and not a server component

import Posts from "@/components/posts/Posts";
import ky from "ky";
import { PostsPage } from "@/lib/types";
import {
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
  } = useInfiniteQuery({
    // These are the keys which is used to store this cache and also retrieve them
    queryKey: ["post-feed", "for-you"],

    // This is where we write which api should be called and the results of that API will be cached
    queryFn: async ({ pageParam }) => {
      return await ky
        .get(
          "api/posts/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>();
    },
    initialPageParam: null as string | null, // the initialPage param we send inorder to fetch the posts, it is the value of the pageParam inside the queryFn when passed initially

    // This is the function that sets the next pageParam inside the queryFn
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // The structure of data is in such a way that you have to extract the data like this: data?.pages[0].posts
  // But when you use flatMap you can loop through pages and then extract the pages it works similar to map,
  // but map returns a [Array(6)] which is not what we want we want Array(6) so we use flatMap
  const posts = data?.pages.flatMap((post) => post.posts);

  if (isPending) return <PostsLoadingSkeleton />;

  if (error)
    return (
      <p className="text-center text-destructive">
        "An error has occurred: " {error.message}
      </p>
    );
  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts?.map((post) => <Posts key={post.id} post={post} />)}
      {isFetchingNextPage && (
        <Loader2 className="mx-auto my-3 animate-spin text-blue-700" />
      )}
    </InfiniteScrollContainer>
  );
}
