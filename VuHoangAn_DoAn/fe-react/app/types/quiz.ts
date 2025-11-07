export interface Quiz{
    quizId: string;
    lessonId: string;
    title: string;
    duration: number;
    questions: Question[];

    
}

export interface Question{
    questionId: string;
    text: string;
    options: Option[];
    correctAnswer: string;
}

export interface Option{
    optionId: string;
    text: string;
}

