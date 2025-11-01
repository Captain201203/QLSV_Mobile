import { Request, Response } from 'express';
export declare const ClassController: {
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getStudentsInClass(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getStudentsInClassByName(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    importExcel(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=controller.d.ts.map