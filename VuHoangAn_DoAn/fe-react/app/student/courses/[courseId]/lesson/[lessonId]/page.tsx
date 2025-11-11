"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StudentLessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId, lessonId } = params as { courseId: string; lessonId: string };

  useEffect(() => {
    // Redirect đến trang tài liệu
    router.replace(`/student/course/${courseId}/lesson/${lessonId}/document`);
  }, [courseId, lessonId, router]);

  return null;
}
