"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { documentService } from "@/app/services/documentService";
import { lessonExtraService } from "@/app/services/lessonVideoService";

import {
  PlusCircle,
  Trash2,
  Save,
  Loader2,
  FileText,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Import ReactQuill (soạn thảo nội dung)
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

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
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [savingVideo, setSavingVideo] = useState<boolean>(false);

  // ------------------ FETCH DATA ------------------
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await documentService.getByLesson(lessonId);
        setDocuments(data);
      } catch (err) {
        console.error("Lỗi khi tải tài liệu:", err);
      }
    };

    const fetchVideo = async () => {
      try {
        const res = await lessonExtraService.getVideoByLesson(lessonId);
        setVideoUrl(res.videoUrl || "");
      } catch (err) {
        console.error("Lỗi khi tải video:", err);
        setVideoUrl("");
      }
    };

    fetchDocs();
    fetchVideo();
  }, [lessonId]);

  // ------------------ CRUD TÀI LIỆU ------------------
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
      console.error("Lưu thất bại:", error);
      alert("❌ Lưu tài liệu thất bại!");
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
        console.error("Lỗi khi xóa tài liệu:", error);
      }
    }
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Document, value: string) => {
    const updated = [...documents];
    updated[index][field] = value;
    setDocuments(updated);
  };

  // ------------------ VIDEO HANDLER ------------------
  const handleSaveVideo = async () => {
    try {
      setSavingVideo(true);
      await lessonExtraService.setVideoByLesson(lessonId, videoUrl.trim());
      alert("💾 Lưu video thành công!");
    } catch (e) {
      console.error("Lưu video thất bại:", e);
      alert("❌ Lưu video thất bại!");
    } finally {
      setSavingVideo(false);
    }
  };

  // ------------------ ĐIỀU HƯỚNG ------------------
  const goToQuizPage = () => {
    router.push(`/admin/course/${courseId}/lesson/${lessonId}/quiz`);
  };

  // ------------------ JSX ------------------
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Tiêu đề & nút chức năng */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">📚 Tài liệu bài học</h1>

        <div className="flex gap-3">
          <Button
            onClick={goToQuizPage}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <FileText size={18} /> Quản lý bài kiểm tra
          </Button>

          <Button
            onClick={handleAdd}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <PlusCircle size={18} /> Thêm khối nội dung
          </Button>
        </div>
      </div>

      {/* Danh sách tài liệu */}
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
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Save size={18} />
                )}
                Lưu
              </Button>

              <Button
                variant="destructive"
                disabled={loading}
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

      {/* Khu vực video bài học */}
      <div className="mt-10 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">🎬 Video bài học</h2>

        <Input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Dán link YouTube/MP4, ví dụ: https://youtu.be/xxxx hoặc https://cdn.example.com/file.mp4"
          className="mb-3"
        />

        <div className="flex gap-3">
          <Button
            onClick={handleSaveVideo}
            disabled={savingVideo}
            className="cursor-pointer flex items-center gap-2"
          >
            {savingVideo ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : null}
            {savingVideo ? "Đang lưu..." : "Lưu video"}
          </Button>
        </div>

        {/* Xem thử video */}
        {videoUrl && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Xem thử:</p>
            {isYoutubeUrl(videoUrl) ? (
              <iframe
                width="100%"
                height="420"
                className="rounded-md"
                src={convertToYoutubeEmbed(videoUrl)}
                title="Video bài học (preview)"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                controls
                className="w-full rounded-md"
                src={videoUrl}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------ Helper functions ------------------
function isYoutubeUrl(url: string) {
  return /youtu\.be|youtube\.com/i.test(url);
}

function convertToYoutubeEmbed(url: string) {
  try {
    const short = url.match(/youtu\.be\/([^?&]+)/i)?.[1];
    const watch = url.match(/[?&]v=([^&]+)/i)?.[1];
    const id = short || watch;
    return id ? `https://www.youtube.com/embed/${id}` : url;
  } catch {
    return url;
  }
}
