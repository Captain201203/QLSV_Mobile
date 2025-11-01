"use client";

import { useEffect, useState } from "react";
import { documentService } from "@/app/services/documentService";
import { useParams } from "next/navigation";
import { PlusCircle, Trash2, Save } from "lucide-react";
import dynamic from "next/dynamic";


// Dynamic import để tránh lỗi SSR
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Document {
  documentId?: string;
  lessonId: string;
  title: string;
  content: string;
}

export default function DocumentPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách document theo bài học
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await documentService.getByLesson(lessonId);
        setDocuments(data); // mảng tài liệu
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocs();
  }, [lessonId]);

  const handleAdd = () => {
    setDocuments((prev) => [...prev, { lessonId, title: "", content: "" }]);
  };

  const handleSave = async (index: number) => {
    const doc = documents[index];
    if (!doc.title.trim()) {
      alert("Vui lòng nhập tiêu đề tài liệu");
      return;
    }

    try {
      setLoading(true);
      if (doc.documentId) {
        await documentService.update(doc.documentId, doc);
      } else {
        const created = await documentService.create(doc);
        const updated = [...documents];
        updated[index] = created;
        setDocuments(updated);
      }
      alert("💾 Lưu tài liệu thành công!");
    } catch (error) {
      alert("❌ Lưu tài liệu thất bại!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    const doc = documents[index];
    if (doc.documentId && confirm("Xóa tài liệu này?")) {
      try {
        await documentService.delete(doc.documentId);
      } catch (error) {
        console.error(error);
      }
    }
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Document, value: string) => {
    const updated = [...documents];
    updated[index][field] = value;
    setDocuments(updated);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-black">📚 Tài liệu bài học</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          <PlusCircle size={18} /> Thêm khối nội dung
        </button>
      </div>

      <div className="space-y-6">
        {documents.map((doc, index) => (
          <div
            key={doc.documentId || index}
            className="bg-white shadow-md rounded-xl p-5 space-y-4 border border-gray-200"
          >
            <input
              type="text"
              value={doc.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
              placeholder="Nhập tiêu đề tài liệu..."
              className="w-full p-2 border rounded text-black font-semibold"
            />

            <ReactQuill
              theme="snow"
              value={doc.content}
              onChange={(val) => handleChange(index, "content", val)}
              placeholder="Nhập nội dung tài liệu..."
              className="text-black"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleSave(index)}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
              >
                <Save size={18} /> Lưu
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
              >
                <Trash2 size={18} /> Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
