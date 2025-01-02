import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import React from "react";
import ForYouFeed from "./ForYouFeed.component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed.component";

export default async function Home() {
  return (
    <main className="m-win-0 flex w-full gap-5">
      <div className="w-full px-3 py-5">
        <PostEditor />
        <Tabs defaultValue="for-you" className="mt-3">
          <TabsList className="h-[45px] w-full">
            <TabsTrigger className="flex-1" value="for-you">
              For You
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="following-feed">
              Following Feed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following-feed">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden w-1/2 md:block md:w-2/3">
        <TrendsSidebar />
      </div>
    </main>
  );
}
