import { IScore } from "../../models/score/model.js";
export declare const ScoreService: {
    create(data: {
        studentId: String;
        subjectId: String;
        ex1Score: Number;
        ex2Score: Number;
        finalScore: Number;
        semester: String;
        academicYear: String;
    }): Promise<IScore>;
    getAll(filter?: any): Promise<IScore[]>;
    getById(id: string): Promise<IScore | null>;
    update(id: string, data: Partial<IScore>): Promise<IScore | null>;
    remove(id: string): Promise<void>;
};
export default ScoreService;
//# sourceMappingURL=service.d.ts.map