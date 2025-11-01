import ClassModel from '../../models/class/model.js';
import StudentModel from '../../models/student/model.js';
export const ClassService = {
    async getAll() {
        return ClassModel.find();
    },
    async getById(id) {
        return ClassModel.findById(id);
    },
    async create(data) {
        const newClass = new ClassModel(data); // tạo instance mới của ClassModel
        return newClass.save(); // lưu vào database
    },
    async update(id, data) {
        return ClassModel.findByIdAndUpdate(id, data, { new: true });
    },
    async delete(id) {
        return ClassModel.findByIdAndDelete(id);
    },
    async getStudentInClass(classId) {
        console.log("Tìm lớp với ID:", classId);
        // Tìm lớp theo _id hoặc classId
        const classData = await ClassModel.findOne({
            $or: [
                { _id: classId }, // tìm theo _id
                { classId: classId } // tìm theo classId
            ]
        });
        if (!classData) {
            throw new Error("Không tìm thấy lớp với ID: " + classId);
        }
        console.log("✅ Tìm thấy lớp:", classData.className); // nếu tìm thấy lớp thì in ra tên lớp
        const students = await StudentModel.find({ className: classData.className }); // tìm sinh viên theo className từ classData
        console.log("✅ Tìm thấy", students.length, "sinh viên trong lớp", classData.className);
        return students;
    },
    async getStudentInClassByName(className) {
        console.log("🔍 Tìm sinh viên của lớp:", className);
        // Kiểm tra lớp có tồn tại không
        const classData = await ClassModel.findOne({ className: className }); // tìm lớp theo className. className : className là key và value giống nhau
        if (!classData) {
            throw new Error("Không tìm thấy lớp: " + className);
        }
        console.log("✅ Tìm thấy lớp:", classData.className);
        // Tìm sinh viên theo className
        const students = await StudentModel.find({ className: className }); // tìm sinh viên theo className
        console.log("✅ Tìm thấy", students.length, "sinh viên trong lớp", className); // in ra số sinh viên tìm thấy
        return students; // trả về danh sách sinh viên
    }
};
export default ClassService;
//# sourceMappingURL=service.js.map