"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Quiz } from "@/app/types/quiz";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  quiz: Quiz;
  courseId: string;
  lessonId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const QuizCard: React.FC<Props> = ({ quiz, courseId, lessonId, onEdit, onDelete }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/admin/course/${courseId}/lesson/${lessonId}/quiz/${quiz.quizId}`);
  };

  return (
    <Card
      onClick={handleNavigate}
      className="cursor-pointer transition hover:shadow-lg"
    >
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>⏱ Thời lượng: {quiz.duration} phút</p>
        <p>📋 Số câu hỏi: {quiz.questions.length}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation(); // tránh trigger navigate khi click nút
            onEdit();
          }}
        >
          Chỉnh sửa
        </Button>
        <Button
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Xóa
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
