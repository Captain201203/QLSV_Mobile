export interface QuizSubmission{
    submissionId: string;
    quizId: string;
    studentId: string;
    answers: Answer[];
    score: number;
    submittedAt: Date;
    status: 'completed' | 'locked' | 'allowed';
    attempts: number;
    unlockedBy?: string;
    unlockedAt?: Date;
    lockedAt?: Date;
}

export interface Answer{
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
}

export interface QuizStatus{
    status: 'not_started' | 'completed' | 'locked' | 'allowed' 
    canTake: boolean;
    submission?: QuizSubmission;
}
