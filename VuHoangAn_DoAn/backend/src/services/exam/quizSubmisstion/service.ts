import QuizModel from "../../../models/exam/quiz/model.js";
import QuizSubmissionModel, {IQuizSubmission} from "../../../models/exam/quizSubmission/model.js";
import { randomUUID } from "crypto";
import StudentModel from "../../../models/student/model.js";

export const QuizSubMissionService = { // service cho quiz submission
    // tạo mới submission, kiểm tra quiz và sinh viên có tồn tại không, tính điểm và lưu vào database
    async submit(data: {quizId: string; studentId: string; answers: { questionId:string; selectedOption: string}[]}){
        const quiz = await QuizModel.findOne({quizId: data.quizId}); // tìm quiz theo quizId

        if(!quiz) throw new Error("Quiz not found"); // nếu quiz không tồn tại thì throw error


        const existingSubmission = await QuizSubmissionModel.findOne({
            quizId: data.quizId,
            studentId: data.studentId
        })

        if(existingSubmission && (existingSubmission.status === 'locked' || existingSubmission.status === 'completed')){
            throw new Error('Bài kiểm tra đã bị khóa. Vui lòng liên hệ admin')
        }
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


        if(existingSubmission && existingSubmission.status === 'allowed'){
            existingSubmission.answers = checkedAnswers;
            existingSubmission.score = score;
            existingSubmission.submittedAt = new Date();
            existingSubmission.status = 'completed';
            existingSubmission.lockedAt = new Date();
            existingSubmission.attempts = (existingSubmission.attempts || 1) + 1;
            return existingSubmission.save()

        }
        // tạo mới submission
        const submission = new QuizSubmissionModel({
            submissionId: randomUUID(),
            quizId: data.quizId,
            studentId: data.studentId,
            answers: checkedAnswers,
            score,
            status: 'completed',
            lockedAt: new Date(),
            attempts: 1,
        });
        return submission.save();


    },

    async getByStudent(studentId: string){
        return QuizSubmissionModel.find({studentId});
    },

    async getByQuiz(quizId: string) {
        const submissions = await QuizSubmissionModel.find({ quizId });
      
        // Nếu muốn lấy thêm thông tin sinh viên:
        // import StudentModel ở đầu file
        const studentIds = submissions.map((s) => s.studentId);
        const students = await StudentModel.find({ studentId: { $in: studentIds } });
      
        // Ghép dữ liệu lại
        return submissions.map((s) => ({
          ...s.toObject(),
          student: students.find((st) => st.studentId === s.studentId),
        }));
      },

    async getByQuizAndStudent( quizId: string, studentId: string){
        const submission = await QuizSubmissionModel.findOne({quizId, studentId});
        
    },

    async unlockSubmission (submissionId: string, adminId: string, reason?: string){
        const submission = await QuizSubmissionModel.findOne({submissionId});
        if(!submission) throw new Error("Submission not found")
        
            submission.status = 'allowed';
            submission.unlockedBy = adminId;
            submission.unlockedAt = new Date();
            return submission.save(); 

    },

    async lockSubmission(submissionId: string){
        const submission = await QuizSubmissionModel.findOne({submissionId});
        if(!submission) throw new Error ("Submission not found");

        submission.status = 'locked';
        submission.lockedAt = new Date();
        return submission.save()
    },

    async getQuizStatus(quizId: string, studentId: string){
        const submission = await QuizSubmissionModel.findOne({quizId, studentId});
        if(!submission){
            return { status: 'not_started', canTake: true, submission: null}
        }

        // canTake = true nếu status là 'allowed' hoặc 'not_started'
        // canTake = false nếu status là 'locked' hoặc 'completed' (chưa được mở khóa)
        const canTake = submission.status === 'allowed' || submission.status === 'not_started';

        return {
            status: submission.status,
            canTake: canTake,
            submission: submission
        }
    }

}

