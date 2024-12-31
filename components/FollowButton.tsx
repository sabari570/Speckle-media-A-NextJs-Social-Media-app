"use client";

import { useToast } from "@/hooks/use-toast";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button } from "./ui/button";
import ky from "ky";

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();

  // Query client is imported inorder to perform optimistic updates later when the follow button is pressed
  const queryClient = useQueryClient();
  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ["follower-info", userId];

  // this is the mutation which calls the follow and unfollow api and performs optimistic updates
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? ky.delete(`/api/users/${userId}/followers`)
        : ky.post(`/api/users/${userId}/followers`),
    // The onMutate function is executed before the mutation function runs.
    // It allows you to optimistically update your UI to reflect the expected result of the mutation.
    onMutate: async () => {
      await queryClient.cancelQueries();
      // We are getting the data from the cache, which is the previous data
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      // We are setting the previousData with the new data inorder to obtain immediate updates on the UI
      // this is actually performing optimistic updates as soon as you click on the follow/unfollow button
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      // However, since optimistic updates happen before the mutation result is confirmed, there's always a risk that the mutation might fail (e.g., network error, server issue).
      // By returning the previous state, you're saving the current state of the data in the cache.
      // This ensures you have a fallback to restore the UI to its original state in case the mutation fails.
      return { previousState };
    },
    onError(error, variables, context) {
      // If an error occurs while contacting with the server we set the querydata with the previousState data
      // The previousState is returned from onMutate and made available in the context object of the onError callback.
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error("Error while follow/unfollow: ", error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again",
      });
    },
  });
  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}
