"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { documentService } from "@/app/services/documentService";

import { PlusCircle, Trash2, Save, Loader2, FileText } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lesson } from "@/app/types/lesson";

// Import ReactQuill (soạn thảo nội dung)
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Props {
  lesson: Lesson;
  courseId: string; // cần biết để định tuyến đúng
  onEdit: () => void;
  onDelete: () => void;
}
interface Document {
  documentId?: string;
  lessonId: string;
  title: string;
  content: string;
}

export default function DocumentPage() {
  const router = useRouter();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await documentService.getByLesson(lessonId);
        setDocuments(data);
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

  // 👉 Hàm điều hướng sang trang quản lý bài kiểm tra
  const goToQuizPage = () => {
     router.push(`/admin/course/${courseId}/lesson/${lessonId}/quiz`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">📚 Tài liệu bài học</h1>

        <div className="flex gap-3">
          <Button
            onClick={goToQuizPage}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <FileText size={18} /> Quản lý bài kiểm tra
          </Button>

          <Button onClick={handleAdd} className="flex items-center gap-2">
            <PlusCircle size={18} /> Thêm khối nội dung
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {documents.map((doc, index) => (
          <Card key={doc.documentId || index} className="shadow-sm border border-gray-200">
            <CardHeader>
              <Input
                type="text"
                value={doc.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                placeholder="Nhập tiêu đề tài liệu..."
                className="font-semibold text-gray-800"
              />
            </CardHeader>

            <Separator />

            <CardContent className="pt-4">
              <ReactQuill
                theme="snow"
                value={doc.content}
                onChange={(val) => handleChange(index, "content", val)}
                placeholder="Nhập nội dung tài liệu..."
                className="text-black rounded-lg"
              />
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button
                variant="default"
                disabled={loading}
                onClick={() => handleSave(index)}
                className="cursor-pointer flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={18} />}
                Lưu
              </Button>

              <Button
                variant="destructive"
                onClick={() => handleDelete(index)}
                className="cursor-pointer flex items-center gap-2"
              >
                <Trash2 size={18} />
                Xóa
              </Button>
            </CardFooter>
          </Card>
        ))}

        {documents.length === 0 && (
          <div className="text-center text-gray-500 mt-10 italic">
            Chưa có tài liệu nào. Hãy nhấn “Thêm khối nội dung” để bắt đầu.
          </div>
        )}
      </div>
    </div>
  );
}
