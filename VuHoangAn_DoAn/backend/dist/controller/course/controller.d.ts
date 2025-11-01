import { Request, Response } from 'express';
export declare const CourseController: {
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    addClass(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    removeClass(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getClasses(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
export default CourseController;
//# sourceMappingURL=controller.d.ts.map