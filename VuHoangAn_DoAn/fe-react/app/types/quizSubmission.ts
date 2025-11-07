export interface QuizSubmission{
    submissionId: string;
    quizId: string;
    studentId: string;
    answer: Answer[];
    score: number;
    submiitedAt: Date;
}

export interface Answer{
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
}
