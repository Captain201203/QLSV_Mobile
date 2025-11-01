"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Subject } from "@/app/types/subject";
import { subjectService } from "@/app/services/subjectService";
import SubjectForm from "@/app/components/subject/subjectForm";
import { GraduationCap, Users, BookOpen, TrendingUp, XCircle } from "lucide-react";

export default function AdminSubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (err) {
      console.error("❌ Lỗi tải môn học:", err);
      setMessage({ type: "error", text: "Không thể tải danh sách môn học." });
    } finally {
      setLoading(false);
    }
  };

  // Tự ẩn thông báo sau 4 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // CRUD
  const handleAddNew = () => {
    setSelectedSubject(null);
    setShowForm(true);
  };

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: Subject) => {
    try {
      setFormLoading(true);
      if (selectedSubject) {
        await subjectService.update(selectedSubject._id!, formData);
        setMessage({ type: "success", text: "✅ Cập nhật môn học thành công!" });
      } else {
        await subjectService.create(formData);
        setMessage({ type: "success", text: "✅ Thêm môn học mới thành công!" });
      }
      await fetchSubjects();
      setShowForm(false);
      setSelectedSubject(null);
    } catch (err) {
      console.error("❌ Lỗi lưu môn học:", err);
      setMessage({
        type: "error",
        text: selectedSubject
          ? "Cập nhật môn học thất bại. Vui lòng thử lại."
          : "Thêm môn học thất bại. Vui lòng thử lại.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await subjectService.delete(id);
      setMessage({ type: "success", text: "🗑️ Xóa môn học thành công!" });
      setSubjects((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("❌ Lỗi xóa môn học:", err);
      setMessage({ type: "error", text: "Xóa môn học thất bại!" });
    }
  };

  const toggleSelect = (id?: string) => {
    if (!id) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllVisible = (visibleList: Subject[]) => {
    const visibleIds = visibleList.map((s) => s._id!).filter(Boolean);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    else setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} môn học đã chọn?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => subjectService.delete(id)));
      setMessage({ type: "success", text: `🗑️ Đã xóa ${selectedIds.length} môn học!` });
      setSubjects((prev) => prev.filter((s) => !selectedIds.includes(s._id!)));
      setSelectedIds([]);
    } catch (err) {
      console.error("❌ Lỗi xóa nhiều môn học:", err);
      setMessage({ type: "error", text: "Xóa nhiều môn học thất bại!" });
    }
  };

  const deleteAll = async () => {
    if (!confirm("Bạn có chắc muốn xóa TẤT CẢ môn học không?")) return;
    try {
      for (const s of subjects) {
        if (s._id) await subjectService.delete(s._id);
      }
      setMessage({ type: "success", text: "🗑️ Đã xóa tất cả môn học!" });
      await fetchSubjects();
      setSelectedIds([]);
    } catch (err) {
      console.error("❌ Lỗi khi xóa tất cả:", err);
      setMessage({ type: "error", text: "Xóa tất cả thất bại!" });
    }
  };

  // Lọc theo tìm kiếm
  const filteredSubjects = subjects.filter((s) =>
    [s.subjectName, s.subjectId, s.department]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ===== UI =====
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Môn học</h1>
          </div>
          <p className="text-gray-600">
            Thêm, chỉnh sửa và quản lý danh sách các môn học trong hệ thống.
          </p>
        </div>

        {/* Thanh tìm kiếm + Xóa */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã môn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-4 py-2 flex-1 text-black"
          />
          <button
            onClick={bulkDelete}
            disabled={selectedIds.length === 0}
            className="bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Xóa đã chọn ({selectedIds.length})
          </button>
          <button onClick={deleteAll} className="bg-gray-700 text-white px-4 py-2 rounded-md">
            Xóa tất cả
          </button>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            + Thêm môn học
          </button>
        </div>

        {/* Thông báo */}
        {message && (
          <div
            className={`mb-6 rounded-md p-4 border flex items-center ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex-1 text-sm font-medium">{message.text}</div>
            <button onClick={() => setMessage(null)} className="ml-3 text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        )}

        {/* Danh sách môn học */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách môn học</h2>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={
                  filteredSubjects.length > 0 &&
                  filteredSubjects.every((s) => s._id && selectedIds.includes(s._id))
                }
                onChange={() => selectAllVisible(filteredSubjects)}
              />
              Chọn tất cả (hiển thị)
            </label>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã môn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên môn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khoa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tín chỉ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubjects.map((subject) => (
                    <tr key={subject._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={subject._id ? selectedIds.includes(subject._id) : false}
                            onChange={() => toggleSelect(subject._id)}
                          />
                          {subject.subjectId}
                        </label>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{subject.subjectName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{subject.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{subject.credits}</td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button onClick={() => handleEdit(subject)} className="text-blue-600 hover:text-blue-900">
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Bạn có chắc muốn xóa môn học này?")) handleDelete(subject._id!);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredSubjects.length === 0 && (
                <div className="p-8 text-center text-gray-500">Không có môn học nào phù hợp.</div>
              )}
            </div>
          )}
        </div>

        {/* Form (Modal) */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {selectedSubject ? "Cập nhật môn học" : "Thêm môn học mới"}
              </h3>
              <SubjectForm
                subject={selectedSubject}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedSubject(null);
                }}
                loading={formLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
