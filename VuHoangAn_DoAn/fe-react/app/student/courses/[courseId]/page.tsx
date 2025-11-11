"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { lessonService } from "@/app/services/lessonService";
import { Lesson } from "@/app/types/lesson";
import { courseService } from "@/app/services/courseService";
import { Course } from "@/app/types/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";
import ProtectedRoute from "@/app/components/auth/proctectedRoute";
import { useAuth } from "@/app/contexts/authContext";
import { LessonProgressService, LessonProgress } from "@/app/services/lessonProgressService";

export default function StudentCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId } = params;
  const { student, user } = useAuth();
  const studentId = student?.studentId || user?.studentId || "";
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonProgresses, setLessonProgresses] = useState<Record<string, LessonProgress>>({});
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
    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  // Fetch tiến độ cho tất cả lesson
  useEffect(() => {
    const fetchProgresses = async () => {
      if (!studentId || lessons.length === 0) return;
      
      try {
        const lessonIds = lessons.map(l => l.lessonId);
        const progresses = await LessonProgressService.caculateProgressForLessons(
          lessonIds,
          studentId
        );
        setLessonProgresses(progresses);
      } catch (error) {
        console.error("Failed to fetch lesson progresses", error);
      }
    };

    fetchProgresses();
  }, [lessons, studentId]);

  // Helper function để lấy progress của một lesson
  const getLessonProgress = (lessonId: string): LessonProgress | null => {
    return lessonProgresses[lessonId] || null;
  };

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
                    <p className="text-gray-600">{course.description || "Không có mô tả"}</p>
                  </CardHeader>
                </Card>
              )}

              <h2 className="text-2xl font-bold mb-4">Danh sách bài học </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.map((lesson) => {
                  const progress = getLessonProgress(lesson.lessonId);
                  const isCompleted = progress?.isCompleted || false;
                  const percentage = progress?.completionPercentage || 0;

                  return (
                    <Card
                      key={lesson.lessonId}
                      className={`cursor-pointer hover:shadow-lg transition ${
                        isCompleted 
                          ? "border-green-500 bg-green-50" 
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        router.push(
                          `/student/course/${courseId}/lesson/${lesson.lessonId}/document`
                        )
                      }
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-blue-600" />
                            )}
                            <CardTitle>{lesson.title}</CardTitle>
                          </div>
                          {isCompleted && (
                            <span className="text-green-600 font-semibold">✓ Hoàn thành</span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 line-clamp-2">
                          {lesson.description || "Không có mô tả"}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Thứ tự: {lesson.order}
                        </p>
                        {/* Hiển thị % hoàn thành */}
                        {progress && progress.totalQuestions > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">
                                Tiến độ hoàn thành:
                              </span>
                              <span className={`text-sm font-bold ${
                                isCompleted ? "text-green-600" : "text-blue-600"
                              }`}>
                                {percentage}%
                              </span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isCompleted ? "bg-green-500" : "bg-blue-500"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {progress.correctAnswers} / {progress.totalQuestions} câu đúng
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
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