import ScoreModel from "../../models/score/model.js";
import StudentModel from "../../models/student/model.js";
import SubjectModel from "../../models/subject/model.js";
export const ScoreService = {
    async create(data) {
        console.log('🔍 Service create - Data received:', data);
        // kiểm tra sinh viên và môn học có tồn tại không
        const student = await StudentModel.findOne({ studentId: data.studentId }); // tìm sinh viên theo studentId
        const subject = await SubjectModel.findOne({ subjectId: data.subjectId }); // tìm môn học theo subjectId
        if (!student) {
            throw new Error(`Student not found`);
        }
        if (!subject) {
            throw new Error(`Subject not found`);
        }
        // nếu có thì tạo điểm mới
        console.log('🔍 Creating score with data:', {
            ...data, // sao chép tất cả các trường từ data
            subjectName: subject.subjectName, // thêm trường subjectName từ subject model
            className: student.className, // thêm trường className từ student model
        });
        const newScore = await ScoreModel.create({
            ...data, // sao chép tất cả các trường từ data
            subjectName: subject.subjectName, // thêm trường subjectName từ subject model
            className: student.className, // thêm trường className từ student model
        });
        console.log('✅ Score created successfully:', newScore);
        return newScore;
    },
    async getAll(filter = {}) {
        const query = {}; // khởi tạo query rỗng
        if (filter.studentId) {
            query.studentId = filter.studentId; // nếu có studentId trong filter thì thêm vào query
        }
        if (filter.subjectId) {
            query.subjectId = filter.subjectId; // nếu có subjectId trong filter thì thêm vào query
        }
        if (filter.semester) {
            query.semester = filter.semester;
        }
        if (filter.academicYear) {
            query.academicYear = filter.academicYear;
        }
        return ScoreModel.find(query).sort({ createdAt: -1 });
    },
    async getById(id) {
        return ScoreModel.findById(id);
    },
    // ✏️ Cập nhật điểm
    async update(id, data) {
        const score = await ScoreModel.findById(id);
        if (!score)
            throw new Error("Không tìm thấy điểm để cập nhật");
        // Cập nhật các field
        Object.assign(score, data); // gán các trường từ data vào score, Object.assign dùng để sao chép giá trị từ đối tượng này sang đối tượng khác
        // Lưu để trigger pre-save hook
        const updated = await score.save(); // lưu điểm đã được cập nhật
        return updated;
    },
    // 🗑️ Xóa điểm
    async remove(id) {
        const deleted = await ScoreModel.findByIdAndDelete(id);
        if (!deleted)
            throw new Error("Không tìm thấy điểm để xóa");
    },
};
export default ScoreService;
//# sourceMappingURL=service.js.map