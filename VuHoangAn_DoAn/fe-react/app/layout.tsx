import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/SideBar";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Quản lý sinh viên - React + Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="flex bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}
