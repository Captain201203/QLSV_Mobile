"use client";

import React, { useState, useEffect } from "react";
import { Student } from "@/app/types/student";
import { studentService } from "@/app/services/studentService";
import StudentForm from "@/app/components/student/StudentForm";
import { GraduationCap, Users, BookOpen, TrendingUp, XCircle } from "lucide-react";

export default function AdminStudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách sinh viên:", err);
      setMessage({ type: "error", text: "Không thể tải danh sách sinh viên." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAddNew = () => {
    setSelectedStudent(null);
    setShowForm(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: Student) => {
    try {
      setFormLoading(true);
      if (selectedStudent) {
        await studentService.update(selectedStudent._id!, formData);
        setMessage({ type: "success", text: "✅ Cập nhật sinh viên thành công!" });
      } else {
        await studentService.create(formData);
        setMessage({ type: "success", text: "✅ Thêm sinh viên mới thành công!" });
      }
      await fetchStudents();
      setShowForm(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("❌ Lỗi lưu sinh viên:", err);
      setMessage({ type: "error", text: "Không thể lưu sinh viên." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sinh viên này?")) return;
    try {
      await studentService.delete(id);
      setMessage({ type: "success", text: "🗑️ Xóa sinh viên thành công!" });
      await fetchStudents();
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    } catch (err) {
      console.error("❌ Lỗi xóa sinh viên:", err);
      setMessage({ type: "error", text: "Xóa sinh viên thất bại." });
    }
  };

  const toggleSelect = (id?: string) => {
    if (!id) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const selectAllVisible = (visible: Student[]) => {
    const visibleIds = visible.map((s) => s._id!).filter(Boolean);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} sinh viên đã chọn?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => studentService.delete(id)));
      setMessage({ type: "success", text: `🗑️ Đã xóa ${selectedIds.length} sinh viên.` });
      setSelectedIds([]);
      await fetchStudents();
    } catch (err) {
      console.error("❌ Lỗi xóa nhiều sinh viên:", err);
      setMessage({ type: "error", text: "Không thể xóa sinh viên." });
    }
  };

  const deleteAll = async () => {
    if (!confirm("Bạn có chắc muốn xóa TẤT CẢ sinh viên không?")) return;
    try {
      for (const s of students) {
        if (s._id) await studentService.delete(s._id);
      }
      setMessage({ type: "success", text: "🗑️ Đã xóa tất cả sinh viên." });
      setSelectedIds([]);
      await fetchStudents();
    } catch (err) {
      console.error("❌ Lỗi xóa tất cả:", err);
      setMessage({ type: "error", text: "Không thể xóa tất cả sinh viên." });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedStudent(null);
  };

  // Lọc sinh viên theo tìm kiếm
  const filtered = students.filter((s) =>
    [s.studentName, s.studentId, s.email, s.className]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Sinh viên</h1>
        </div>

        {/* Thanh tìm kiếm + Xóa nhiều */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên, mã, lớp..."
            className="border p-2 rounded flex-1 text-black"
          />
          <button
            onClick={() => setSearch("")}
            className="px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200 text-black"
          >
            Làm mới
          </button>
          <button
            onClick={bulkDelete}
            disabled={selectedIds.length === 0}
            className="px-3 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            Xóa đã chọn ({selectedIds.length})
          </button>
          <button
            onClick={deleteAll}
            className="px-3 py-2 bg-gray-700 text-white rounded"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Thông báo */}
        {message && (
          <div
            className={`mb-6 rounded-md p-4 border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Danh sách sinh viên */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  filtered.length > 0 &&
                  filtered.every((s) => s._id && selectedIds.includes(s._id))
                }
                onChange={() => selectAllVisible(filtered)}
              />
              <span className="text-sm text-gray-700">Chọn tất cả (hiển thị)</span>
            </label>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + Thêm sinh viên
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600">Đang tải...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-black px-6 py-3 text-left text-gray-500 uppercase text-xs">
                      MSSV
                    </th>
                    <th className="text-black px-6 py-3 text-left text-gray-500 uppercase text-xs">
                      Họ tên
                    </th>
                    <th className="text-black px-6 py-3 text-left text-gray-500 uppercase text-xs">
                      Ngày sinh
                    </th>
                    <th className="text-black px-6 py-3 text-left text-gray-500 uppercase text-xs">
                      Email
                    </th>
                    <th className="text-black px-6 py-3 text-left text-gray-500 uppercase text-xs">
                      Lớp
                    </th>
                    <th className="text-black px-6 py-3 text-left text-gray-500 uppercase text-xs">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filtered.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="text-black px-6 py-4 text-gray-900">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              student._id ? selectedIds.includes(student._id) : false
                            }
                            onChange={() => toggleSelect(student._id)}
                          />
                          <span>{student.studentId}</span>
                        </label>
                      </td>
                      <td className="text-black px-6 py-4">{student.studentName}</td>
                      <td className="text-black px-6 py-4">
                        {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="text-black px-6 py-4">{student.email}</td>
                      <td className="text-black px-6 py-4">{student.className}</td>
                      <td className="text-black px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="cursor-pointer text-blue-600 hover:text-blue-900"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(student._id!)}
                          className="cursor-pointer text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Không tìm thấy sinh viên nào.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form sinh viên */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {selectedStudent ? "Cập nhật sinh viên" : "Thêm sinh viên mới"}
              </h3>
              <StudentForm
                student={selectedStudent}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                loading={formLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
