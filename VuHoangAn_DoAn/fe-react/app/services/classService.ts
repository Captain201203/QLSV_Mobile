import { Class } from "@/app/types/class";

const API_URL = "http://localhost:3000/classes";

export const classService = {
  async getAll(): Promise<Class[]> {
    try {
      console.log("🔄 Fetching classes from:", API_URL);
      const res = await fetch(API_URL, {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      console.log("📡 Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", errorText);
        throw new Error(`Failed to fetch classes: ${res.status} ${res.statusText}`); // Cập nhật thông báo lỗi
      }
      
      const data = await res.json();
      console.log("✅ Classes fetched successfully:", data.length, "classes");
      return data;
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  },

  async create(data: Class): Promise<Class> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create student");
    return res.json();
  },

  async update(id: string, data: Class): Promise<Class> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update student");
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete class");
  },
};
