"use client";

import { Lesson } from "@/app/types/lesson";
import { Pencil, Trash2, FileText, CheckCircle2, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
type LessonProgressSummary = {
  completionPercentage: number;
  isCompleted: boolean;
  totalQuestions: number;
  correctAnswers: number;
};

interface Props {
  lesson: Lesson;
  courseId: string; 
  onEdit: () => void;
  onDelete: () => void;
  onManageQuiz: (lessionId: string) => void;
  progress?: LessonProgressSummary | null; // Optional progress data
  showProgress?: boolean; // Flag to show/hide progress section
}

export default function LessonCard({ 
  lesson, 
  courseId, 
  onEdit, 
  onDelete, 
  onManageQuiz,
  progress,
  showProgress = false
}: Props) {
  const router = useRouter(); 

  const handleOpenDocument = () => {
    router.push(`/admin/course/${courseId}/lesson/${lesson.lessonId}/document`);
  };

  const isCompleted = progress?.isCompleted || false;
  const percentage = progress?.completionPercentage || 0;
  const hasProgress = showProgress && progress && progress.totalQuestions > 0;

  return (
    <div
      className={`bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition cursor-pointer ${
        isCompleted && showProgress
          ? "border-2 border-green-500 bg-green-50" 
          : "border border-gray-200"
      }`}
      onClick={handleOpenDocument}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          {isCompleted && showProgress ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          ) : (
            <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-black truncate">{lesson.lessonId}</h1>
            <h2 className="text-lg font-bold text-black">{lesson.title}</h2>
          </div>
        </div>
        {isCompleted && showProgress && (
          <span className="text-green-600 font-semibold text-sm whitespace-nowrap ml-2">
            ✓ Hoàn thành
          </span>
        )}
      </div>

      <p className="text-black mb-2">{lesson.description || "Không có mô tả"}</p>
      <p className="text-sm text-black mb-3">Thứ tự: {lesson.order}</p>

      {/* Hiển thị phần tiến độ nếu có */}
      {hasProgress && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Tiến độ hoàn thành:
            </span>
            <span className={`text-sm font-bold ${
              isCompleted ? "text-green-600" : "text-blue-600"
            }`}>
              {percentage}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className={`h-2 rounded-full transition-all ${
                isCompleted ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {progress.correctAnswers} / {progress.totalQuestions} câu đúng
          </p>
        </div>
      )}

      <div
        className="flex justify-between items-center mt-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onEdit}
          className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-600 hover:bg-blue-900 text-white px-4 py-2 rounded-lg"
        >
          <Pencil size={18} /> Sửa
        </button>
        <button
          onClick={onDelete}
          className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-800 bg-red-600 hover:bg-red-900 text-white px-4 py-2 rounded-lg"
        >
          <Trash2 size={18} /> Xóa
        </button>
      </div>
       
    </div>
  );
}
