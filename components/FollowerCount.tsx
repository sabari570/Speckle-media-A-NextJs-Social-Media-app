"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import React from "react";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowerCount({
  userId,
  initialState,
}: FollowerCountProps) {
  // This data will have optimistic updates in it that is when a user clicks on the follow button the data in the query is immedialtely updated via this code
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <div className="flex items-center gap-3">
      <span className="font-semibold">
        Followers: <span>{formatNumber(data.followers)}</span>
      </span>
    </div>
  );
}
