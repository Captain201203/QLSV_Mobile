import { Student } from "@/app/types/student";

const API_URL = "http://localhost:3000/students";

  

export const studentService = {
  async getAll(): Promise<Student[]> {
    try {
      console.log("🔄 Fetching students from:", API_URL);
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
        throw new Error(`Failed to fetch students: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("✅ Students fetched successfully:", data.length, "students");
      return data;
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  },

  async create(data: Student): Promise<Student> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // 
      body: JSON.stringify(data),// 
    });
    if (!res.ok) throw new Error("Failed to create student");
    return res.json();
  },

  async update(id: string, data: Student): Promise<Student> {
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
    if (!res.ok) throw new Error("Failed to delete student");
  },
};
