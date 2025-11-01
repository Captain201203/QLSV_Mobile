"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { lessonService } from "@/app/services/lessonService";
import { Lesson } from "@/app/types/lesson";
import LessonCard from "@/app/components/lesson/lessonCard";
import LessonForm from "@/app/components/lesson/lessonForm";
import { Plus, ArrowLeft, X } from "lucide-react";

export default function LessonPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchLessons = async () => {
    try {
      const data = await lessonService.getByCourse(courseId as string);
      setLessons(data);
    } catch (err) {
      console.error(err);
      alert("Không thể tải danh sách bài học");
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const handleCreate = async (data: Lesson) => {
    try {
      await lessonService.create(data);
      setShowForm(false);
      fetchLessons();
    } catch {
      alert("Thêm bài học thất bại");
    }
  };

  const handleUpdate = async (data: Lesson) => {
    try {
      await lessonService.update(data.lessonId, data);
      setShowForm(false);
      setSelectedLesson(null);
      fetchLessons();
    } catch {
      alert("Cập nhật bài học thất bại");
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài học này?")) return;
    try {
      await lessonService.delete(lessonId);
      fetchLessons();
    } catch {
      alert("Xóa bài học thất bại");
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/course")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} /> Quay lại
          </button>
          <h1 className="text-2xl font-bold">Danh sách bài học</h1>
        </div>
        <button
          onClick={() => {
            setSelectedLesson(null);
            setShowForm(true);
          }}
          className="cursor-pointer flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} /> Thêm bài học
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white shadow rounded-lg p-4 relative">
          <button
            onClick={() => {
              setShowForm(false);
              setSelectedLesson(null);
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          >
            <X />
          </button>
          <LessonForm
            lesson={selectedLesson}
            courseId={courseId as string}
            onSubmit={selectedLesson ? handleUpdate : handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.lessonId}
            lesson={lesson}
            courseId={courseId as string}
            onEdit={() => handleEdit(lesson)}
            onDelete={() => { handleDelete(lesson.lessonId); }}
          />
        ))}
      </div>
    </div>
  );
}
