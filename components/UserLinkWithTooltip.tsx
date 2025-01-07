import { useQuery } from "@tanstack/react-query";
import React, { PropsWithChildren } from "react";
import fetchUserIdFromUsername from "./users/actions";
import Link from "next/link";
import UserToolTip from "./UserToolTip";

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithTooltip({
  username,
  children,
}: UserLinkWithTooltipProps) {
  const { data } = useQuery({
    queryKey: ["user-data", username],
    queryFn: () => fetchUserIdFromUsername(username),
    staleTime: Infinity,
  });

  if (!data) {
    return <Link href={`/users/${username}`}>{children}</Link>;
  }
  return (
    <UserToolTip user={data}>
      <Link href={`/users/${data.id}`} className="text-primary">
        {children}
      </Link>
    </UserToolTip>
  );
}
