import { Button } from "@/components/ui/button";
import { Bell, Bookmark, HomeIcon, LucideProps, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function MenuBar({ classname }: MenuBarProps) {
  const menuBarItems: MenuBarItems[] = [
    {
      title: "Home",
      path: "/",
      icon: <HomeIcon />,
    },
    {
      title: "Notifications",
      path: "/notifications",
      icon: <Bell />,
    },
    {
      title: "Messages",
      path: "/messages",
      icon: <Mail />,
    },
    {
      title: "Bookmarks",
      path: "/bookmarks",
      icon: <Bookmark />,
    },
  ];
  return (
    <div className={classname}>
      {menuBarItems.map(
        ({ title, path, icon }: MenuBarItems, index: number) => (
          <Button
            key={index}
            variant="ghost"
            className="flex items-center justify-start gap-2"
            title={title}
            asChild
          >
            <Link href={path}>
              {icon}
              <span className="hidden lg:inline-block">{title}</span>
            </Link>
          </Button>
        ),
      )}
    </div>
  );
}

interface MenuBarProps {
  classname: string;
}

interface MenuBarItems {
  title: string;
  path: string;
  icon: any;
}
