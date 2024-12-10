import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import Link from "next/link";
import React, { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { resolve } from "path";
import { unstable_cache } from "next/cache";
import { number } from "zod";
import { formatNumber } from "@/lib/utils";

// Inorder to set a loading state in server component use Suspense to show that particular server component is loading
// In client components use useState hook

export default async function TrendsSidebar() {
  return (
    <div className="sticky top-[6.5rem] h-fit w-full flex-none space-y-5">
      {/* When both the server components are written inside Suspense it means that only after loading both the component
      the loader goes off and renders them, it doesnt cause any use to the other components it renders them fastly
      */}
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
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
    select: userDataSelect,
    take: 5,
  });

  return (
    <div className="shadow-light space-y-4 rounded-2xl bg-card p-5">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between space-y-4"
        >
          <Link href={`/users/${user.id}`} className="flex items-center gap-4">
            <UserAvatar avatarUrl={user.avatarUrl} classname="flex-none" />
            <div>
              <p className="line-clamp-1 break-all text-sm font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-xs text-muted-foreground hover:underline">
                @{user.username}
              </p>
            </div>
          </Link>
          <Button className="rounded-xl">Follow</Button>
        </div>
      ))}
    </div>
  );
}

// This function allows you to cache the results of expensive operations, like database queries, and reuse them across multiple requests.
// Which means it caches the data that are fetched for the time we provide and it will revalidate them only after that time,
// The changes made to the database will only be reflected in this component only after 3 hours until then the data will be cached,

// the "trending_topics" name is given to:
// * In the unstable_cache function, the "trending_topics" string serves as a cache key
// * If you want to access the same cached data later, React or the server-side framework will look it up using this key.
// * After 3 hours, The cache for "trending_topics" is marked as stale. The next request triggers a re-execution of the function, and the result is cached again.

const getTrendingTopics = unstable_cache(
  async () => {
    // This is how we write SQL raw using prisma,
    // This raw query is used to find the hashtaged posts and its count, basically it matches with the posts that has an hashtag in it
    // like Eg: #trending and displays its count like how many posts has this hashtag
    // The UNNEST function in PostgreSQL is used to expand an array into a set of rows, with each element of the array becoming a separate row.
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
    SELECT LOWER(unnest(REGEXP_MATCHES(content, '#[[:alnum:]_]+', 'g'))) AS hashtag,
    COUNT(*) AS count
    FROM posts
    GROUP BY hashtag
    ORDER BY count DESC, hashtag ASC
    LIMIT 5
    `;
    return result;
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60, // revalidate after 3 hours
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();
  return (
    <div className="shadow-light space-y-4 rounded-2xl bg-card p-5">
      <div className="text-xl font-bold">Trending Topics</div>
      {trendingTopics.map(
        (
          { hashtag, count }: { hashtag: string; count: bigint },
          index: number,
        ) => {
          const title = hashtag.split("#")[1];

          return (
            <Link key={index} href={`/hashtag/${title}`} className="block">
              <p
                title={hashtag}
                className="line-clamp-1 break-all font-semibold hover:underline"
              >
                {hashtag}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatNumber(Number(count))}{" "}
                {Number(count) === 1 ? "post" : "posts"}
              </p>
            </Link>
          );
        },
      )}
    </div>
  );
}
