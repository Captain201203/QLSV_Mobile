import { IQuizSubmission } from "../../../models/exam/quizSubmission/model.js";
export declare const QuizSubMissionService: {
    submit(data: {
        quizId: string;
        studentId: string;
        answers: {
            questionId: string;
            selectedOption: string;
        }[];
    }): Promise<import("mongoose").Document<unknown, {}, IQuizSubmission> & IQuizSubmission & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getByStudent(studentId: string): Promise<(import("mongoose").Document<unknown, {}, IQuizSubmission> & IQuizSubmission & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
};
//# sourceMappingURL=service.d.ts.map