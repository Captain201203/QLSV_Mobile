import ScheduleModel from "../../models/schedule/model.js";
import SubjectModel from "../../models/subject/model.js";
export const ScheduleService = {
    async getByClassInRange(className, startAt, endAt) {
        return ScheduleModel.find({
            className: className, // theo tên lớp
            startAt: { $gte: startAt }, // thời gian bắt đầu lớn hơn hoặc bằng startAt
            endAt: { $lte: endAt }, // thời gian kết thúc nhỏ hơn hoặc bằng endAt
        }).sort({ startAt: 1 }); // sắp xếp theo thời gian bắt đầu tăng dần
    },
    async create(data) {
        const subject = await SubjectModel.findOne({ subjectId: data.subjectId }); // Tìm subject theo subjectId
        if (!subject)
            throw new Error(`Subject with id ${data.subjectId} does not exist.`);
        // Tự động lấy subjectName từ Subject model nếu không có
        const subjectName = data.subjectName || subject.subjectName;
        const overlap = await ScheduleModel.findOne({
            className: data.className, // theo tên lớp
            $or: [
                { startAt: { $lte: data.endAt }, endAt: { $gte: data.startAt } }, // Kiểm tra khoảng thời gian có bị chồng lấp không
            ]
        });
        //nếu có lịch trùng thì báo lỗi
        if (overlap)
            throw new Error(`Schedule overlaps with existing schedule.`);
        // nếu không trả về lịch mới tạo với subjectName lấy từ Subject model
        return ScheduleModel.create({
            ...data,
            subjectName: subjectName
        });
    },
    async update(id, data) {
        return ScheduleModel.findByIdAndUpdate(id, data, { new: true }); // trả về lịch đã được cập nhật
    },
    async delete(id) {
        return ScheduleModel.findByIdAndDelete(id); // xóa lịch theo id
    }
};
//# sourceMappingURL=service.js.map