"use client";

import { useState, useEffect } from "react";
import { Quiz, Question } from "@/app/types/quiz";
import { QuizService } from "@/app/services/quizService";
import { QuizSubmissionService } from "@/app/services/quizSubmissionService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Props {
  quizId: string;
  studentId: string;
  courseId: string;
  lessonId: string;
  onComplete?: (submission: any) => void;
}

export default function QuizTakingForm({
  quizId,
  studentId,
  courseId,
  lessonId,
  onComplete,
}: Props) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await QuizService.getById(quizId);
        setQuiz(data);
        setTimeRemaining(data.duration * 60); // Chuyển phút thành giây
      } catch (error) {
        console.error("Failed to fetch quiz", error);
        alert("Không thể tải bài kiểm tra");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || submitting) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, submitting]);

  // Tự động nộp bài khi hết thời gian
  useEffect(() => {
    if (timeRemaining === 0 && !submitting && quiz) {
      const autoSubmit = async () => {
        await handleSubmit(true);
      };
      autoSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async (autoSubmit: boolean = false) => {
    if (!quiz || submitting) return;

    // Kiểm tra đã trả lời đủ chưa (nếu không phải auto submit)
    if (!autoSubmit) {
      const answeredCount = Object.keys(selectedAnswers).length;
      if (answeredCount < quiz.questions.length) {
        if (
          !confirm(
            `Bạn mới trả lời ${answeredCount}/${quiz.questions.length} câu. Bạn có chắc muốn nộp bài?`
          )
        ) {
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const answers = Object.entries(selectedAnswers).map(
        ([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })
      );

      const submission = await QuizSubmissionService.submit({
        quizId,
        studentId,
        answers,
      });

      if (autoSubmit) {
        alert("Hết thời gian! Bài kiểm tra đã được tự động nộp.");
      } else {
        alert(`Nộp bài thành công! Điểm của bạn: ${submission.score}%`);
      }

      // Chuyển đến trang kết quả
      router.push(
        `/student/course/${courseId}/lesson/${lessonId}/quiz/${quizId}/result?submissionId=${submission.submissionId}`
      );

      if (onComplete) onComplete(submission);
    } catch (error: any) {
      console.error("Failed to submit quiz", error);
      alert(error.response?.data?.error || "Nộp bài thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Đang tải bài kiểm tra...</div>;
  if (!quiz) return <div className="p-6">Không tìm thấy bài kiểm tra</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <p className="text-gray-600 mt-2">Thời lượng: {quiz.duration} phút</p>
            </div>
            {timeRemaining !== null && (
              <div
                className={`text-2xl font-bold ${
                  timeRemaining < 300 ? "text-red-500" : "text-blue-600"
                }`}
              >
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {quiz.questions.map((question, qIndex) => (
          <Card key={question.questionId}>
            <CardHeader>
              <CardTitle className="text-lg">
                Câu {qIndex + 1}: {question.text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label
                    key={option.optionId}
                    className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="radio"
                      name={`question-${question.questionId}`}
                      value={option.optionId}
                      checked={selectedAnswers[question.questionId] === option.optionId}
                      onChange={() =>
                        handleSelectAnswer(question.questionId, option.optionId)
                      }
                      className="w-4 h-4"
                    />
                    <span className="flex-1">{option.text}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-gray-600">
          Đã trả lời: {Object.keys(selectedAnswers).length}/{quiz.questions.length} câu
        </p>
        <Button onClick={() => handleSubmit(false)} disabled={submitting} size="lg">
          {submitting ? "Đang nộp bài..." : "Nộp bài"}
        </Button>
      </div>
    </div>
  );
}

