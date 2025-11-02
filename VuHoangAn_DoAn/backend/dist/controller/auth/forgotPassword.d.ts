import { Request, Response } from 'express';
export declare const ForgotPasswordController: {
    requestReset(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    verifyOTP(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=forgotPassword.d.ts.map