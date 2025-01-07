import { useToast } from "@/hooks/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createPost } from "./actions";
import { PostsPage } from "@/lib/types";
import { useSession } from "@/app/(main)/SessionProvider";

export default function useCreatePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: async (newPost) => {
      // * First we need to cancel any ongoing queries.
      // * then we need to set the queriesData by already persisting the fetched and cached data
      //      => and adding the recently created post to the top of the list of the first page
      //        => so that we immediately populate the cache and show it in the frontend improving user experience
      //          => instead if we invalidate the existing cache and re-fetch the entire posts again that can cause slow loading and bad user experience
      // * Next if we dont have any posts fetched and we already created a new post then we have to invalidate the cache and then refetch the posts feed again

      const queryFilter = {
        // Now we invalidate and setQueries only for post-feed
        queryKey: ["post-feed"],
        // This written to actually tell the react query to when to revalidate the query, which means we need to revalidate the query
        // When their is change in the 'post-feed' or 'post-feed' & 'for-you' or 'post-feed', 'user-posts' and userId
        // This is why the predicate is used if it returns true then we revalidate
        // In DELETING a post we dont have to make these changes since it actually revalidates the entire the cache that has the post-feed as queryKey
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters; //the satisfies keyword in TypeScript is used to ensure that an object conforms to a specific type
      // When you use satisfies QueryFilters, TypeScript performs a structural check to ensure that the queryFilter object matches
      // the type QueryFilters. This includes checking the presence of the predicate method and its type signature.

      //   Cancel the ongoing queries
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          // We extract the firstpage data if firstPage exists
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams, // the pageParams is same as the oldData itself
              pages: [
                // This is the First page
                {
                  posts: [newPost, ...firstPage.posts], // we append the newData obtained to the already present posts on the first page
                  nextCursor: firstPage.nextCursor, // the nextCursor of first page is the same, it has the postId of the post that starts from the second page
                },
                // This is the next pages from (2nd)
                ...oldData.pages.slice(1), // we then add the remaining pages posts except the first page(we already added)
              ],
            };
          }
        },
      );

      // If suppose a case, like if the post is created even before the first page posts are loaded then we have to invalidate the cache and refetch them
      queryClient.invalidateQueries({
        queryKey: ["post-feed", "for-you"],
        // predicate function can be used to write conditions for invalidating
        predicate(query) {
          // This invalidates the cache only if the query state data is empty i.e, no data is fetched yet
          // This will invalidate even when the conditions provided inside the queryFilter is also true
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast({
        variant: "success",
        description: "Post created successfully",
      });
    },
    onError(error) {
      console.error("Error in createPostMutation: ", error.message);
      toast({
        variant: "destructive",
        description: "Failed to create post. Please try again",
      });
    },
  });

  return mutation;
}
