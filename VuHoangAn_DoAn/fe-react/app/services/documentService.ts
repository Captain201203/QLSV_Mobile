import { DocumentData } from "@/app/types/document";

const API_URL = "http://localhost:3000/documents";

export const documentService = {
  async getByLesson(lessonId: string): Promise<DocumentData[]> {
    const res = await fetch(`${API_URL}/lesson/${lessonId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Không thể tải tài liệu");
    return res.json();
  },

  async create(data: Omit<DocumentData, "documentId" | "updatedAt">): Promise<DocumentData> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Tạo tài liệu thất bại");
    return res.json();
  },
  

  async update(documentId: string, data: Partial<DocumentData>): Promise<DocumentData> {
    const res = await fetch(`${API_URL}/${documentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Cập nhật tài liệu thất bại");
    return res.json();
  },

  async delete(documentId: string): Promise<void> {
    const res = await fetch(`${API_URL}/${documentId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Xóa tài liệu thất bại");
  },


 
};
