"use client";

import React, { useState, useEffect } from 'react';
import { Quiz, Question } from '@/app/types/quiz';
import { v4 as uuidv4 } from 'uuid';
import QuestionListItem from './questionListItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft } from 'lucide-react';

interface Props {
  quiz: Quiz | null;
  lessonId: string;
  onSubmit: (quiz: Quiz) => void;
  onCancel: () => void;
}

const QuizManager: React.FC<Props> = ({ quiz, lessonId, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title);
      setDuration(quiz.duration);
      setQuestions(quiz.questions || []);
    } else {
      setTitle('Bài kiểm tra mới');
      setDuration(15);
      setQuestions([]);
    }
  }, [quiz]);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      questionId: uuidv4(),
      text: 'Câu hỏi mới?',
      options: [
        { optionId: uuidv4(), text: 'Lựa chọn 1' },
        { optionId: uuidv4(), text: 'Lựa chọn 2' },
      ],
      correctAnswer: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => 
      q.questionId === updatedQuestion.questionId ? updatedQuestion : q
    ));
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      setQuestions(questions.filter(q => q.questionId !== questionId));
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bài kiểm tra');
      return;
    }
    if (duration <= 0) {
      alert('Vui lòng nhập thời lượng > 0');
      return;
    }
    if (questions.length === 0) {
      alert('Vui lòng thêm ít nhất 1 câu hỏi');
      return;
    }
    
    // Kiểm tra mỗi câu hỏi có đáp án đúng chưa
    const invalidQuestions = questions.filter(q => 
      !q.text.trim() || 
      q.options.length < 2 || 
      !q.correctAnswer
    );
    
    if (invalidQuestions.length > 0) {
      alert('Vui lòng hoàn thiện tất cả câu hỏi (có nội dung, ít nhất 2 lựa chọn, và chọn đáp án đúng)');
      return;
    }

    const quizData: Quiz = {
      quizId: quiz?.quizId || '',
      lessonId: lessonId,
      title: title.trim(),
      duration,
      questions,
    };
    onSubmit(quizData);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={onCancel} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
        <h1 className="text-3xl font-bold">
          {quiz ? 'Chỉnh sửa bài kiểm tra' : 'Tạo bài kiểm tra mới'}
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thông tin bài kiểm tra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiz-title">Tiêu đề</Label>
              <Input 
                id="quiz-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài kiểm tra"
              />
            </div>
            <div>
              <Label htmlFor="quiz-duration">Thời lượng (phút)</Label>
              <Input 
                id="quiz-duration" 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Câu hỏi ({questions.length})</CardTitle>
          <Button onClick={handleAddQuestion}>
            <Plus className="mr-2 h-4 w-4" /> Thêm câu hỏi
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.
              </div>
            ) : (
              questions.map((question, index) => (
                <QuestionListItem
                  key={question.questionId}
                  question={question}
                  index={index}
                  onUpdate={handleUpdateQuestion}
                  onDelete={handleDeleteQuestion}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel} variant="outline">
          Hủy
        </Button>
        <Button onClick={handleSubmit}>
          Lưu bài kiểm tra
        </Button>
      </div>
    </div>
  );
};

export default QuizManager;