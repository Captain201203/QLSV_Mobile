import StudentModel, {IStudent} from '../../models/student/model.js';
import ScheduleModel from '../../models/schedule/model.js';
import ClassModel, {IClass} from '../../models/class/model.js';
import SubjectModel from '../../models/subject/model.js';

// lấy tất cả sinh viên
export const StudentService = {
    async getAll(){
        return StudentModel.find();

    },
// lấy sinh viên theo id
    async getById(id: string){
        return StudentModel.findById(id);
    },
// tạo sinh viên mới
    async create(data: {
        studentId: string;
        studentName: string;
        className: string;
        dateOfBirth: Date;
        phoneNumber: string;
        email: string;
    }) {
        const existingClass = await ClassModel.findOne({ className: data.className }); // kiểm tra lớp có tồn tại chưachưa
        if(!existingClass){
            throw new Error(`Class with name ${data.className} does not exist.`);
        } // nếu lớp không tồn tại thì thông báo lỗi
        const student = new StudentModel(data); // nếu lớp tồn tại thì tạo sinh viên mới
        const savedStudent = await student.save(); // lưu sinh viên vào database
        existingClass.students.push(savedStudent._id as any); // thêm sinh viên vào lớp
        await existingClass.save(); // thêm sinh viên vào lớp
        return savedStudent; // trả về sinh viên đã tạo
    },

    // cập nhật sinh viên
    async update ( id: string, data: Partial<IStudent>){
        return StudentModel.findByIdAndUpdate(id,data,{new: true});

    },

    // xóa sinh viên
    async delete(id:string){
        return StudentModel.findByIdAndDelete(id);
    },

    //-------------------------------------------
    // lấy danh sách môn học của sinh viên
    async getSubjectByStudent(studentId: string){
        const student = await StudentModel.findOne({studentId: studentId});
        if(!student){
            throw new Error(`Student with id ${studentId} does not exist.`);
        }

        // Tìm schedule theo className của student
        const schedules = await ScheduleModel.find({className: student.className});
        
        // Lấy danh sách subjectId từ schedules
        const subjectIds = schedules.map((schedule) => schedule.subjectId);
        
        // Tìm thông tin chi tiết của các môn học
        const subjectsData = await SubjectModel.find({subjectId: {$in: subjectIds}});
        return subjectsData;
    }
}

export default StudentService