"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import QuizResult from "@/app/components/quiz/QuizResult";
import { QuizSubmission } from "@/app/types/quizSubmission";
import { QuizSubmissionService } from "@/app/services/quizSubmissionService";
import { useAuth } from "@/app/contexts/authContext";
import ProtectedRoute from "@/app/components/auth/proctectedRoute";

export default function QuizResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { courseId, lessonId, quizId } = params;
  const submissionId = searchParams.get("submissionId");
  const { student, user } = useAuth();
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!submissionId) {
        alert("Không tìm thấy kết quả bài kiểm tra");
        return;
      }

      try {
        // Lấy từ danh sách submissions của student
        const studentId = student?.studentId || user?.studentId;
        if (studentId) {
          const submissions = await QuizSubmissionService.getByStudent(studentId);
          const found = submissions.find((s) => s.submissionId === submissionId);
          if (found) {
            setSubmission(found);
          } else {
            alert("Không tìm thấy kết quả bài kiểm tra");
          }
        } else {
          alert("Vui lòng đăng nhập");
        }
      } catch (error) {
        console.error("Failed to fetch submission", error);
        alert("Không thể tải kết quả bài kiểm tra");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId, student, user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-6">Đang tải kết quả...</div>
      </ProtectedRoute>
    );
  }

  if (!submission) {
    return (
      <ProtectedRoute>
        <div className="p-6">Không tìm thấy kết quả</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <QuizResult
        submission={submission}
        courseId={courseId as string}
        lessonId={lessonId as string}
        quizId={quizId as string}
      />
    </ProtectedRoute>
  );
}

