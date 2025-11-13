"use client";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { documentService } from "@/app/services/documentService";
import { DocumentData } from "@/app/types/document";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

interface Props {
  lessonId: string;
}

export default function DocumentEditor({ lessonId }: Props) {
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { // khi lessonId thay đổi thì tải tài liệu
    const load = async () => {
      const result = await documentService.getByLesson(lessonId);
      const list: DocumentData[] = Array.isArray(result)
        ? result
        : result // nếu API trả về một tài liệu đơn lẻ thì chuyển thành mảng
        ? [result] // nếu chỉ có một tài liệu thì bọc vào mảng
        : []; // đảm bảo luôn là mảng
      const first = list[0] ?? null;
      setDoc(first);
      setTitle(first?.title ?? "");
      setContent(first?.content ?? "");
    };
    load();
  }, [lessonId]);

  const handleSave = async () => { // lưu tài liệu
    try {
      setSaving(true);
      if (doc) {
        const updated = await documentService.update(doc.documentId, { // cập nhật tài liệu nếu đã có
          title,
          content,
        });
        setDoc(updated);
      } else {
        const newDoc = await documentService.create({ // tạo mới tài liệu nếu chưa có
          lessonId,
          title,
          content,
        });
        setDoc(newDoc);
      }
      alert("✅ Đã lưu tài liệu!");
    } catch (error) {
      console.error(error);
      alert("❌ Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const modules = { // cấu hình thanh công cụ của ReactQuill
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  return (
    <Card className="p-4 bg-white shadow-md rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          📝 Trình soạn thảo tài liệu bài học
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <input
          type="text"
          className="border border-gray-300 p-3 w-full rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập tiêu đề tài liệu..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="quill-container bg-white border rounded-lg overflow-hidden">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Nhập nội dung bài học tại đây..."
            className="min-h-[300px]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Lưu tài liệu
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
