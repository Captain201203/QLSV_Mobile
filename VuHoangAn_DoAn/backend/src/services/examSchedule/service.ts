import ExamSchedule from '../../models/ExamSchedule/model.js';
import SubjectModel from '../../models/subject/model.js';

export const ExamScheduleService = {
    async create(data:any){
        const subject = await SubjectModel.findOne({subjectId: data.subjectId});
        if(!subject) throw new Error('Môn học không tồn tại');

        const existingExam = await ExamSchedule.findOne({
            className : data.className,
            examDate: data.examDate,
            $or:[
                {
                    startTime: {$lt: data.endTime, $gte: data.startTime},
                    endTime: {$gt: data.startTime, $lte: data.endTime}
                },
                {
                    startTime: {$lte: data.startTime},
                    endTime: {$gte: data.endTime}
                }
            ]
        });

        if(existingExam){
            throw new Error('Lịch thi bị trùng với một lịch thi đã tồn tại');
        }

        const examData = {
            ...data,
            subjectName: subject.subjectName
        };

        const examSchedule = new ExamSchedule(examData);
        return examSchedule.save();
    },

    async getByClass(className: string, semester?: string){
        const filter: any = {className};
        if(semester){
            filter.semester = semester;
        }

        return await ExamSchedule.find(filter).sort({startTime: 1});
    },

    async getByClassInRange(className: string, from: Date, to: Date){
        return ExamSchedule.find({
            className,
            examDate: {$gte: from, $lte: to}
        }).sort({examDate: 1});
    },

    async update(id: string, data: any){
        if(data.subjectId){
            const subject = await SubjectModel.findOne({subjectId: data.subjectId});
            if(!subject){
                throw new Error('Môn học không tồn tại');
            }
            data.subjectName = subject.subjectName;
        }

        return await ExamSchedule.findByIdAndUpdate(id, data, {new: true});
    },

    async delete(id: string){
        return await ExamSchedule.findByIdAndDelete(id);
    },

    async getSemestersByClass(className: string){
        const exams = await ExamSchedule.find({className}).select('semester').lean();
        const semesters = [...new Set(exams.map(exam => exam.semester))];
        return semesters.sort();
    }
};