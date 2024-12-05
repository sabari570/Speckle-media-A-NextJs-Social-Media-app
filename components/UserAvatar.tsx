import Image from "next/image";
import React from "react";
import avatarPlaceholder from "../app/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

export default function UserAvatar({
  avatarUrl,
  size,
  classname,
}: UserAvatarProps) {
  return (
    <Image
      src={avatarUrl || avatarPlaceholder}
      alt="User avatar"
      height={size ?? 48}
      width={size ?? 48}
      className={cn(
        "aspect-square h-fit rounded-full bg-secondary object-cover",
        classname,
      )}
    />
  );
}

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  classname?: string;
}
