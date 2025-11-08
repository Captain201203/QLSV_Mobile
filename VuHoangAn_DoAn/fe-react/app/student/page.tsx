"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/authContext";

export default function StudentPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/student/courses");
      } else {
        router.push("/student/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return <div>Đang chuyển hướng...</div>;
}