import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import React from "react";

// Inorder to set a loading state in server component use Suspense to show that particular server component is loading
// In client components use useState hook

export default async function TrendsSidebar() {
  return (
    <div className="sticky top-[6.5rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <p>Trends sidebar</p>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();
  if (!user) return null;
  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
    },
  });
}

async function TrendingTopics() {}
