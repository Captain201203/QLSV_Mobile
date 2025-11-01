import StudentModel from '../../models/student/model.js';
import ScheduleModel from '../../models/schedule/model.js';
import ClassModel from '../../models/class/model.js';
import SubjectModel from '../../models/subject/model.js';
export const StudentService = {
    async getAll() {
        return StudentModel.find();
    },
    async getById(id) {
        return StudentModel.findById(id);
    },
    async create(data) {
        const existingClass = await ClassModel.findOne({ className: data.className });
        if (!existingClass) {
            throw new Error(`Class with name ${data.className} does not exist.`);
        }
        const student = new StudentModel(data);
        const savedStudent = await student.save();
        existingClass.students.push(savedStudent._id);
        await existingClass.save();
        return savedStudent;
    },
    async update(id, data) {
        return StudentModel.findByIdAndUpdate(id, data, { new: true });
    },
    async delete(id) {
        return StudentModel.findByIdAndDelete(id);
    },
    //-------------------------------------------
    async getSubjectByStudent(studentId) {
        const student = await StudentModel.findOne({ studentId: studentId });
        if (!student) {
            throw new Error(`Student with id ${studentId} does not exist.`);
        }
        // Tìm schedule theo className của student
        const schedules = await ScheduleModel.find({ className: student.className });
        // Lấy danh sách subjectId từ schedules
        const subjectIds = schedules.map((schedule) => schedule.subjectId);
        // Tìm thông tin chi tiết của các môn học
        const subjectsData = await SubjectModel.find({ subjectId: { $in: subjectIds } });
        return subjectsData;
    }
};
export default StudentService;
//# sourceMappingURL=service.js.map