"use client";

import { useToast } from "@/hooks/use-toast";
import useLikeInfo from "@/hooks/useLikeInfo";
import { LikesInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { Heart } from "lucide-react";
import React, { useEffect } from "react";

interface LikeButtonProps {
  postId: string;
  initialState: LikesInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const { toast } = useToast();
  const { data } = useLikeInfo(postId, initialState);
  const queryKey: QueryKey = ["likes-info", postId];
  const queryClient = useQueryClient();

  // This is done inorder to set the queryData when their is change in the DB so that instead of invalidating the query,
  // and refetching the data we set the querydata with the fresh data obtained from the backend
  useEffect(() => {
    queryClient.setQueryData(queryKey, initialState);
  }, [initialState, postId, queryClient]);

  const mutation = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? ky.delete(`/api/posts/${postId}/likes`)
        : ky.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries();

      const previousState = queryClient.getQueryData<LikesInfo>(queryKey);
      queryClient.setQueryData<LikesInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) +
          (previousState?.isLikedByUser ? -1 : +1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error("Error while liking/unliking a post: ", error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again",
      });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className="flex items-center gap-2"
    >
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span>
        {data.likes}{" "}
        <span className="hidden sm:inline">
          {data.likes > 1 ? "likes" : "like"}
        </span>
      </span>
    </button>
  );
}
