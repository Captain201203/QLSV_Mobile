"use client";

import { use, useState } from "react";
import { QuizSubmissionService } from "@/app/services/quizSubmissionService";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from "@/components/ui/dialog";
import { useAuth } from "@/app/contexts/authContext";
import { QuizSubmission } from "@/app/types/quizSubmission";

interface Props {
    submission: QuizSubmission;
    onUnlock: (adminId: string, reason?: string) => void;
    onClose: () => void;
}

export default function UnlockModal({submission, onUnlock, onClose}: Props){
    const {user} = useAuth();
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if(!user){
            alert("Vui lòng đăng nhập để mở khóa bài kiểm tra");
            return;
        }

        const adminId = user.email || user.studentId || "admin";
        onUnlock(adminId, reason);

    };

    return(
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mở khóa bài kiểm tra </DialogTitle>
                    <DialogDescription>Bạn có chắc muốn mở khóa bài kiểm tra cho sinh viên {submission.studentId}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="reason">Lý do mở khóa(tùy chọn)</Label>
                        <Input
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Nhập lý do mở khóa"
                        className="mt-2"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Hủy</Button>
                    <Button onClick={handleSubmit}>Mở khóa</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}