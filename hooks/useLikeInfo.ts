import { LikesInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

/**
 *
 * @param postId
 * @param initialState
 * @returns The Likes info that contains the likes count and 'isPostLikedByUser'
 */
export default function useLikeInfo(postId: string, initialState: LikesInfo) {
  const query = useQuery({
    queryKey: ["likes-info", postId],
    queryFn: () => ky.get(`/api/posts/${postId}/likes`).json<LikesInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });
  return query;
}
