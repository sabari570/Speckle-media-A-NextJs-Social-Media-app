import { useToast } from "@/hooks/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import deletePost from "./actions";
import { PostsPage } from "@/lib/types";

export default function useDeletePostMutation() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess(deletedPost) {
      // Here we target only the cache that has post-feed key in it such that once we delete the post inside the post-feed cache
      // I want it to reflect everywhere where we are using that same cache data
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        },
      );

      toast({
        variant: "success",
        description: "Post deleted successfully",
      });

      //   If we are in the post detail page we must navigate to the homepage after successfull deletion
      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/`);
      }
    },
    onError(error) {
      console.error("Error in deletePostMuation: ", error);
      toast({
        variant: "destructive",
        description: "Failed to delete post. Please try again.",
      });
    },
  });

  return mutation;
}
