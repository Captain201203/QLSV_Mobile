import QuizModel from "../../../models/exam/quiz/model.js";
import QuizSubmissionModel, {IQuizSubmission} from "../../../models/exam/quizSubmission/model.js";
import { randomUUID } from "crypto";

export const QuizSubMissionService = { // service cho quiz submission
    // tạo mới submission, kiểm tra quiz và sinh viên có tồn tại không, tính điểm và lưu vào database
    async submit(data: {quizId: string; studentId: string; answers: { questionId:string; selectedOption: string}[]}){
        const quiz = await QuizModel.findOne({quizId: data.quizId}); // tìm quiz theo quizId

        if(!quiz) throw new Error("Quiz not found"); // nếu quiz không tồn tại thì throw error

        let correctCount = 0; // đếm số câu đúng 
        const checkedAnswers = data.answers.map((ans)=>{ // kiểm tra câu trả lời của sinh viên và tính điểm
            const question = quiz.questions.find((q)=>q.questionId === ans.questionId); // tìm câu hỏi theo questionId
            const isCorrect = question?.correctAnswer === ans.selectedOption; // kiểm tra câu trả lời của sinh viên có đúng không
            if(isCorrect) correctCount++; // nếu đúng thì tăng điểm
            return {
                questionId: ans.questionId, // trả về questionId
                selectedOptionId: ans.selectedOption,
                isCorrect // trả về isCorrect
            };
        });

        // tính điểm, nếu không có câu hỏi thì điểm là 0
        const score = quiz.questions.length > 0 ? Math.round((correctCount/quiz.questions.length)*100) : 0;

        // tạo mới submission
        const submission = new QuizSubmissionModel({
            submissionId: randomUUID(),
            quizId: data.quizId,
            studentId: data.studentId,
            answers: checkedAnswers,
            score,
        });
        return submission.save();


    },

    async getByStudent(studentId: string){
        return QuizSubmissionModel.find({studentId});
    }
}

