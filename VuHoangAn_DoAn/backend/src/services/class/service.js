import ClassModel from '../../models/class/model.js';
export const ClassService = {
    async getAll() {
        return ClassModel.find();
    },
    async getById(id) {
        return ClassModel.findById(id);
    },
    async create(data) {
        const newClass = new ClassModel(data);
        return newClass.save();
    },
    async update(id, data) {
        return ClassModel.findByIdAndUpdate(id, data, { new: true });
    },
    async delete(id) {
        return ClassModel.findByIdAndDelete(id);
    }
};
export default ClassService;
//# sourceMappingURL=service.js.map