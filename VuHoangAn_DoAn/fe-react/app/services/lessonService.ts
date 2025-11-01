import { Lesson } from "@/app/types/lesson";

const API_URL = "http://localhost:3000/lessons";

export const lessonService = {
  getByCourse: async (courseId: string): Promise<Lesson[]> => {
    const res = await fetch(`${API_URL}/course/${courseId}`);
    if (!res.ok) throw new Error("Không thể tải danh sách bài học");
    return res.json();
  },
  create: async (data: Lesson): Promise<Lesson> => {
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Thêm bài học thất bại");
    return res.json();
  },
  update: async (lessonId: string, data: Partial<Lesson>): Promise<Lesson> => {
    const res = await fetch(`${API_URL}/${lessonId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Cập nhật bài học thất bại");
    return res.json();
  },
  delete: async (lessonId: string): Promise<void> => {
    const res = await fetch(`${API_URL}/${lessonId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Xóa bài học thất bại");
  }
}