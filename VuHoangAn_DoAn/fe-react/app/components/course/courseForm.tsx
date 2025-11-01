"use client";

import { useState } from "react";
import { Course } from "@/app/types/course";
import { Save, XCircle } from "lucide-react";

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (data: Course) => void;
  onCancel: () => void;
}

export default function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState<Course>(
    course || { courseId: "", courseName: "", description: "", classes: [] }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
  };

  const handleSubmit = (e: React.FormEvent) => { // hàm xử lý submit form
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!course && (
        <div>
          <label className="block font-medium mb-1 text-black">Mã khóa học</label>
          <input
            type="text"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            placeholder="Nhập mã khóa học - VD: CMP-000"
            className="border rounded-lg w-full px-3 py-2 text-black"
            required
          />
        </div>
      )}

      <div>
        <label className="block font-medium mb-1 text-black">Tên khóa học</label>
        <input
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          placeholder="Nhập tên khóa học, VD: Lập trình web"
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
          placeholder="Nhập mô tả, VD: Khóa học lập trình web"
          className="border rounded-lg w-full px-3 py-2 text-black"
          rows={3}
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
