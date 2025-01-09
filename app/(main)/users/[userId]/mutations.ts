import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
import { UpdateUserProfileValues } from "@/lib/validation";
import { PostsPage } from "@/lib/types";

export function useUpdateUserProfileMutation() {
  const router = useRouter();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadedResult]) => {
      // On succeefull updation of the userdata and the avatar we need to update the cache
      // first we need to go through all the posts and update the user avatarUrl of the posts if the avatar of the user is changed
      const newAvatarUrl = uploadedResult?.[0].serverData.avatarUrl;

      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      //   Cancel the ongoing queries if any for the 'post-feed' queryKey
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      //   Inorder to update the user detail component in user profile page
      router.refresh();

      toast({
        variant: "success",
        description: "Profile updated successfully",
      });
    },
    onError(error) {
      console.error("Error while updating the post-feed cache: ", error);
      toast({
        variant: "destructive",
        description: "Failed to update profile. Please try again later",
      });
    },
  });

  return mutation;
}
