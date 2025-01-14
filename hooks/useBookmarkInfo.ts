"use client";

import { BookmarksInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export default function useBookmarkInfo(
  postId: string,
  initialState: BookmarksInfo,
) {
  const query = useQuery({
    queryKey: ["bookmarks-info", postId],
    queryFn: () =>
      ky.get(`/api/posts/${postId}/bookmarks`).json<BookmarksInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
