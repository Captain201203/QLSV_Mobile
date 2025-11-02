export declare const AuthService: {
    initiatePasswordReset(email: string): Promise<{
        sessionId: string;
    }>;
    verifyOTP(sessionId: string, providedOTP: string): Promise<boolean>;
    resetPassword(sessionId: string, newPassword: string): Promise<void>;
};
//# sourceMappingURL=service.d.ts.map