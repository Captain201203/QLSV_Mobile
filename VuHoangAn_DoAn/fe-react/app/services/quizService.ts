import axios from "axios";
import { Quiz } from "../types/quiz";

const BASE_URL = "http://localhost:3000/quizzes";

export const QuizService = {
  async getByLesson(lessonId: string): Promise<Quiz[]> {
    const res = await axios.get(`${BASE_URL}/lesson/${encodeURIComponent(lessonId)}` , {
      headers: { 'Cache-Control': 'no-cache' },
      params: { t: Date.now() }
    });
    const data = res.data;
    return Array.isArray(data) ? data : (data ? [data] : []);
  },

  async create(data: Quiz): Promise<Quiz> {
    const res = await axios.post(BASE_URL, data);
    return res.data;
  },

  async update(quizId: string, data: Partial<Quiz>): Promise<Quiz> {
    const res = await axios.put(`${BASE_URL}/${quizId}`, data);
    return res.data;
  },

  async delete(quizId: string): Promise<void> {
    await axios.delete(`${BASE_URL}/${quizId}`);
  },

  async getById(quizId: string): Promise<Quiz> {
    const response = await axios.get(`${BASE_URL}/${quizId}`);
    return response.data;
  }
}
