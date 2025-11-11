"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QuizSubmissionService } from "@/app/services/quizSubmissionService";
import { QuizSubmission } from "@/app/types/quizSubmission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Eye } from "lucide-react";
import UnlockModal from "@/app/components/quiz/unlockModal";

export default function QuizSubmissionsPage() {
  const params = useParams();
  const { quizId } = params;
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await QuizSubmissionService.getByQuiz(quizId as string);
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
        alert("Không thể tải danh sách submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [quizId]);

  const handleUnlock = async (submissionId: string, adminId: string, reason?: string) => {
    try {
      await QuizSubmissionService.unlockSubmission(submissionId, adminId, reason);
      alert("Mở khóa thành công!");
      setShowUnlockModal(false);
      // Refresh danh sách
      const data = await QuizSubmissionService.getByQuiz(quizId as string);
      setSubmissions(data);
    } catch (error: any) {
      alert(error.response?.data?.error || "Mở khóa thất bại");
    }
  };

  const handleLock = async (submissionId: string) => {
    if (!confirm("Bạn có chắc muốn khóa lại bài kiểm tra này?")) return;
    try {
      await QuizSubmissionService.lockSubmission(submissionId);
      alert("Khóa thành công!");
      const data = await QuizSubmissionService.getByQuiz(quizId as string);
      setSubmissions(data);
    } catch (error: any) {
      alert(error.response?.data?.error || "Khóa thất bại");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-blue-500">Đã hoàn thành</Badge>;
      case 'locked':
        return <Badge className="bg-red-500">Đã khóa</Badge>;
      case 'allowed':
        return <Badge className="bg-green-500">Được phép làm lại</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Danh sách Submissions</h1>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.submissionId}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sinh viên: {submission.studentId}</CardTitle>
                  <p className="text-gray-600">Điểm: {submission.score}%</p>
                </div>
                {getStatusBadge(submission.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Số lần làm: {submission.attempts}
                  </p>
                  <p className="text-sm text-gray-500">
                    Nộp lúc: {new Date(submission.submittedAt).toLocaleString("vi-VN")}
                  </p>
                  {submission.unlockedAt && (
                    <p className="text-sm text-gray-500">
                      Mở khóa lúc: {new Date(submission.unlockedAt).toLocaleString("vi-VN")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Xem chi tiết submission
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                  {submission.status === 'locked' || submission.status === 'completed' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setShowUnlockModal(true);
                      }}
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Mở khóa
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLock(submission.submissionId)}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Khóa lại
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Chưa có sinh viên nào làm bài kiểm tra này.
        </div>
      )}

      {showUnlockModal && selectedSubmission && (
        <UnlockModal
          submission={selectedSubmission}
          onUnlock={(adminId, reason) =>
            handleUnlock(selectedSubmission.submissionId, adminId, reason)
          }
          onClose={() => {
            setShowUnlockModal(false);
            setSelectedSubmission(null);
          }}
        />
      )}
    </div>
  );
}