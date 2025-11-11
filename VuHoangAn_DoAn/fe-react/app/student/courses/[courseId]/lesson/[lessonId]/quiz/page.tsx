"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizService } from "@/app/services/quizService";
import { QuizSubmissionService } from "@/app/services/quizSubmissionService";
import { Quiz } from "@/app/types/quiz";
import { QuizStatus } from "@/app/types/quizSubmission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, ClipboardList } from "lucide-react";
import ProtectedRoute from "@/app/components/auth/proctectedRoute";
import { useAuth } from "@/app/contexts/authContext";

export default function StudentQuizListPage() {
  const params = useParams();
  const router = useRouter();
  const { student, user } = useAuth();
  const { courseId, lessonId } = params as { courseId: string; lessonId: string };

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizStatuses, setQuizStatuses] = useState<Record<string, QuizStatus>>({});
  const [loading, setLoading] = useState(true);

  // Lấy studentId từ auth context
  const studentId = student?.studentId || user?.studentId || "";

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

  // Fetch trạng thái của tất cả quiz sau khi có danh sách quiz
  useEffect(() => {
    const fetchStatuses = async () => {
      if (!studentId || quizzes.length === 0) return;
      
      try {
        const statusMap: Record<string, QuizStatus> = {};
        // Fetch tất cả statuses song song để tối ưu performance
        const statusPromises = quizzes.map(quiz =>
          QuizSubmissionService.getQuizStatus(quiz.quizId, studentId)
            .then(status => ({ quizId: quiz.quizId, status }))
            .catch(error => {
              console.error(`Failed to fetch status for quiz ${quiz.quizId}:`, error);
              return null;
            })
        );
        
        const results = await Promise.all(statusPromises);
        results.forEach(result => {
          if (result) {
            statusMap[result.quizId] = result.status;
          }
        });
        
        setQuizStatuses(statusMap);
      } catch (error) {
        console.error("Failed to fetch quiz statuses", error);
      }
    };

    fetchStatuses();
  }, [quizzes, studentId]);

  const handleQuizClick = (quizId: string) => {
    const status = quizStatuses[quizId];

    // Nếu đã khóa hoặc đã hoàn thành (và không được phép làm lại)
    if ((status?.status === "locked" || status?.status === "completed") && !status?.canTake) {
      // Nếu có submission, chuyển đến trang kết quả
      if (status.submission) {
        router.push(
          `/student/course/${courseId}/lesson/${lessonId}/quiz/${quizId}/result?submissionId=${status.submission.submissionId}`
        );
      } else {
        alert("Bạn không thể làm bài kiểm tra này");
      }
    } else {
      // Có thể làm bài (not_started, allowed, hoặc completed nhưng canTake = true)
      router.push(
        `/student/course/${courseId}/lesson/${lessonId}/quiz/${quizId}/take`
      );
    }
  };

  const getStatusBadge = (quizId: string) => {
    const status = quizStatuses[quizId];
    if (!status) return null;

    switch (status.status) {
      case "not_started":
        return <Badge className="bg-gray-500">Chưa làm</Badge>;
      case "completed":
        if (status.canTake) {
          return <Badge className="bg-green-500">Có thể làm lại</Badge>;
        }
        return <Badge className="bg-blue-500">Đã hoàn thành</Badge>;
      case "locked":
        return <Badge className="bg-red-500">Đã khóa</Badge>;
      case "allowed":
        return <Badge className="bg-green-500">Có thể làm lại</Badge>;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() =>
              router.push(`/student/course/${courseId}/lesson/${lessonId}/document`)
            }
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
                  onClick={() => handleQuizClick(quiz.quizId)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-green-600" />
                        <CardTitle>{quiz.title}</CardTitle>
                      </div>
                      {getStatusBadge(quiz.quizId)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Thời lượng: {quiz.duration} phút
                    </p>
                    <p className="text-gray-600">
                      Số câu hỏi: {quiz.questions.length}
                    </p>
                    {quizStatuses[quiz.quizId]?.submission && (
                      <>
                        <p className="text-gray-600 mt-2">
                          Điểm: <span className="font-semibold">{quizStatuses[quiz.quizId].submission?.score}%</span>
                        </p>
                        <p className="text-gray-600 text-sm">
                          Số lần làm: {quizStatuses[quiz.quizId].submission?.attempts || 1}
                        </p>
                      </>
                    )}
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

