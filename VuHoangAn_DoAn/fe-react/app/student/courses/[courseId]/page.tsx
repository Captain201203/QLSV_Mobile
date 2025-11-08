"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { lessonService } from "@/app/services/lessonService";
import { Lesson } from "@/app/types/lesson";
import { courseService } from "@/app/services/courseService";
import { Course } from "@/app/types/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, BookOpen } from "lucide-react";
import ProtectedRoute from "@/app/components/auth/proctectedRoute";

export default function StudentCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, lessonsData] = await Promise.all([
          courseService.getById(courseId as string),
          lessonService.getByCourse(courseId as string),
        ]);
        setCourse(courseData);
        setLessons(lessonsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
        alert("Không thể tải thông tin khóa học");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/student/courses")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <>
              {course && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-2xl">{course.courseId}</CardTitle>
                    <p className="text-gray-600">{course.description}</p>
                  </CardHeader>
                </Card>
              )}

              <h2 className="text-2xl font-bold mb-4">Danh sách bài học</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.map((lesson) => (
                  <Card
                    key={lesson.lessonId}
                    className="cursor-pointer hover:shadow-lg transition"
                    onClick={() =>
                      router.push(
                        `/student/course/${courseId}/lesson/${lesson.lessonId}`
                      )
                    }
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <CardTitle>{lesson.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-2">
                        {lesson.description || "Không có mô tả"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Thứ tự: {lesson.order}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {lessons.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  Chưa có bài học nào.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}