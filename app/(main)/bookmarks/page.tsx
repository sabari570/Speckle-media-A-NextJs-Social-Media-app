import React from "react";
import BookmarkedPosts from "./BookmarkedPosts";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";

export const metaData: Metadata = {
  title: `Bookmarks`,
};

export default function page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        <BookmarkedPosts />
      </div>
      <div className="hidden w-1/2 md:block md:w-2/3">
        <TrendsSidebar />
      </div>
    </main>
  );
}
