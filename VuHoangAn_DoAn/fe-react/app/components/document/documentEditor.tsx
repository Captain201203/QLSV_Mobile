"use client";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { documentService } from "@/app/services/documentService";
import { DocumentData } from "@/app/types/document";
import { Button } from "@/app/components/ui/button";

interface Props {
  lessonId: string;
}

export default function DocumentEditor({ lessonId }: Props) {
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const load = async () => {
      const result = await documentService.getByLesson(lessonId);
      const list: DocumentData[] = Array.isArray(result) ? result : (result ? [result] : []);
      const first = list[0] ?? null;
      
      setDoc(first);
      setTitle(first?.title ?? "");
      setContent(first?.content ?? "");
    };
    load();
  }, [lessonId]);

  const handleSave = async () => {
    if (doc) {
      const updated = await documentService.update(doc.documentId, { title, content });
      setDoc(updated);
    } else {
      const newDoc = await documentService.create({
        lessonId,
        title,
        content,
      });
      setDoc(newDoc);
    }
    alert("Đã lưu tài liệu!");
  };
  

  return (
    <div className="p-6 space-y-4">
      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="Tiêu đề bài học"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ReactQuill theme="snow" value={content} onChange={setContent} className="bg-white rounded" />
      <Button onClick={handleSave} className="mt-4">Lưu</Button>
    </div>
  );
}
