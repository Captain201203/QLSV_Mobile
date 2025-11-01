import SubjectModel, { ISubject } from '../../models/subject/model.js';

export const SubjectService = {
    async getAll(){
        return SubjectModel.find();
    },

    async getById(id:string){
        return SubjectModel.findById(id);
    },

    async create (data:{ // tạo mới môn học với các trường dưới đây
        subjectId: string;
        subjectName: string
        credits: number;
        department: string;
        description?: string;
    }){
        const newSubject = new SubjectModel(data); // tạo instance mới của SubjectModel
        return newSubject.save(); // lưu vào database

    },

    async update ( id:String, data: Partial<ISubject>){ // Partial là kiểu dữ liệu cho phép một số trường có thể không có
        return SubjectModel.findByIdAndUpdate(id,data,{new: true});
    },

    async delete (id:string){
        return SubjectModel.findByIdAndDelete(id);
    },
}

export default SubjectService
    