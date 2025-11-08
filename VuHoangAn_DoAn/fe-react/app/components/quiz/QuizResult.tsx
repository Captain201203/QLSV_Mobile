"use client";

import { QuizSubmission, Answer } from "@/app/types/quizSubmission";
import { Quiz } from "@/app/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { QuizService } from "@/app/services/quizService";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  submission: QuizSubmission;
  courseId: string;
  lessonId: string;
  quizId: string;
}

export default function QuizResult({ submission, courseId, lessonId, quizId }: Props) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await QuizService.getById(quizId);
        setQuiz(data);
      } catch (error) {
        console.error("Failed to fetch quiz", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const getAnswerForQuestion = (questionId: string): Answer | undefined => {
    return submission.answers.find((ans) => ans.questionId === questionId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!quiz) return <div className="p-6">Không tìm thấy bài kiểm tra</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.push(`/student/course/${courseId}/lesson/${lessonId}`)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <div className="mt-4">
            <p className={`text-4xl font-bold ${getScoreColor(submission.score)}`}>
              Điểm: {submission.score}%
            </p>
            <p className="text-gray-600 mt-2">
              Nộp bài lúc:{" "}
              {new Date(submission.submittedAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Chi tiết câu trả lời:</h3>
        {quiz.questions.map((question, index) => {
          const answer = getAnswerForQuestion(question.questionId);
          const isCorrect = answer?.isCorrect || false;
          const selectedOption = question.options.find(
            (opt) => opt.optionId === answer?.selectedOptionId
          );
          const correctOption = question.options.find(
            (opt) => opt.optionId === question.correctAnswer
          );

          return (
            <Card
              key={question.questionId}
              className={isCorrect ? "border-green-500" : "border-red-500"}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    Câu {index + 1}: {question.text}
                  </CardTitle>
                  <div className="ml-4">
                    {isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-semibold text-gray-700">Đáp án của bạn:</p>
                  <p
                    className={`${
                      isCorrect ? "text-green-600" : "text-red-600"
                    } font-medium`}
                  >
                    {selectedOption?.text || "Chưa trả lời"}
                  </p>
                </div>
                {!isCorrect && correctOption && (
                  <div>
                    <p className="font-semibold text-gray-700">Đáp án đúng:</p>
                    <p className="text-green-600 font-medium">
                      {correctOption.text}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

