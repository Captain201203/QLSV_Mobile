"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizService } from "@/app/services/quizService";
import { Quiz } from "@/app/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, ClipboardList } from "lucide-react";
import ProtectedRoute from "@/app/components/auth/proctectedRoute";

export default function StudentLessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId, lessonId } = params;
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (typeof lessonId !== "string") return;
      try {
        const data = await QuizService.getByLesson(lessonId);
        setQuizzes(data);
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [lessonId]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => router.push(`/student/course/${courseId}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/student/course/${courseId}/lesson/${lessonId}/document`
                )
              }
              className="mr-4"
            >
              <FileText className="mr-2 h-4 w-4" />
              Xem tài liệu
            </Button>
          </div>

          <h2 className="text-2xl font-bold mb-4">Danh sách bài kiểm tra</h2>

          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.quizId}
                  className="cursor-pointer hover:shadow-lg transition"
                  onClick={() =>
                    router.push(
                      `/student/course/${courseId}/lesson/${lessonId}/quiz/${quiz.quizId}/take`
                    )
                  }
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-green-600" />
                      <CardTitle>{quiz.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Thời lượng: {quiz.duration} phút
                    </p>
                    <p className="text-gray-600">
                      Số câu hỏi: {quiz.questions.length}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && quizzes.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Chưa có bài kiểm tra nào.
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}