import { QuizService } from "./quizService";
import { QuizSubmissionService } from "./quizSubmissionService";
import { Quiz } from "../types/quiz";
import { QuizSubmission } from "../types/quizSubmission";
import { StringToBoolean } from "class-variance-authority/types";

export interface LessonProgress {
    lessonId: string;
    totalQuestions: number;
    correctAnswers: number;
    completionPercentage: number;
    isCompleted: boolean;
}

export const LessonProgressService = {

    async caculateProgress(lessonId: string, studentId: string): Promise<LessonProgress> {
        try{
            const quizzes = await QuizService.getByLesson(lessonId);
            const totalQuestions = await quizzes.reduce((total, quiz) =>{
                return total + quiz.questions.length;
            },0);

            if ( quizzes.length === 0 || totalQuestions === 0) {
                return {
                    lessonId,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    completionPercentage: 0,
                    isCompleted: false,
                };
        }

        const allSubmissions = await QuizSubmissionService.getByStudent(studentId);

        const lessonQuizIds = quizzes.map(q=>q.quizId);
        const lessionSubmissionss = allSubmissions.filter(submission=>lessonQuizIds.includes(submission.quizId));
        
        let correctAnswers = 0;

        lessionSubmissionss.forEach(submission=>{
            const correctCount = submission.answers.filter(answer=>answer.isCorrect).length;
            correctAnswers += correctCount;
        });

        const completionPercentage = totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        const isCompleted = completionPercentage >=100;
        return {
            lessonId,
            totalQuestions,
            correctAnswers,
            completionPercentage,
            isCompleted,
        };
        }catch(error){
            console.error("Error calculating lesson progress:", error);
            return {
                lessonId,
                totalQuestions: 0,
                correctAnswers: 0,
                completionPercentage: 0,
                isCompleted: false,
            }
        }
    },

    async caculateProgressForLessons(
        lessonIds: string[],
        studentId: string,

    ): Promise<Record<string, LessonProgress>>{
        const allSubmissions: QuizSubmission[] = await QuizSubmissionService.getByStudent(studentId);

        const progressMap: Record<string, LessonProgress> = {};

        await Promise.all(
            lessonIds.map(async (lessonId)=>{
                const progress = await this.caculateProgressWithSubmissions(
                    lessonId, 
                    studentId, 
                    allSubmissions
                );
                progressMap[lessonId] = progress;
            })
        );
        return progressMap;

    },

    async caculateProgressWithSubmissions(
        lessonId: string,
        studentId: string,
        allSubmissions: QuizSubmission[]
    ): Promise<LessonProgress>{
        try{
            const quizzes: Quiz[] = await QuizService.getByLesson(lessonId);
            console.log(`[ProgressService] LessonId: ${lessonId}, Quizzes found:`, quizzes.length);
            console.log(`[ProgressService] Quizzes data:`, quizzes.map(q => ({
                quizId: q.quizId,
                title: q.title,
                questionsCount: q.questions?.length || 0,
                questions: q.questions
            })));
            
            const totalQuestions  = quizzes.reduce((total, quiz)=>{ 
                const qCount = quiz.questions?.length || 0;
                console.log(`[ProgressService] Quiz ${quiz.quizId} has ${qCount} questions`);
                return total + qCount;
            },0);

            console.log(`[ProgressService] Total questions for lesson ${lessonId}:`, totalQuestions);

            if(quizzes.length === 0 || totalQuestions === 0){
                console.log(`[ProgressService] No quizzes or questions for lesson ${lessonId}`);
                return {
                    lessonId,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    completionPercentage: 0,
                    isCompleted: false,
                };
            }
            
            const lessonQuizIds = quizzes.map(q=>q.quizId);
            console.log(`[ProgressService] Lesson quiz IDs:`, lessonQuizIds);
            const lessonSubmissions = allSubmissions.filter(sub =>
                lessonQuizIds.includes(sub.quizId)
            );
            console.log(`[ProgressService] Submissions found:`, lessonSubmissions.length);
            console.log(`[ProgressService] Submissions data:`, lessonSubmissions.map(s => ({
                submissionId: s.submissionId,
                quizId: s.quizId,
                answersCount: s.answers?.length || 0,
                answers: s.answers
            })));

            let correctAnswers = 0;
            lessonSubmissions.forEach(submission=>{
                const correctCount = submission.answers.filter(answer=>answer.isCorrect).length;
                console.log(`[ProgressService] Submission ${submission.submissionId}: ${correctCount} correct out of ${submission.answers.length}`);
                correctAnswers += correctCount;
            });
            console.log(`[ProgressService] Total correct answers: ${correctAnswers} / ${totalQuestions}`);
            
            const completionPercentage = totalQuestions > 0
            ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
            const isCompleted = completionPercentage === 100;
            
            console.log(`[ProgressService] Final result for ${lessonId}:`, {
                totalQuestions,
                correctAnswers,
                completionPercentage,
                isCompleted
            });
            return {
                lessonId,
                totalQuestions,
                correctAnswers,
                completionPercentage,
                isCompleted
            };
        }catch(error){
            console.error("Error calculating lesson progress with submissions:", error);
            return {
                lessonId,
                totalQuestions: 0,
                correctAnswers: 0,
                completionPercentage: 0,
                isCompleted: false,
            };
        }    
    },
}