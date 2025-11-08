"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./SideBar";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Chỉ hiển thị sidebar cho các route admin
  const showSidebar = pathname?.startsWith("/admin") || pathname === "/";

  if (showSidebar) {
    return (
      <div className="flex bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    );
  }

  // Không hiển thị sidebar cho student routes và login
  return <>{children}</>;
}

