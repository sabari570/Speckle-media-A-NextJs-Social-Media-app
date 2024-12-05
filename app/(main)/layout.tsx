import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import Navbar from "./Navbar.component";
import SessionProvider from "./SessionProvider";
import MenuBar from "./MenuBar.component";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is how we are obtaining the user session data and this is how we are setting the
  // contextProvider value by passing the value from the topmost component
  const session = await validateRequest();
  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar classname="sticky top-[6.5rem] hidden h-fit space-y-3 bg-card shadow-light px-3 py-5 rounded-2xl sm:block lg:px-5 xl:w-80 flex-none" />
          {children}
        </div>
        <MenuBar classname="sticky bottom-0 flex w-full shadow-light-reverse items-center justify-center sm:hidden p-3 gap-5" />
      </div>
    </SessionProvider>
  );
}
