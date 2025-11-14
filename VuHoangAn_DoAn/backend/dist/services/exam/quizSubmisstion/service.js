import QuizModel from "../../../models/exam/quiz/model.js";
import QuizSubmissionModel from "../../../models/exam/quizSubmission/model.js";
import { randomUUID } from "crypto";
import StudentModel from "../../../models/student/model.js";
export const QuizSubMissionService = {
    // tạo mới submission, kiểm tra quiz và sinh viên có tồn tại không, tính điểm và lưu vào database
    async submit(data) {
        const quiz = await QuizModel.findOne({ quizId: data.quizId }); // tìm quiz theo quizId
        if (!quiz)
            throw new Error("Quiz not found"); // nếu quiz không tồn tại thì throw error
        const existingSubmission = await QuizSubmissionModel.findOne({
            quizId: data.quizId,
            studentId: data.studentId
        });
        if (existingSubmission && (existingSubmission.status === 'locked' || existingSubmission.status === 'completed')) { // nếu submission đã bị khóa hoặc đã hoàn thành thì không cho phép nộp bài
            throw new Error('Bài kiểm tra đã bị khóa. Vui lòng liên hệ admin');
        }
        let correctCount = 0; // đếm số câu đúng 
        const checkedAnswers = data.answers.map((ans) => {
            const question = quiz.questions.find((q) => q.questionId === ans.questionId); // tìm câu hỏi theo questionId
            const isCorrect = question?.correctAnswer === ans.selectedOption; // kiểm tra câu trả lời của sinh viên có đúng không
            if (isCorrect)
                correctCount++; // nếu đúng thì tăng điểm
            return {
                questionId: ans.questionId, // trả về questionId
                selectedOptionId: ans.selectedOption,
                isCorrect // trả về isCorrect
            };
        });
        // tính điểm, nếu không có câu hỏi thì điểm là 0
        const score = quiz.questions.length > 0 ? Math.round((correctCount / quiz.questions.length) * 100) : 0; // tính điểm theo tỉ lệ phần trăm và làm tròn
        if (existingSubmission && existingSubmission.status === 'allowed') { // nếu submission đã tồn tại và trạng thái là allowed thì cập nhật lại submission
            existingSubmission.answers = checkedAnswers;
            existingSubmission.score = score;
            existingSubmission.submittedAt = new Date();
            existingSubmission.status = 'completed';
            existingSubmission.lockedAt = new Date();
            existingSubmission.attempts = (existingSubmission.attempts || 1) + 1; // tăng số lần làm bài lên 1
            return existingSubmission.save();
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
    async getByStudent(studentId) {
        return QuizSubmissionModel.find({ studentId });
    },
    async getByQuiz(quizId) {
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
    async getByQuizAndStudent(quizId, studentId) {
        const submission = await QuizSubmissionModel.findOne({ quizId, studentId });
    },
    async unlockSubmission(submissionId, adminId, reason) {
        const submission = await QuizSubmissionModel.findOne({ submissionId });
        if (!submission)
            throw new Error("Submission not found");
        submission.status = 'allowed'; // thay đổi trạng thái thành allowed
        submission.unlockedBy = adminId; // lưu adminId người mở khóa
        submission.unlockedAt = new Date(); // lưu thời gian mở khóa
        return submission.save();
    },
    async lockSubmission(submissionId) {
        const submission = await QuizSubmissionModel.findOne({ submissionId });
        if (!submission)
            throw new Error("Submission not found");
        submission.status = 'locked';
        submission.lockedAt = new Date();
        return submission.save();
    },
    async getQuizStatus(quizId, studentId) {
        const submission = await QuizSubmissionModel.findOne({ quizId, studentId });
        if (!submission) {
            return { status: 'not_started', canTake: true, submission: null };
        }
        // canTake = true nếu status là 'allowed' hoặc 'not_started'
        // canTake = false nếu status là 'locked' hoặc 'completed' (chưa được mở khóa)
        const canTake = submission.status === 'allowed' || submission.status === 'not_started';
        return {
            status: submission.status,
            canTake: canTake,
            submission: submission
        };
    },
    async getScoresByLesson(lessonId, studentId) {
        // --- BẮT ĐẦU SAO CHÉP LOGIC TỪ QuizService ---
        console.log(`[QuizSubMissionService] Raw lessonId received: "${lessonId}"`);
        let decodedLessonId = lessonId;
        try {
            decodedLessonId = decodeURIComponent(lessonId);
            console.log(`[QuizSubMissionService] Decoded lessonId: "${decodedLessonId}"`);
        }
        catch (e) {
            console.log(`[QuizSubMissionService] lessonId is not URL encoded, using original: "${lessonId}"`);
            decodedLessonId = lessonId;
        }
        let encodedLessonId = lessonId;
        try {
            // Encode lại ID đã decode để đảm bảo chuẩn
            encodedLessonId = encodeURIComponent(decodedLessonId);
            console.log(`[QuizSubMissionService] Encoded lessonId: "${encodedLessonId}"`);
        }
        catch (e) {
            encodedLessonId = lessonId;
        }
        // Tạo truy vấn $or để tìm tất cả các khả năng
        const query = {
            $or: [
                { lessonId: decodedLessonId }, // "BÀI 1"
                { lessonId: lessonId }, // "BÀI 1" (nếu nó không bị encode)
                { lessonId: encodedLessonId } // "B%C3%80I%201"
            ]
        };
        console.log(`[QuizSubMissionService] Query:`, JSON.stringify(query));
        // 1. Lấy danh sách quiz thuộc lesson BẰNG TRUY VẤN MỚI
        const quizzes = await QuizModel.find(query);
        console.log(`[QuizSubMissionService] Found ${quizzes.length} quizzes`);
        // --- KẾT THÚC SAO CHÉP LOGIC ---
        // (Phần logic bên dưới giữ nguyên)
        // nếu không có quiz → return []
        if (!quizzes.length) {
            console.log("[QuizSubMissionService] No quizzes found, returning [].");
            return [];
        }
        const quizIds = quizzes.map(q => q.quizId);
        console.log(`[QuizSubMissionService] Found quiz IDs:`, quizIds);
        const submissions = await QuizSubmissionModel.find({
            quizId: { $in: quizIds },
            studentId,
        });
        console.log(`[QuizSubMissionService] Found ${submissions.length} submissions.`);
        if (!submissions.length) {
            return [];
        }
        // Trả về mảng điểm số
        const scores = submissions.map(sub => sub.score);
        console.log(`[QuizSubMissionService] Returning scores:`, scores);
        return scores;
    }
};
//# sourceMappingURL=service.js.map