import { Request, Response } from "express";
export declare const quizSubmissionController: {
    submit(req: Request, res: Response): Promise<void>;
    getByStudent(req: Request, res: Response): Promise<void>;
    getByQuiz(req: Request, res: Response): Promise<void>;
    getQuizStatus(req: Request, res: Response): Promise<void>;
    unlockSubmission(req: Request, res: Response): Promise<void>;
    lockSubmission(req: Request, res: Response): Promise<void>;
    getScoresByLesson(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=controller.d.ts.map