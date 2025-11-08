"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { courseService } from "@/app/services/courseService";
import { Course } from "@/app/types/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/app/contexts/authContext";
import ProtectedRoute from "@/app/components/auth/proctectedRoute";
import { BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentCoursesPage() {
  const { student, logout } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAll();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
        alert("Không thể tải danh sách khóa học");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = () => {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      logout();
      router.push("/student/login");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Hệ thống học tập</h1>
              <p className="text-gray-600">
                Xin chào, {student?.studentName} ({student?.studentId})
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto p-6">
          <h2 className="text-3xl font-bold mb-6">Danh sách khóa học</h2>

          {loading ? (
            <div className="text-center py-10">Đang tải...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.courseId}
                  className="cursor-pointer hover:shadow-lg transition"
                  onClick={() =>
                    router.push(`/student/course/${course.courseId}`)
                  }
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <CardTitle>{course.courseId}</CardTitle>
                    </div>
                    <CardTitle className="text-xl mt-2">{course.courseId}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2">
                      {course.description || "Không có mô tả"}
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Môn học: {course.courseName}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && courses.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Chưa có khóa học nào.
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}