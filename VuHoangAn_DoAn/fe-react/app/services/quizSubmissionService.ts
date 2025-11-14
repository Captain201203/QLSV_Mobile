import axios from "axios";
import { QuizStatus, QuizSubmission} from "../types/quizSubmission";

const BASE_URL = "http://localhost:3000/quizSubmissions";

export const QuizSubmissionService = {
    async submit(data: {
        quizId: string;
        studentId: string;
        answers: {
            questionId: string;
            selectedOption: string;
        }[];
    }): Promise<QuizSubmission>{
        const res = await axios.post(`${BASE_URL}/submit`, data);
        return res.data;
    },

    async getByStudent(studentId: string): Promise<QuizSubmission[]>{
        const res = await axios.get(`${BASE_URL}/student/${studentId}`);
        return res.data;
    },

    async getByQuiz(quizId: string): Promise<QuizSubmission[]>{
        const res = await axios.get(`${BASE_URL}/quiz/${quizId}`);
        return res.data
    },

    async getQuizStatus(quizId: string, studentId: string): Promise<QuizStatus>{
        const res = await axios.get(`${BASE_URL}/quiz/${quizId}/student/${studentId}/status`);
        return res.data
    },

    async unlockSubmission(submissionId: string, adminId: string, reason?: string): Promise<QuizSubmission>{
        const res = await axios.put(`${BASE_URL}/${submissionId}/unlock`, {
            adminId,
            reason
        });
        return res.data;
    },

    async lockSubmission(submissionId: string): Promise<QuizSubmission>{
        const res = await axios.put(`${BASE_URL}/${submissionId}/lock`);
        return res.data;
    },

   async getScoresByLesson(lessonId: string, studentId: string): Promise<number[]>{
        // Thêm "/scores" vào cuối đường dẫn
        const res = await axios.get(`${BASE_URL}/lesson/${lessonId}/student/${studentId}/scores`);
        return res.data;
    }
}
