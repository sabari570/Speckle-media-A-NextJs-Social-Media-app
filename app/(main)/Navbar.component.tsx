import SearchField from "@/components/SearchField";
import UserProfileButton from "@/components/UserProfileButton";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <header className="shadow-light sticky top-0 z-10 bg-card p-5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5">
        <Link href="/" className="text-2xl font-semibold text-primary">
          Speckle Media
        </Link>
        <SearchField />
        <UserProfileButton classname="sm:ms-auto" />
      </div>
    </header>
  );
}
