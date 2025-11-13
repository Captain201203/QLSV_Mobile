"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {QuizService} from '@/app/services/quizService';
import { Quiz } from '@/app/types/quiz';
import QuizManager from '@/app/components/quiz/quizManager';

export default function QuizEditPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId, lessonId, quizId } = params;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { // khi component được mount hoặc quizId thay đổi thì gọi fetchQuiz
    if (typeof quizId === 'string' && quizId !== 'new') {
      const fetchQuiz = async () => { // lấy thông tin bài kiểm tra theo quizId
        try {
          const data = await QuizService.getById(quizId);
          setQuiz(data);
        } catch (error) {
          console.error("Failed to fetch quiz", error);
          alert("Không thể tải bài kiểm tra");
        } finally {
          setLoading(false);
        }
      };
      fetchQuiz();
    } else {
      setLoading(false);
    }
  }, [quizId]);

  const handleQuizSubmit = async (quizData: Quiz) => { // lưu bài kiểm tra (tạo mới hoặc cập nhật)
    try {
      if (quizId === 'new') { // tạo mới bài kiểm tra. nếu quizId là 'new'
        await QuizService.create({ ...quizData, lessonId: lessonId as string });
        alert("Tạo bài kiểm tra thành công!");
      } else {
        await QuizService.update(quizId as string, quizData);
        alert("Cập nhật bài kiểm tra thành công!");
      }
      router.push(`/admin/course/${courseId}/lesson/${lessonId}/quiz`);
    } catch (error) {
      console.error("Failed to save quiz", error);
      alert("Lưu bài kiểm tra thất bại.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return ( // hiển thị trình quản lý bài kiểm tra
    <QuizManager
      quiz={quiz}
      lessonId={lessonId as string}
      onSubmit={handleQuizSubmit}
      onCancel={handleCancel}
    />
  );
}