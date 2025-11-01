import ScheduleModel, { ISchedule } from "../../models/schedule/model.js";
import SubjectModel from "../../models/subject/model.js";

export const ScheduleService = {
    async getByClassInRange(className: string, startAt: Date, endAt: Date){ // Lấy lịch theo tên lớp trong khoảng thời gian
        return ScheduleModel.find({ // tìm trong ScheduleModel với điều kiện
            className: className, // theo tên lớp
            startAt: {$gte: startAt}, // thời gian bắt đầu lớn hơn hoặc bằng startAt
            endAt: {$lte: endAt}, // thời gian kết thúc nhỏ hơn hoặc bằng endAt

        }).sort({startAt: 1}); // sắp xếp theo thời gian bắt đầu tăng dần
    },

    async create(data:{ // tạo mới lịch với các trường dưới đây
        className: string;
        subjectId: string;
        subjectName?: string; // Cho phép optional
        lecturer?:string;
        room?: string;
        startAt: Date;
        endAt: Date;
        note?: string
    }){
        const subject = await SubjectModel.findOne({subjectId: data.subjectId}); // Tìm subject theo subjectId
        if(!subject) throw new Error(`Subject with id ${data.subjectId} does not exist.`);

        // Tự động lấy subjectName từ Subject model nếu không có
        const subjectName = data.subjectName || subject.subjectName;

        const overlap = await ScheduleModel.findOne({ // Kiểm tra lịch bị trùng lặp
            className: data.className, // theo tên lớp
            $or:[
                {startAt: {$lte: data.endAt}, endAt: {$gte: data.startAt}}, // Kiểm tra khoảng thời gian có bị chồng lấp không
            ]
        });
        //nếu có lịch trùng thì báo lỗi
        if(overlap) throw new Error(`Schedule overlaps with existing schedule.`);
        // nếu không trả về lịch mới tạo với subjectName lấy từ Subject model
        return ScheduleModel.create({
            ...data,
            subjectName: subjectName
        });
    },

    async update(id: string, data: Partial<ISchedule>){
        return ScheduleModel.findByIdAndUpdate(id, data, {new: true}); // trả về lịch đã được cập nhật
    },

    async delete(id: string){
        return ScheduleModel.findByIdAndDelete(id); // xóa lịch theo id
    }
}