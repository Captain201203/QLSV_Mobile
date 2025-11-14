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
    getByQuiz(quizId: string): Promise<{
        student: (import("mongoose").Document<unknown, {}, import("../../../models/student/model.js").IStudent> & import("../../../models/student/model.js").IStudent & {
            _id: import("mongoose").Types.ObjectId;
        }) | undefined;
        submissionId: string;
        quizId: string;
        studentId: string;
        answers: import("../../../models/exam/quizSubmission/model.js").IAnswer[];
        score: number;
        submittedAt: Date;
        status: "completed" | "locked" | "allowed" | "not_started";
        attempts: number;
        unlockedBy?: string;
        unlockedAt?: Date;
        lockedAt?: Date;
        _id: any;
        __v?: any;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
    }[]>;
    getByQuizAndStudent(quizId: string, studentId: string): Promise<void>;
    unlockSubmission(submissionId: string, adminId: string, reason?: string): Promise<import("mongoose").Document<unknown, {}, IQuizSubmission> & IQuizSubmission & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    lockSubmission(submissionId: string): Promise<import("mongoose").Document<unknown, {}, IQuizSubmission> & IQuizSubmission & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getQuizStatus(quizId: string, studentId: string): Promise<{
        status: string;
        canTake: boolean;
        submission: null;
    } | {
        status: "completed" | "locked" | "allowed" | "not_started";
        canTake: boolean;
        submission: import("mongoose").Document<unknown, {}, IQuizSubmission> & IQuizSubmission & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getScoresByLesson(lessonId: string, studentId: string): Promise<number[]>;
};
//# sourceMappingURL=service.d.ts.map