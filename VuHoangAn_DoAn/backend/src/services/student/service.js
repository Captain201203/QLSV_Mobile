import StudentModel from '../../models/student/model.js';
export const StudentService = {
    async getAll() {
        return StudentModel.find();
    },
    async getById(id) {
        return StudentModel.findById(id);
    },
    async create(data) {
        const student = new StudentModel(data);
        return student.save();
    },
    async update(id, data) {
        return StudentModel.findByIdAndUpdate(id, data, { new: true });
    },
    async delete(id) {
        return StudentModel.findByIdAndDelete(id);
    }
};
export default StudentService;
//# sourceMappingURL=service.js.map