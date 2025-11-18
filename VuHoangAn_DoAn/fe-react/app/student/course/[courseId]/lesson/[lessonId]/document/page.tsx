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

/**
 * StudentDocumentPage
 * - Hiển thị các document (dangerouslySetInnerHTML)
 * - Hiển thị video (YouTube hoặc MP4)
 * - Ghi progress video -> lessonProgressService.setVideoProgress
 * - Ghi document completed -> lessonProgressService.setDocumentCompleted
 * - Chặn tua (anti-skip) cho cả MP4 và YouTube
 * - LƯU Ý: Anti-skip/Anti-Idle bị TẮT nếu videoCompleted = true
 * - CHỐNG TREO MÁY: Dừng video nếu không có di chuyển chuột trong 30s.
 */

/* global YT */
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

  // state
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [studentId, setStudentId] = useState("");
  const [videoDurationMs, setVideoDurationMs] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [docCompleted, setDocCompleted] = useState(false);

  const contentDone = videoCompleted && docCompleted;

  // Refs for YT and MP4
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytIntervalRef = useRef<number | null>(null);

  // Anti-skip refs (times are in seconds for ease of use with players)
  const lastValidTime = useRef<number>(0); // for MP4 (seconds)
  const ytLastValidTime = useRef<number>(0); // for YouTube (seconds)
  
  // Anti-Idle Ref
  const idleTimerRef = useRef<number | null>(null); // Ref cho Idle Timer

  // constants for MP4 and YT checking
  const YT_INTERVAL_MS = 500;
  const YT_TOLERANCE_SEC = 0.8;
  const IDLE_TIMEOUT_MS = 30000; // 30 giây

  // small helper: convert ms to sec and sec to ms as needed
  const msToSec = (ms: number) => (ms || 0) / 1000;
  const secToMs = (s: number) => Math.round((s || 0) * 1000);
  
  /**
   * Dừng cả MP4 và YouTube player.
   */
  const pauseVideo = () => {
    // 1. Dừng MP4
    if (videoRef.current) {
        videoRef.current.pause();
        console.log("[Anti-Idle] MP4 video paused due to inactivity.");
    }
    // 2. Dừng YouTube
    if (ytPlayerRef.current?.pauseVideo) {
        try {
            ytPlayerRef.current.pauseVideo();
            console.log("[Anti-Idle] YouTube video paused due to inactivity.");
        } catch {}
    }
  };

  /**
   * Đặt lại timer đếm ngược khi có hoạt động của người dùng (chỉ dựa vào mousemove hoặc onPlay).
   */
  const resetIdleTimer = () => {
    // Xóa timer cũ nếu có
    if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
    }

    // Nếu video đã hoàn thành, KHÔNG thiết lập timer chống treo máy (theo yêu cầu)
    if (videoCompleted) return;

    // Thiết lập timer mới: gọi pauseVideo sau IDLE_TIMEOUT_MS
    idleTimerRef.current = window.setTimeout(() => {
        pauseVideo();
    }, IDLE_TIMEOUT_MS);
  };
  
  // Gắn Event Listener cho Anti-Idle
  useEffect(() => {
      // LẮP ĐẶT EVENT LISTENER
      window.addEventListener('mousemove', resetIdleTimer);

      // Kích hoạt lần đầu tiên khi component mount
      resetIdleTimer(); 

      return () => {
          // CLEANUP: Xóa Listener và Timer khi component unmount
          window.removeEventListener('mousemove', resetIdleTimer);
          if (idleTimerRef.current !== null) {
              window.clearTimeout(idleTimerRef.current);
              idleTimerRef.current = null;
          }
      };
  }, [videoCompleted]); // Thêm videoCompleted vào dependency để reset/tắt timer khi video hoàn thành


  // fetch documents and video url
  useEffect(() => {
    const s = localStorage.getItem("studentId") || "";
    setStudentId(s);

    const fetchDocs = async () => {
      try {
        const data = await documentService.getByLesson(lessonId);
        setDocuments(Array.isArray(data) ? data : data ? [data] : []);
      } catch (err) {
        console.error("[StudentDocumentPage] fetchDocs error:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchVideo = async () => {
      try {
        const res = await lessonExtraService.getVideoByLesson(lessonId);
        setVideoUrl(res?.videoUrl || "");
      } catch (err) {
        console.error("[StudentDocumentPage] fetchVideo error:", err);
        setVideoUrl("");
      }
    };

    fetchDocs();
    fetchVideo();
  }, [lessonId]);

  // reset last valid times when switching video
  useEffect(() => {
    lastValidTime.current = 0;
    ytLastValidTime.current = 0;
  }, [videoUrl]);

  // load saved progress initially
  useEffect(() => {
    if (!studentId) return;
    (async () => {
      try {
        const res = await lessonProgressService.getProgress(lessonId, studentId);
        setVideoCompleted(!!res?.content?.videoCompleted);
        setDocCompleted(!!res?.content?.documentsCompleted);
        if (res?.content?.videoDurationMs) setVideoDurationMs(res.content.videoDurationMs);
        // also restore lastValidTime if you stored it server-side (not implemented here)
      } catch (err) {
        console.error("[StudentDocumentPage] loadProgress error:", err);
      }
    })();
  }, [lessonId, studentId]);

  // send progress to backend (throttled inside)
  const sendVideoProgress = (() => {
    let lastSent = 0;
    return async (watchedMs: number, completed?: boolean, durationOverrideMs?: number) => {
      const durationToUse = durationOverrideMs ?? videoDurationMs;
      if (!studentId || !lessonId || durationToUse <= 0) return;
      const now = Date.now();
      if (completed || now - lastSent > 2000) {
        lastSent = now;
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
        } catch (err) {
          console.error("[StudentDocumentPage] setVideoProgress failed", err);
        }
      }
    };
  })();

  /* -------------------------
    MP4 handlers and anti-seek
    ------------------------- */

  function onLoadedMetadata(e: React.SyntheticEvent<HTMLVideoElement>) {
    const dMs = (e.currentTarget.duration || 0) * 1000;
    setVideoDurationMs(dMs);
    console.log("[MP4] loaded metadata duration (ms):", dMs);
  }

  /**
   * Chặn tua: dừng video, đặt lại currentTime về vị trí được chỉ định (hoặc lastValidTime mặc định).
   */
  function blockSeekToAllowed(videoEl: HTMLVideoElement) {
    const allowed = lastValidTime.current || 0; 
    try {
      // 1. Dừng video ngay lập tức
      videoEl.pause(); 
      
      // 2. Đặt lại thời gian
      videoEl.currentTime = allowed;
      
      // 3. Force reset sau 10ms (Rất quan trọng để chặn hành vi native của trình duyệt)
      setTimeout(() => {
          // Double-check: Nếu nó vẫn bị dịch chuyển, force set lại
          if (videoEl.currentTime > allowed + 0.1) {
              videoEl.currentTime = allowed;
              videoEl.pause();
          }
      }, 10); // Delay cực ngắn 10ms

      console.warn(`[MP4] Blocked. Force reset to ${allowed.toFixed(2)}s.`);

    } catch (err) {
      console.warn("[MP4] blockSeekToAllowed failed:", err);
    }
  }

  function onVideoTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>) {
    const cur = e.currentTarget.currentTime || 0;
    const watchedMs = cur * 1000;

    // only increase lastValidTime when time actually progresses forward
    if (cur > lastValidTime.current) {
      lastValidTime.current = cur;
    }

    if (videoDurationMs > 0) {
      sendVideoProgress(watchedMs);
    }
  }

  /**
   * Xử lý khi người dùng bắt đầu tua (seeking). 
   */
  function onVideoSeeking(e: React.SyntheticEvent<HTMLVideoElement>) {
    if (videoCompleted) return; // TẮT ANTI-TRICK NẾU HOÀN THÀNH
    
    const seekTime = e.currentTarget.currentTime || 0;
    const SEEK_TOLERANCE = 0.1; 
    
    // Kiểm tra tua lướt bình thường
    const isSkippingAhead = seekTime > lastValidTime.current + SEEK_TOLERANCE;

    if (isSkippingAhead) {
        console.warn(`[MP4] Seek block detected! Resetting to last valid time (${lastValidTime.current.toFixed(2)}s).`);
        blockSeekToAllowed(e.currentTarget); 
    }
  }

  /**
   * Xử lý khi thao tác tua đã hoàn tất (seeked). Lớp phòng thủ thứ hai.
   */
  function onVideoSeeked(e: React.SyntheticEvent<HTMLVideoElement>) {
    if (videoCompleted) return; // TẮT ANTI-TRICK NẾU HOÀN THÀNH

    const cur = e.currentTarget.currentTime || 0;
    const SEEK_TOLERANCE = 0.5; // Ngưỡng lỏng hơn cho lớp phòng thủ
    
    // Kiểm tra tua lướt bình thường
    const isSkippingAhead = cur > lastValidTime.current + SEEK_TOLERANCE;

    if (isSkippingAhead) {
      console.warn("[MP4] Seeked completed beyond allowed -> reset to last valid time.");
      // Đặt lại về vị trí đã xem cuối cùng
      blockSeekToAllowed(e.currentTarget);
    }
  }

  /**
   * Bắt sự kiện tạm dừng. 
   */
  function onVideoPause(e: React.SyntheticEvent<HTMLVideoElement>) {
      if (videoCompleted) return; // TẮT ANTI-TRICK NẾU HOÀN THÀNH

      const cur = e.currentTarget.currentTime || 0;
      const allowed = lastValidTime.current || 0;
      const PAUSE_SEEK_TOLERANCE = 0.5; // Ngưỡng rộng hơn cho kiểm tra cuối cùng
      
      // Kiểm tra tua lướt bình thường
      const isSkippingAhead = cur > allowed + PAUSE_SEEK_TOLERANCE;

      if (isSkippingAhead) {
          console.warn("[MP4] Pause detected after unauthorized seek. Resetting time.");
          blockSeekToAllowed(e.currentTarget);
      }
  }

  function onEnded() {
    if (videoDurationMs > 0) sendVideoProgress(videoDurationMs, true);
  }

  /* -------------------------
    YouTube player + anti-skip
    ------------------------- */

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mp4IntervalRef = useRef<any>(null);

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

    let mounted = true;

    ensureYouTubeAPI().then(() => {
      if (!mounted) return;
      const videoId = extractYoutubeId(videoUrl);
      if (!videoId || !playerContainerRef.current) return;

      // reset
      ytLastValidTime.current = 0;

      // create player
      ytPlayerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: {
          controls: 1,
          modestbranding: 1,
          rel: 0,
          disablekb: 1, // disable keyboard to reduce bypass
        },
        events: {
          onReady: (event: any) => {
            const dur = event.target.getDuration?.() || 0;
            if (dur) setVideoDurationMs(dur * 1000);
            ytLastValidTime.current = 0;
            console.log("[YT] player ready duration (s):", dur);
          },
          onStateChange: (event: any) => {
            const player = event.target;
            const currentDuration = player.getDuration?.() || 0;
            
            if (event.data === window.YT.PlayerState.PLAYING) {
              const dur = player.getDuration?.() || 0;
              if (dur > 0) setVideoDurationMs(dur * 1000);

              if (ytIntervalRef.current !== null) {
                window.clearInterval(ytIntervalRef.current);
              }
              
              // KHÔNG THIẾT LẬP INTERVAL NẾU VIDEO ĐÃ HOÀN THÀNH
              if (videoCompleted) {
                  console.log("[YT] Video completed, anti-trick skipped.");
                  return; 
              }

              // Gọi resetIdleTimer() ngay khi video bắt đầu PLAY
              resetIdleTimer(); // <--- THÊM DÒNG NÀY

              // check frequently
              ytIntervalRef.current = window.setInterval(() => {
                // KIỂM TRA VIDEO COMPLETED LẠI TRONG INTERVAL (đề phòng state thay đổi)
                if (videoCompleted) { 
                    if (ytIntervalRef.current !== null) {
                        window.clearInterval(ytIntervalRef.current); 
                    }
                    ytIntervalRef.current = null;
                    return;
                }

                try {
                  if (!player || !player.getCurrentTime) return;
                  const currentTime = player.getCurrentTime() || 0;
                  
                  // Kiểm tra tua lướt bình thường
                  const isSkippingAhead = currentTime > ytLastValidTime.current + YT_TOLERANCE_SEC;
                  
                  if (isSkippingAhead) {
                    const seekToTime = ytLastValidTime.current; 
                    
                    console.warn(`[YT] detected skip. Seek to ${seekToTime.toFixed(2)}s.`);
                    
                    try {
                      player.pauseVideo?.();
                    } catch {}
                    try {
                      player.seekTo(seekToTime, true); 
                    } catch (err) {
                      console.warn("[YT] seekTo failed:", err);
                    }
                    // do not update lastValidTime here
                  } else {
                    // normal play - update last valid and send progress
                    ytLastValidTime.current = currentTime;
                    sendVideoProgress(secToMs(currentTime), false, secToMs(currentDuration));
                  }
                } catch (err) {
                  // guard
                }
              }, YT_INTERVAL_MS);
            } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.BUFFERING) {
              if (ytIntervalRef.current !== null) {
                window.clearInterval(ytIntervalRef.current);
                ytIntervalRef.current = null;
              }
            } else if (event.data === window.YT.PlayerState.ENDED) {
              if (ytIntervalRef.current !== null) {
                window.clearInterval(ytIntervalRef.current);
                ytIntervalRef.current = null;
              }
              
              // LOGIC KIỂM TRA TÍNH HỢP LỆ CỦA ENDED
              const totalDuration = currentDuration || 0;
              const lastWatchedTime = ytLastValidTime.current || 0;
              
              // Nếu lastWatchedTime chưa đạt gần đến totalDuration (trong vòng 1s cuối)
              if (totalDuration > 0 && lastWatchedTime < totalDuration - 1) { 
                  
                  const resetTime = lastWatchedTime; 
                  
                  console.warn(`[YT] ENDED event triggered prematurely! Resetting to ${resetTime.toFixed(2)}s.`);
                  
                  // Đặt lại video về vị trí đã xem cuối cùng
                  try {
                      player.seekTo(resetTime, true);
                      player.pauseVideo?.();
                  } catch {}
                  
                  // KHÔNG đánh dấu video đã hoàn thành
                  return; 
              }
              
              // Nếu kiểm tra hợp lệ, Đánh dấu hoàn thành
              sendVideoProgress(secToMs(totalDuration), true, secToMs(totalDuration));
            }
          },
        },
      });
    });

    return () => {
      mounted = false;
      ytLastValidTime.current = 0;
      if (ytIntervalRef.current !== null) {
        window.clearInterval(ytIntervalRef.current);
        ytIntervalRef.current = null;
      }
      if (ytPlayerRef.current?.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
      }
      ytPlayerRef.current = null;
      if (playerContainerRef.current) playerContainerRef.current.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl, studentId, lessonId, videoCompleted]); // Thêm videoCompleted vào dependency list

  /* -------------------------
    UI render
    ------------------------- */

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <Button variant="ghost" onClick={() => router.push(`/student/course/${courseId}`)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <div className="mb-6 flex justify-between items-center">
            <div
              className={`border rounded-lg px-4 py-2 ${
                contentDone ? "bg-green-50 border-green-400" : "bg-white border-gray-200"
              } flex items-center gap-2`}
            >
              {contentDone ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <FileText className="h-5 w-5 text-blue-600" />}
              <h1 className={`text-2xl font-bold ${contentDone ? "text-green-700" : "text-gray-900"}`}>Tài liệu bài học</h1>
            </div>

            <Button onClick={() => router.push(`/student/course/${courseId}/lesson/${lessonId}/quiz`)} className="flex items-center gap-2">
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
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: doc.content }} />
                  </CardContent>
                </Card>
              ))}

              {documents.length === 0 && <div className="text-center py-10 text-gray-500">Chưa có tài liệu nào cho bài học này.</div>}

              {/* Video */}
              {videoUrl && (
                <div className="pt-6 mt-4 border-t">
                  <h2 className="text-xl font-semibold mb-4">Video bài học</h2>

                  {isYoutubeUrl(videoUrl) ? (
                    <>
                      <div ref={playerContainerRef} className="w-full rounded-lg shadow overflow-hidden aspect-video" />
                      <div className="mt-3 text-sm text-gray-500">{!videoCompleted ? "Xem hết video để mở nút đánh dấu đã đọc." : "Video đã hoàn thành."}</div>
                    </>
                  ) : (
                    <video
                      controls
                      disablePictureInPicture
                      controlsList="nodownload noplaybackrate"
                      className="w-full rounded-lg shadow"
                      src={videoUrl}
                      onLoadedMetadata={onLoadedMetadata}
                      onTimeUpdate={onVideoTimeUpdate}
                      onSeeking={onVideoSeeking}
                      onSeeked={onVideoSeeked}
                      onPause={onVideoPause}
                      onPlay={resetIdleTimer} // <--- Đã thêm onPlay
                      onEnded={onEnded}
                      ref={videoRef}
                    />
                  )}

                  <Button
                    onClick={async () => {
                      if (!studentId) return;
                      try {
                        const res = await lessonProgressService.setDocumentCompleted(lessonId, studentId, true);
                        if (res?.content?.documentsCompleted) setDocCompleted(true);
                      } catch (err) {
                        console.error("[StudentDocumentPage] setDocumentCompleted failed", err);
                      }
                    }}
                    disabled={!videoCompleted || docCompleted}
                    className="mt-3"
                  >
                    {docCompleted ? "Đã đọc tài liệu" : videoCompleted ? "Đánh dấu đã đọc" : "Xem xong video để đánh dấu"}
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

/* -------------------------
    Helpers
    ------------------------- */

function isYoutubeUrl(url: string) {
  if (!url) return false;
  return /youtu\.be|youtube\.com/i.test(url);
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