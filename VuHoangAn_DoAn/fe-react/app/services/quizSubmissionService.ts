import axios from "axios";
import { QuizSubmission} from "../types/quizSubmission";

const BASE_URL = "http://localhost:3000/quizSubmissions";

export const QuizSubmissionService = {
    async submit(data: {
        quizId: string;
        studentId: string;
        answers:{
            questionId: string;
            studentId: string;
            answer: {questionId: string; selectedOptionId: string}[]
        }
    }): Promise<QuizSubmission>{
        const res = await axios.post(`${BASE_URL}/submit`, data);
        return res.data;
    },

    async getByStudent(studentId: string): Promise<QuizSubmission[]>{
        const res = await axios.get(`${BASE_URL}/student/${studentId}`);
        return res.data;
    },
}