"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import QuizTakingForm from "@/app/components/quiz/QuizTakingForm";
import { useAuth } from "@/app/contexts/authContext";
import ProtectedRoute from "@/app/components/auth/proctectedRoute";

export default function TakeQuizPage() {
  const params = useParams();
  const { courseId, lessonId, quizId } = params;
  const { student, user } = useAuth();
  const [studentId, setStudentId] = useState<string>("");

  useEffect(() => {
    // Lấy studentId từ user hoặc student
    if (student?.studentId) {
      setStudentId(student.studentId);
    } else if (user?.studentId) {
      setStudentId(user.studentId);
    } else {
      // Nếu chưa có, có thể redirect về trang login
      alert("Vui lòng đăng nhập");
      // router.push("/student/login");
    }
  }, [student, user]);

  if (!studentId) {
    return (
      <ProtectedRoute>
        <div className="p-6">Đang tải...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <QuizTakingForm
        quizId={quizId as string}
        studentId={studentId}
        courseId={courseId as string}
        lessonId={lessonId as string}
      />
    </ProtectedRoute>
  );
}

