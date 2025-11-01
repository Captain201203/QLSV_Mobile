"use client";

import { Course } from "@/app/types/course";
import { Pencil, Trash2, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CourseCard({ course, onEdit, onDelete }: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/admin/course/${course.courseId}`)}
      className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition cursor-pointer"
    >
      <h1 className="text-black font-bold"><BookOpen size={24} /> {course.courseId}</h1>
      <h2 className="text-lg font-bold mb-2 text-black">{course.courseName}</h2>
      <p className="text-gray-600 mb-4 text-black">{course.description || "Không có mô tả"}</p>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-600 hover:bg-blue-900 text-white px-4 py-2 rounded-lg"
        >
          <Pencil size={18} /> Sửa
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className=" cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-800 bg-red-600 hover:bg-red-900 text-white px-4 py-2 rounded-lg"
        >
          <Trash2 size={18} /> Xóa
        </button>
      </div>
    </div>
  );
}
