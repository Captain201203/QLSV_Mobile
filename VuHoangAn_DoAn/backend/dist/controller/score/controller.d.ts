import { Request, Response } from "express";
export declare const ScoreController: {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<void>;
    remove(req: Request, res: Response): Promise<void>;
};
export default ScoreController;
//# sourceMappingURL=controller.d.ts.map