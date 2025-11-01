"use client";

import React, { useState } from "react";

import { Subject } from "../../types/subject";

import {Edit, Delete, Plus, Search, Upload} from "lucide-react";

interface SubjectListProps {
  subjects: Subject[];
  onAddNew: (subject: Subject) => void;
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
  loading?: boolean
}

export const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  onEdit,
  onDelete,
  onAddNew,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (subjectId: string) => {
    setShowDeleteConfirm(subjectId);
  };

  const confirmDelete = (subjectId: string) => {
    onDelete(subjectId);
    setShowDeleteConfirm(null);
  };

  if(loading){
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return(
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách môn học

          </h2>
          <div className="flex flex-col sm:flex-row gap3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center poitner-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
              type="text"
              placeholder="Tìm kiếm môn học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button 
            onClick={() => onAddNew({} as Subject)} // Gọi hàm onAddNew khi nhấn nút
            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm môn học
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã môn học
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên môn học
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khoa
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>

          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubjects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy môn học
                </td>
              </tr>
            ) : (
              filteredSubjects.map((subject) => (
                <tr key={subject.subjectId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.subjectId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.subjectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onEdit(subject)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(subject.subjectId)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
    </div>
    {/* Xác nhận xóa */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
          <p>Bạn có chắc chắn muốn xóa môn học này?</p>
          <div className="mt-4">
            <button
              onClick={() => confirmDelete(showDeleteConfirm)}
              className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
            >
              Xóa
            </button>
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md text-sm font-medium text-gray-700 hover:bg-gray-400 ml-2"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
  )
}
</div>
  );
}
