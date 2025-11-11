"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { documentService } from "@/app/services/documentService";
import { DocumentData } from "@/app/types/document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, ClipboardList } from "lucide-react";
import ProtectedRoute from "@/app/components/auth/proctectedRoute";

export default function StudentDocumentPage() {
  const router = useRouter();
  const params = useParams();
  const { courseId, lessonId } = params as { courseId: string; lessonId: string };
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await documentService.getByLesson(lessonId);
        setDocuments(data);
      } catch (error) {
        console.error("Failed to fetch documents", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [lessonId]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => router.push(`/student/course/${courseId}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tài liệu bài học</h1>
            <Button
              onClick={() =>
                router.push(
                  `/student/course/${courseId}/lesson/${lessonId}/quiz`
                )
              }
              className="flex items-center gap-2"
            >
              <ClipboardList className="h-4 w-4" />
              Bài kiểm tra
            </Button>
          </div>

          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.documentId}>
                  <CardHeader>
                    <CardTitle>{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: doc.content }}
                    />
                  </CardContent>
                </Card>
              ))}

              {documents.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  Chưa có tài liệu nào cho bài học này.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

