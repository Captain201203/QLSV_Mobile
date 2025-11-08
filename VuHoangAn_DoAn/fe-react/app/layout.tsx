import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./contexts/authContext";
import LayoutContent from "./components/LayoutContent";

export const metadata: Metadata = {
  title: "QLSV System",
  description: "Hệ thống quản lý sinh viên",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white">
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
