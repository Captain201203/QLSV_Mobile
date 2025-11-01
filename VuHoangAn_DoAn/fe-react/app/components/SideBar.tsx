"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BookOpen, GraduationCap } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Trang chủ", path: "/", icon: <Home size={18} /> },
    { name: "Quản lý sinh viên", path: "/admin/student", icon: <Users size={18} /> },
    { name: "Quản lý lớp", path: "/admin/class", icon: <GraduationCap size={18} /> },
    { name: "Quản lý môn học", path: "/admin/subject", icon: <BookOpen size={18} /> },
    { name: "Quản lý khóa học", path: "/admin/course", icon: <BookOpen size={18} /> },

  ];

  return (
    <aside className="w-64 h-screen bg-zinc-900 text-white flex flex-col">
      <div className="px-6 py-4 text-xl font-bold border-b border-zinc-700">
        Admin Panel
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              pathname === item.path
                ? "bg-zinc-700 text-white"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
