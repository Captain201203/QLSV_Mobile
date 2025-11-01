import SubjectModel from '../../models/subject/model.js';
export const SubjectService = {
    async getAll() {
        return SubjectModel.find();
    },
    async getById(id) {
        return SubjectModel.findById(id);
    },
    async create(data) {
        const newSubject = new SubjectModel(data); // tạo instance mới của SubjectModel
        return newSubject.save(); // lưu vào database
    },
    async update(id, data) {
        return SubjectModel.findByIdAndUpdate(id, data, { new: true });
    },
    async delete(id) {
        return SubjectModel.findByIdAndDelete(id);
    },
};
export default SubjectService;
//# sourceMappingURL=service.js.map