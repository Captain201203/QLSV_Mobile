import { Request, Response } from 'express';
export declare const ScheduleController: {
    getByClass(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
export default ScheduleController;
//# sourceMappingURL=controller.d.ts.map