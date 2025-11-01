import ClassModel, { IClass } from '../../models/class/model.js';
import StudentModel, {IStudent} from '../../models/student/model.js';

export const ClassService = {
    async getAll(){
        return ClassModel.find();

    },

    async getById(id:string){
        return ClassModel.findById(id);
    },

    async create (data:{ // tạo lớp mới với các trường dưới đây
        classId:string;
        className:string;
        department: string;
    }){
        const newClass = new ClassModel(data); // tạo instance mới của ClassModel
        return newClass.save(); // lưu vào database
    },

    async update (id:string, data: Partial<IClass>){
        return ClassModel.findByIdAndUpdate(id,data,{new: true});
    },

    async delete(id:string){
        return ClassModel.findByIdAndDelete(id);
    },

    async getStudentInClass(classId: string){ // Lấy sinh viên theo classId
        console.log("Tìm lớp với ID:", classId);
        
        // Tìm lớp theo _id hoặc classId
        const classData = await ClassModel.findOne({ // tạo classData bằng cách tìm trong ClassModel với điều kiện
            $or: [ // or dùng để tìm với một trong hai điều kiện
                { _id: classId }, // tìm theo _id
                { classId: classId } // tìm theo classId
            ]
        });
        
        if (!classData){
            throw new Error("Không tìm thấy lớp với ID: " + classId);
        }

        console.log("✅ Tìm thấy lớp:", classData.className); // nếu tìm thấy lớp thì in ra tên lớp
        
        
        const students = await StudentModel.find({ className: classData.className }); // tìm sinh viên theo className từ classData
        console.log("✅ Tìm thấy", students.length, "sinh viên trong lớp", classData.className);
        
        return students;
    },

    async getStudentInClassByName(className: string){ // Lấy sinh viên theo tên lớp
        console.log("🔍 Tìm sinh viên của lớp:", className);
        
        // Kiểm tra lớp có tồn tại không
        const classData = await ClassModel.findOne({ className: className }); // tìm lớp theo className. className : className là key và value giống nhau
        if (!classData){
            throw new Error("Không tìm thấy lớp: " + className);
        }

        console.log("✅ Tìm thấy lớp:", classData.className);
        
        // Tìm sinh viên theo className
        const students = await StudentModel.find({ className: className }); // tìm sinh viên theo className
        console.log("✅ Tìm thấy", students.length, "sinh viên trong lớp", className); // in ra số sinh viên tìm thấy
        
        return students; // trả về danh sách sinh viên
    }
}
export default ClassService