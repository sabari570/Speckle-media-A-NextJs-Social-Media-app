"use client";

import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

/** 
* This is a custom hook that is created to actually fetch the user follower details from the server and mutate the cache using the react query immediately.
* It returns a type of FollowerInfo
*/
export default function useFollowerInfo(
  userId: string,
  // we pass in the initialState because since the useQuery is client side if we dont pass the data from the server side initially we will get a data that is undefined and
  // only after we fetch the user details the data will be populated in the client which will take some time. So, inorder to improve user experience we pass the data to this
  // hook from the server side and then we actually perform the rest of the operation so that we have some data initially
  initialState: FollowerInfo,
) {
  const query = useQuery({
    // For each user we have its own cache detail for the followerInfo
    queryKey: ["follower-info", userId],
    queryFn: () =>
      ky.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialState,
    // We keep stale time as infinity, because we doesn't want this followerInfo data to be revalidated automatically.
    // If it revalidates automatically then it will revalidate for 100s of users which will make 100s of request to the server which is not good.
    // This is the same for likes feature where we dont want to revalidate the likes data to be revalidated automatically for each posts due to which
    // it will hit a request for the likes data each time for each posts which will be more number of request-hit to the server.
    // If staleTime is Infinity then this data will be revalidated only when we ask it to, ie. only when we ,manullay set the cache data via an API call
    // the cache will be updated due to which we will correct the data
    // staleTime: Infinity,
  });
  return query;
}
