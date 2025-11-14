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

import { lessonProgressService } from "@/app/services/lessonProgressService";
import { QuizService } from "@/app/services/quizService";
import { QuizSubmissionService } from "@/app/services/quizSubmissionService";

export default function StudentCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId } = params;
  const { student, user } = useAuth();
  const studentId = student?.studentId || user?.studentId || "";

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonProgresses, setLessonProgresses] = useState<
    Record<
      string,
      {
        percentage: number;
        contentDone: boolean;
        quizzesDone: boolean;
        numQuizzes: number;
        numCompleted: number;
        avgQuizScore: number;
      }
    >
  >({});
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
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchData();
  }, [courseId]);

  useEffect(() => {
    const fetchProgresses = async () => {
      if (!studentId || lessons.length === 0) return;
      try {
        const result: Record<
          string,
          {
            percentage: number;
            contentDone: boolean;
            quizzesDone: boolean;
            numQuizzes: number;
            numCompleted: number;
            avgQuizScore: number;
          }
        > = {};

        for (const l of lessons) {
          const lid = l.lessonId as string;

          // Lấy danh sách quiz
          const quizzes = await QuizService.getByLesson(lid);
          const numQuizzes = quizzes.length;

          console.log(`Đang lấy scores cho: Lesson ID=${lid}, Student ID=${studentId}`);

          // Lấy progress nội dung
          const prog = await lessonProgressService.getProgress(lid, studentId);
          const contentDone = !!(
            prog?.content?.videoCompleted && prog?.content?.documentsCompleted
          );
          const contentPercent = contentDone ? 50 : 0;

          // Tính quiz
          let quizzesPercent = 0;
          let numCompleted = 0;
          let avgScore = 0;

          if (numQuizzes > 0) {
            const quizScores = await QuizSubmissionService.getScoresByLesson(
              lid,
              studentId
            );

            console.log(`Kết quả scores cho Lesson ${lid}:`, quizScores);

            numCompleted = quizScores.length;

            const totalScore = quizScores.reduce((t, q) => t + q, 0);
            

            avgScore = totalScore / numQuizzes;

            quizzesPercent = avgScore * 0.5;
          }

          let finalContentPercent = contentPercent;
          if (numQuizzes === 0 && contentDone) {
            finalContentPercent = 100;
          } else if (numQuizzes === 0 && !contentDone) {
            finalContentPercent = 0;
          }

          const percentage = Math.round(
            numQuizzes > 0 ? finalContentPercent + quizzesPercent : finalContentPercent
          );

          const quizzesDone = numQuizzes > 0 && numCompleted === numQuizzes;

          result[lid] = {
            percentage,
            contentDone,
            quizzesDone,
            numQuizzes,
            numCompleted,
            avgQuizScore: Math.round(avgScore),
          };
        }

        setLessonProgresses(result);
      } catch (error) {
        console.error("❌ Failed to fetch lesson progresses", error);
      }
    };

    fetchProgresses();
  }, [lessons, studentId]);

  const getLessonProgress = (lessonId: string) => {
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
                    <p className="text-gray-600">
                      {course.description || "Không có mô tả"}
                    </p>
                  </CardHeader>
                </Card>
              )}

              <h2 className="text-2xl font-bold mb-4">Danh sách bài học</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.map((lesson) => {
                  const progress = getLessonProgress(lesson.lessonId);
                  const percentage = progress?.percentage || 0;

                  const isLessonCompleted =
                    (progress?.numQuizzes ?? 0) > 0
                      ? progress?.contentDone && progress?.quizzesDone
                      : progress?.contentDone;

                  return (
                    <Card
                      key={lesson.lessonId}
                      className={`cursor-pointer hover:shadow-lg transition ${
                        isLessonCompleted
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
                            {isLessonCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-blue-600" />
                            )}
                            <CardTitle>{lesson.title}</CardTitle>
                          </div>

                          {isLessonCompleted && (
                            <span className="text-green-600 font-semibold">
                              ✓ Hoàn thành
                            </span>
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

                        {progress ? (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">
                                Tiến độ hoàn thành:
                              </span>
                              <span
                                className={`text-sm font-bold ${
                                  isLessonCompleted
                                    ? "text-green-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {percentage}%
                              </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isLessonCompleted
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>

                            <p className="text-xs text-gray-500 mt-1">
                              {progress.numQuizzes > 0
                                ? `Nội dung: ${
                                    progress.contentDone ? "50%" : "0%"
                                  } — Quiz: ${progress.avgQuizScore}% (${progress.numCompleted}/${progress.numQuizzes})`
                                : "Nội dung: 100%"}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-3">
                            <p className="text-xs text-gray-400 italic">
                              Đang tải tiến độ...
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
