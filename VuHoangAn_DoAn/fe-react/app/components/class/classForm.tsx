"use client";

import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { Class } from "@/app/types/class";

interface ClassFormProps {
  classData?: Class | null;
  onSubmit: (data: Class) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ClassForm({ classData: classData, onSubmit, onCancel, loading }: ClassFormProps) {
  const [form, setForm] = useState<Class>({
    classId: "",
    className: "",
    department: "",
    students: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Class, string>>>({});

  // ✅ Cập nhật form khi user chọn sửa lớp học
  useEffect(() => {
    if (classData) setForm(classData);
  }, [classData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Class, string>> = {};

    if (!form.classId.trim()) newErrors.classId = "Mã lớp là bắt buộc";
    if (!form.className.trim()) newErrors.className = "Tên lớp là bắt buộc";
    if (!form.department.trim()) newErrors.department = "Khoa là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onSubmit(form);
  };

  const handleChange = (field: keyof Class, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900"> 
            {classData ? "Chỉnh sửa lớp học" : "Thêm lớp học mới"}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
            {/* Mã lớp */}
            <div>
              <label className="block text-sm font-medium text-black">Mã lớp *</label>
              <input
                type="text"
                value={form.classId.toString()}
                onChange={(e) => handleChange("classId", e.target.value)}
                className={`mt-1 block w-full border text-black ${
                  errors.classId ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3`}
                placeholder="VD: CTK41"
              />
              {errors.classId && <p className="mt-1 text-sm text-red-600">{errors.classId}</p>}
            </div>

            {/* Tên lớp */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên lớp *</label>
              <input
                type="text"
                value={form.className.toString()}
                onChange={(e) => handleChange("className", e.target.value)}
                className={`mt-1 block w-full border text-black ${
                  errors.className ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3`}
                placeholder="22DTHA1"
              />
              {errors.className && <p className="mt-1 text-sm text-red-600">{errors.className}</p>}
            </div>

            {/* Khoa */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Khoa *</label>
              <input
                type="text"
                value={form.department.toString()}
                onChange={(e) => handleChange("department", e.target.value)}
                className={`mt-1 block w-full border text-black ${
                  errors.department ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3`}
                placeholder="Công nghệ thông tin"
              />
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Đang lưu..." : classData ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}