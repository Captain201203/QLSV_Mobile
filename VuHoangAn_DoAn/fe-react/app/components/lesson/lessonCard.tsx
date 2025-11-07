"use client";

import { Lesson } from "@/app/types/lesson";
import { Pencil, Trash2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  lesson: Lesson;
  courseId: string; 
  onEdit: () => void;
  onDelete: () => void;
  onManageQuiz: (lessionId: string) => void;
}

export default function LessonCard({ lesson, courseId, onEdit, onDelete, onManageQuiz }: Props) {
  const router = useRouter(); 

  const handleOpenDocument = () => {
    router.push(`/admin/course/${courseId}/lesson/${lesson.lessonId}/document`);
  };

  return (
    <div
      className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition cursor-pointer"
      onClick={handleOpenDocument}
    >
      <h1 className="text-2xl font-bold mb-2 text-black">{lesson.lessonId}</h1>
      <h2 className="text-lg font-bold mb-2 text-black">{lesson.title}</h2>
      <p className="text-black mb-4">{lesson.description || "Không có mô tả"}</p>
      <p className="text-sm text-black">Thứ tự: {lesson.order}</p>

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
