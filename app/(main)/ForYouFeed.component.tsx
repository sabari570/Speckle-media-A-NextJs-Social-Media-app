"use client";

// The useQuery is always written inside a client component and not a server component

import Posts from "@/components/posts/Posts";
import kyInstance from "@/lib/ky";
import ky from "ky";
import { PostData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

export default function ForYouFeed() {
  const { isPending, error, data } = useQuery<PostData[]>({
    // These are the keys which is used to store this cache and also retrieve them
    queryKey: ["post-feed", "for-you"],

    // This is where we write which api should be called and the results of that API will be cached
    queryFn: async () => await ky.get("api/posts/for-you").json<PostData[]>(),
  });

  if (isPending) return <Loader2 className="mx-auto my-3 animate-spin" />;

  if (error)
    return (
      <p className="text-center text-destructive">
        "An error has occurred: " {error.message}
      </p>
    );
  return (
    <>
      {data.map((post: PostData) => (
        <Posts key={post.id} post={post} />
      ))}
    </>
  );
}
