import { useToast } from "@/hooks/use-toast";
import useBookmarkInfo from "@/hooks/useBookmarkInfo";
import { BookmarksInfo, PostsPage } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import ky from "ky";
import { Bookmark } from "lucide-react";
import React from "react";

interface BookmarksButtonProps {
  postId: string;
  initialState: BookmarksInfo;
}

export default function BookmarkButton({
  postId,
  initialState,
}: BookmarksButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmarks-info", postId];
  const { data } = useBookmarkInfo(postId, initialState);

  const mutation = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? ky.delete(`/api/posts/${postId}/bookmarks`)
        : ky.post(`/api/posts/${postId}/bookmarks`),
    onMutate: async () => {
      toast({
        variant: "default",
        description: `Post ${data.isBookmarkedByUser ? "removed from" : "added to"} bookmarks successfully`,
      });
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<BookmarksInfo>(queryKey);

      queryClient.setQueryData<BookmarksInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error("Error while bookmarking: ", error);
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
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}
