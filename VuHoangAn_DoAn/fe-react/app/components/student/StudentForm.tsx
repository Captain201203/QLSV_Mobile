"use client";

import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { Student } from "@/app/types/student";

interface StudentFormProps {
  student?: Student | null;
  onSubmit: (data: Student) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function StudentForm({ student, onSubmit, onCancel, loading }: StudentFormProps) {
  const [form, setForm] = useState<Student>({
    studentId: "",
    studentName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    className: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>({});

  // ✅ Cập nhật form khi user chọn sửa sinh viên
  useEffect(() => {
    if (student) setForm(student);
  }, [student]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Student, string>> = {};

    if (!form.studentId.trim()) newErrors.studentId = "Mã sinh viên là bắt buộc";
    if (!form.studentName.trim()) newErrors.studentName = "Họ tên là bắt buộc";
    if (!form.dateOfBirth.trim()) newErrors.dateOfBirth = "Ngày sinh là bắt buộc";

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!form.className.trim()) newErrors.className = "Lớp là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onSubmit(form);
  };

  const handleChange = (field: keyof Student, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900"> 
            {student ? "Chỉnh sửa sinh viên" : "Thêm sinh viên mới"}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
            {/* Mã sinh viên */}
            <div>
                <label className="block text-sm font-medium text-black">Mã sinh viên *</label>
                <input
                type="text"
                value={form.studentId} // gán value từ state form
                onChange={(e) => handleChange("studentId", e.target.value)} // Cập nhật state khi người dùng nhập
                className={`mt-1 block w-full border text-black ${ // Bắt đầu lớp CSS với margin-top 1, block hiển thị đầy đủ chiều rộng
                  errors.studentId ? "border-red-500" : "border-gray-300" // Hiển thị viền đỏ nếu có lỗi, nếu không thì viền xám
                } rounded-md shadow-sm py-2 px-3`} // Các lớp Tailwind CSS cho kiểu dáng, shadow-sm là bóng mờ
                placeholder="VD: 20210001"
              />
              {errors.studentId && <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>}
            </div>

            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và tên *</label>
              <input
                type="text"
                value={form.studentName}
                onChange={(e) => handleChange("studentName", e.target.value)}
                className={`mt-1 block w-full border text-black ${
                  errors.studentName ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3`}
                placeholder="Nguyễn Văn A"
              />
              {errors.studentName && <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>}
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Ngày sinh *</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className={`mt-1 block w-full border text-black ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3`}
              />
              {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Số điện thoại *</label> {/*block text-sm là kiểu chữ nhỏ, font-medium là độ đậm vừa*/}
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className={`mt-1 block w-full border text-black ${ // mt là margin-top, block là hiển thị khối, w-full border là chiều rộng đầy đủ với viền
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3`}
                placeholder="0912345678"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`mt-1 block w-full border text-black ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3`}
                placeholder="student@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Lớp */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Lớp *</label>
              <input
                type="text"
                value={form.className}
                onChange={(e) => handleChange("className", e.target.value)}
                className={`mt-1 block w-full border text-black ${
                  errors.className ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3`}
                placeholder="CTK41"
              />
              {errors.className && <p className="mt-1 text-sm text-red-600">{errors.className}</p>}
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
              {loading ? "Đang lưu..." : student ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
