"use client";

import { useState } from "react";
import { Lesson } from "@/app/types/lesson";
import { Save, XCircle } from "lucide-react";

interface LessonFormProps {
  lesson?: Lesson | null;
  courseId: string;
  onSubmit: (data: Lesson) => void;
  onCancel: () => void;
}

export default function LessonForm({ lesson, courseId, onSubmit, onCancel }: LessonFormProps) {
  const [formData, setFormData] = useState<Lesson>(
    lesson || { lessonId: "", courseId, title: "", description: "", order: 1 }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, courseId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!lesson && (
        <div>
          <label className="block font-medium mb-1 text-black">Mã bài học</label>
          <input
            type="text"
            name="lessonId"
            value={formData.lessonId}
            onChange={handleChange}
            className="border rounded-lg w-full px-3 py-2 text-black"
            required
          />
        </div>
      )}

      <div>
        <label className="block font-medium mb-1 text-black">Tiêu đề</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border rounded-lg w-full px-3 py-2 text-black"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1 text-black">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border rounded-lg w-full px-3 py-2 text-black"
          rows={3}
        />
      </div>

      <div>
        <label className="block font-medium mb-1 text-black">Thứ tự</label>
        <input
          type="number"
          name="order"
          value={formData.order}
          onChange={handleChange}
          className="border rounded-lg w-full px-3 py-2 text-black"
          min={1}
          required
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
        >
          <XCircle size={18} /> Hủy
        </button>
        <button
          type="submit"
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Save size={18} /> Lưu
        </button>
      </div>
    </form>
  );
}
