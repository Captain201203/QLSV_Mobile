import { Request, Response } from 'express';
export declare const getStudentInClass: (req: Request, res: Response) => Promise<void>;
export declare const StudentController: {
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    loginStudent(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    importExcel(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getSubjectByStudent(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=controller.d.ts.map