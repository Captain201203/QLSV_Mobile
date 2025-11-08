"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {QuizService} from '@/app/services/quizService';
import { Quiz } from '@/app/types/quiz';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import QuizCard from '@/app/components/quiz/quizCard'; // We will create this next
import QuizForm from '@/app/components/quiz/quizForm';

export default function QuizListPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId, lessonId } = params;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (typeof lessonId === 'string') {
      const fetchQuizzes = async () => {
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
    }
  }, [lessonId]);

  const handleCreateQuiz = () => {
    setShowForm(true);
  };

  const handleSubmitNewQuiz = async (data: any) => {
    if (typeof lessonId !== 'string') return;
    try {
      await QuizService.create({ ...data, lessonId });
      setShowForm(false);
      const refreshed = await QuizService.getByLesson(lessonId);
      setQuizzes(refreshed);
    } catch (error) {
      console.error('Failed to create quiz', error);
      alert('Lưu bài kiểm tra thất bại.');
    }
  };

  const handleEditQuiz = (quizId: string) => {
    router.push(`/admin/course/${courseId}/lesson/${lessonId}/quiz/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài kiểm tra này không?')) {
      try {
        await QuizService.delete(quizId);
        setQuizzes(quizzes.filter(q => q.quizId !== quizId));
      } catch (error) {
        console.error("Failed to delete quiz", error);
        alert("Xóa bài kiểm tra thất bại.");
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Bài kiểm tra</h1>
        {!showForm && (
          <Button onClick={handleCreateQuiz}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tạo bài kiểm tra mới
          </Button>
        )}
      </div>
      {showForm ? (
        <div className="mb-6">
          <QuizForm onSubmitAction={handleSubmitNewQuiz} />
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map(quiz => (
          <QuizCard
            key={quiz.quizId}
            quiz={quiz}
            courseId={courseId as string}
            lessonId={lessonId as string}
            onEdit={() => handleEditQuiz(quiz.quizId)}
            onDelete={() => handleDeleteQuiz(quiz.quizId)}
          />
        ))}
      </div>
       {quizzes.length === 0 && !loading && !showForm && (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p>Chưa có bài kiểm tra nào cho bài học này.</p>
          <Button onClick={handleCreateQuiz} className="mt-4">Tạo bài kiểm tra đầu tiên</Button>
        </div>
      )}
    </div>
  );
}