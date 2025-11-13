"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { documentService } from "@/app/services/documentService";
import { DocumentData } from "@/app/types/document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, ClipboardList, CheckCircle2 } from "lucide-react";
import ProtectedRoute from "@/app/components/auth/proctectedRoute";
import { lessonExtraService } from "@/app/services/lessonVideoService";
import { lessonProgressService } from "@/app/services/lessonProgressService";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}
export default function StudentDocumentPage() {
  const router = useRouter();
  const params = useParams();
  const { courseId, lessonId } = params as { courseId: string; lessonId: string };
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [studentId, setStudentId] = useState("");
  const [videoDurationMs, setVideoDurationMs] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [docCompleted, setDocCompleted] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytIntervalRef = useRef<number | null>(null);
  const contentDone = videoCompleted && docCompleted;
  useEffect(() => {
    const s = localStorage.getItem("studentId") || "";
    setStudentId(s);
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
    const fetchVideo = async () => {
      try {
        const res = await lessonExtraService.getVideoByLesson(lessonId);
        setVideoUrl(res.videoUrl || "");
      } catch (e) {
        console.error(e);
        setVideoUrl("");
      }
    };
    fetchDocs();
    fetchVideo()
  }, [lessonId]);

  useEffect(() => {
    if (!studentId) return;
    const loadProgress = async () => {
      try {
        const res = await lessonProgressService.getProgress(lessonId, studentId);
        setVideoCompleted(!!res?.content?.videoCompleted);
        setDocCompleted(!!res?.content?.documentsCompleted);
        if (res?.content?.videoDurationMs) {
          setVideoDurationMs(res.content.videoDurationMs);
        }
      } catch (error) {
        console.error("Failed to load progress", error);
      }
    };
    loadProgress();
  }, [lessonId, studentId]);

  function onLoadedMetadata(e: React.SyntheticEvent<HTMLVideoElement>) {
    const d = (e.currentTarget.duration || 0) * 1000;
    setVideoDurationMs(d);
  }
  const sendVideoProgress = (() => {
    let last = 0;
    return async (watchedMs: number, completed?: boolean, durationOverride?: number) => {
      const durationToUse = durationOverride ?? videoDurationMs;
      if (!studentId || !lessonId || durationToUse <= 0) return;
      const now = Date.now();
      if (completed || now - last > 2000) {
        last = now;
        try {
          const res = await lessonProgressService.setVideoProgress(
            lessonId,
            studentId,
            watchedMs,
            durationToUse,
            completed
          );
          if (res?.content?.videoCompleted) setVideoCompleted(true);
          if (res?.content?.videoDurationMs) setVideoDurationMs(res.content.videoDurationMs);
        } catch {}
      }
    };
  })();
  function onTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
    const watchedMs = (e.currentTarget.currentTime || 0) * 1000;
    if (videoDurationMs > 0) sendVideoProgress(watchedMs);
  }
  function onEnded() {
    if (videoDurationMs > 0) sendVideoProgress(videoDurationMs, true);
  }

  useEffect(() => {
    if (!videoUrl || !isYoutubeUrl(videoUrl)) return;

    const ensureYouTubeAPI = () =>
      new Promise<void>((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
          return;
        }
        const scriptId = "youtube-iframe-api";
        if (!document.getElementById(scriptId)) {
          const tag = document.createElement("script");
          tag.id = scriptId;
          tag.src = "https://www.youtube.com/iframe_api";
          document.body.appendChild(tag);
        }
        const interval = window.setInterval(() => {
          if (window.YT && window.YT.Player) {
            window.clearInterval(interval);
            resolve();
          }
        }, 200);
      });

    ensureYouTubeAPI().then(() => {
      const videoId = extractYoutubeId(videoUrl);
      if (!videoId || !playerContainerRef.current) return;

      ytPlayerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        events: {
          onReady: (event: any) => {
            const duration = event.target.getDuration();
            if (duration) setVideoDurationMs(duration * 1000);
          },
          onStateChange: (event: any) => {
            const player = event.target;
            if (event.data === window.YT.PlayerState.PLAYING) {
              const duration = player.getDuration?.() || 0;
              if (duration > 0) setVideoDurationMs(duration * 1000);
              if (ytIntervalRef.current !== null) {
                window.clearInterval(ytIntervalRef.current);
                ytIntervalRef.current = null;
              }
              ytIntervalRef.current = window.setInterval(() => {
                const currentTime = player.getCurrentTime?.() || 0;
                sendVideoProgress(currentTime * 1000, false, (player.getDuration?.() || 0) * 1000);
              }, 2000);
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.BUFFERING
            ) {
              if (ytIntervalRef.current !== null) {
                window.clearInterval(ytIntervalRef.current);
                ytIntervalRef.current = null;
              }
            } else if (event.data === window.YT.PlayerState.ENDED) {
              if (ytIntervalRef.current !== null) {
                window.clearInterval(ytIntervalRef.current);
                ytIntervalRef.current = null;
              }
              const duration = player.getDuration?.() || 0;
              const durationMs = duration * 1000;
              sendVideoProgress(durationMs, true, durationMs);
            }
          },
        },
      });
    });

    return () => {
      if (ytIntervalRef.current !== null) {
        window.clearInterval(ytIntervalRef.current);
        ytIntervalRef.current = null;
      }
      if (ytPlayerRef.current?.destroy) {
        ytPlayerRef.current.destroy();
      }
      ytPlayerRef.current = null;
      if (playerContainerRef.current) {
        playerContainerRef.current.innerHTML = "";
      }
    };
  }, [videoUrl, studentId, lessonId]);

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
            <div
              className={`border rounded-lg px-4 py-2 ${
                contentDone ? "bg-green-50 border-green-400" : "bg-white border-gray-200"
              } flex items-center gap-2`}
            >
              {contentDone ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <FileText className="h-5 w-5 text-blue-600" />
              )}
              <h1 className={`text-2xl font-bold ${contentDone ? "text-green-700" : "text-gray-900"}`}>
                Tài liệu bài học
              </h1>
            </div>
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

              {/* Video bài học ở cuối trang */}
              {videoUrl && (
                <div className="pt-6 mt-4 border-t">
                  <h2 className="text-xl font-semibold mb-4">Video bài học</h2>
                  {isYoutubeUrl(videoUrl) ? (
                    <>
                      <div
                        ref={playerContainerRef}
                        className="w-full rounded-lg shadow overflow-hidden aspect-video"
                      />
                      <div className="mt-3 text-sm text-gray-500">
                        {!videoCompleted
                          ? "Xem hết video để mở nút đánh dấu đã đọc."
                          : "Video đã hoàn thành."}
                      </div>
                    </>
                  ) : (
                    <video
                      controls
                      className="w-full rounded-lg shadow"
                      src={videoUrl}
                      onLoadedMetadata={onLoadedMetadata}
                      onTimeUpdate={onTimeUpdate}
                      onEnded={onEnded}
                    />
                  )}
                  <Button
                    onClick={async () => {
                      if (!studentId) return;
                      try {
                        const res = await lessonProgressService.setDocumentCompleted(lessonId, studentId, true);
                        if (res?.content?.documentsCompleted) setDocCompleted(true);
                      } catch {}
                    }}
                    disabled={!videoCompleted || docCompleted}
                    className="mt-3"
                  >
                    {docCompleted
                      ? "Đã đọc tài liệu"
                      : videoCompleted
                      ? "Đánh dấu đã đọc"
                      : "Xem xong video để đánh dấu"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}


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
function extractYoutubeId(url: string) {
  try {
    const short = url.match(/youtu\.be\/([^?&]+)/i)?.[1];
    const watch = url.match(/[?&]v=([^&]+)/i)?.[1];
    return short || watch || null;
  } catch {
    return null;
  }
}

