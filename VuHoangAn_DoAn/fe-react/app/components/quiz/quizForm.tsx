"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface QuizFormProps {
  onSubmitAction: (data: any) => void;
}

export default function QuizForm({ onSubmitAction }: QuizFormProps) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(10);

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("Vui lòng nhập tiêu đề bài kiểm tra");
      return;
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      alert("Vui lòng nhập thời lượng > 0 phút");
      return;
    }
    onSubmitAction({ title: trimmedTitle, duration });
  };

  return (
    <Card className="p-4 space-y-4">
      <CardHeader>
        <CardTitle>Thông tin bài kiểm tra</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label>Tiêu đề bài kiểm tra</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label>Thời gian (phút)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Lưu bài kiểm tra</Button>
        </div>
      </CardContent>
    </Card>
  );
}
