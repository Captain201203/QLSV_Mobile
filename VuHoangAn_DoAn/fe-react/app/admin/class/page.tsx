"use client";

import React, { useEffect, useState } from "react";
import { Class } from "@/app/types/class";
import { classService } from "@/app/services/classService";
import { GraduationCap, Plus, Trash2, X } from "lucide-react";
import ClassForm from "@/app/components/class/classForm";

export default function AdminClassPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch danh sách lớp học
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await classService.getAll();
      setClasses(data);
    } catch {
      setMessage({ type: "error", text: "Không thể tải danh sách lớp học." });
    } finally {
      setLoading(false);
    }
  };

  // Thêm / Cập nhật lớp học
  const handleFormSubmit = async (formData: Class) => {
    try {
      if (selectedClass) {
        await classService.update(selectedClass._id!, formData);
        setMessage({ type: "success", text: "✅ Cập nhật lớp học thành công!" });
      } else {
        await classService.create(formData);
        setMessage({ type: "success", text: "✅ Thêm lớp học mới thành công!" });
      }
      setShowForm(false);
      setSelectedClass(null);
      fetchClasses();
    } catch {
      setMessage({ type: "error", text: "❌ Lưu lớp học thất bại." });
    }
  };

  // Xóa 1 lớp học
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa lớp học này?")) return;
    try {
      await classService.delete(id);
      setClasses(prev => prev.filter(c => c._id !== id));
      setMessage({ type: "success", text: "🗑️ Đã xóa lớp học!" });
    } catch {
      setMessage({ type: "error", text: "❌ Xóa thất bại." });
    }
  };

  // Xóa các lớp đã chọn
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm("Xóa tất cả các lớp đã chọn?")) return;
    try {
      for (const id of selectedIds) {
        await classService.delete(id);
      }
      setClasses(prev => prev.filter(c => !selectedIds.includes(c._id!)));
      setSelectedIds([]);
      setMessage({ type: "success", text: "🗑️ Đã xóa các lớp đã chọn!" });
    } catch {
      setMessage({ type: "error", text: "❌ Xóa thất bại." });
    }
  };

  // Xóa tất cả lớp học
  const handleDeleteAll = async () => {
    if (!confirm("Xóa toàn bộ danh sách lớp học?")) return;
    try {
      for (const c of classes) {
        await classService.delete(c._id!);
      }
      setClasses([]);
      setSelectedIds([]);
      setMessage({ type: "success", text: "🗑️ Đã xóa tất cả lớp học!" });
    } catch {
      setMessage({ type: "error", text: "❌ Xóa tất cả thất bại." });
    }
  };

  // Lọc danh sách theo tìm kiếm
  const filteredClasses = classes.filter(c =>
    c.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.classId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chọn hoặc bỏ chọn 1 lớp
  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Chọn tất cả
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredClasses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredClasses.map(c => c._id!));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Lớp học</h1>
          </div>
          <p className="text-gray-600">Thêm, chỉnh sửa và quản lý danh sách lớp học.</p>
        </div>

        {/* Thanh công cụ */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm lớp học..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              <Plus size={16} /> Thêm lớp
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
                selectedIds.length === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              <Trash2 size={16} /> Xóa lớp đã chọn
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={classes.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
                classes.length === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              <X size={16} /> Xóa tất cả
            </button>
          </div>
        </div>

        {/* Thông báo */}
        {message && (
          <div
            className={`p-3 rounded-md border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Bảng danh sách lớp */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : filteredClasses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Không có lớp học nào.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredClasses.length && filteredClasses.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-blue-600"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã lớp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên lớp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khoa</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số sinh viên</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClasses.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c._id!)}
                        onChange={() => toggleSelect(c._id!)}
                        className="w-4 h-4 accent-blue-600"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.classId}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.className}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{c.students?.length || 0}</td>
                    <td className="px-4 py-3 text-sm text-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedClass(c);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(c._id!)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <h2 className="text-lg font-semibold mb-4">
                {selectedClass ? "Cập nhật lớp học" : "Thêm lớp học mới"}
              </h2>
              <ClassForm
                classData={selectedClass}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
