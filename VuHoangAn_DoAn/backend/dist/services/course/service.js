import Course from '../../models/course/model.js';
import ClassModel from '../../models/class/model.js';
export const CourseService = {
    async getAll() {
        return Course.find();
    }, // lấy tất cả khóa học
    async getById(id) {
        return Course.findOne({ courseId: id });
    }, // lấy khóa học theo id
    async create(data) {
        const existingCourse = await Course.findOne({ courseId: data.courseId });
        if (existingCourse)
            throw new Error(`Course with ID ${data.courseId} already exists`);
        const course = new Course({ ...data, classes: [] });
        return course.save();
    },
    async update(id, data) {
        return Course.findOneAndUpdate({ courseId: id }, data, { new: true }); // cập nhật khóa học theo id, coureseId: id là tìm theo courseId, data new: true là trả về bản cập nhật mới nhất
    },
    async delete(id) {
        return Course.findOneAndDelete({ courseId: id });
    },
    async addClass(courseId, classId) {
        console.log("[SERVICE/ADD_CLASS] input:", { courseId, classId });
        const cls = await ClassModel.findOne({ classId });
        console.log("[SERVICE/ADD_CLASS] found class:", cls?._id, cls?.classId);
        if (!cls) {
            throw new Error(`Class with ID ${classId} not found`);
        }
        const course = await Course.findOne({ courseId });
        console.log("[SERVICE/ADD_CLASS] found course:", course?._id, course?.courseId, "classes length:", course?.classes?.length);
        if (!course) {
            throw new Error(`Course with ID ${courseId} not found`);
        }
        // So sánh bằng _id thực tế, không so sánh với classId (mã lớp)
        const alreadyIn = course.classes.some(id => id.equals(cls._id));
        console.log("[SERVICE/ADD_CLASS] alreadyIn =", alreadyIn);
        if (alreadyIn) {
            throw new Error(`Class with ID ${classId} already in course`);
        }
        course.classes.push(cls._id);
        const saved = await course.save();
        console.log("[SERVICE/ADD_CLASS] saved course classes length:", saved.classes.length);
        return saved;
    },
    async removeClass(courseId, classId) {
        const course = await Course.findOne({ courseId }); // tìm khóa học theo id
        if (!course) {
            throw new Error(`Course with ID ${courseId} not found`); // nếu không tìm thấy khóa học thì báo lỗi
        }
        if (!course.classes.some(id => id.toString() === classId)) { // tìm lớp trong khóa học, some là kiểm tra có phần tử nào thỏa mãn không
            throw new Error(`Class with ID ${classId} not in course`); // nếu không có thì báo lỗi
        }
        course.classes = course.classes.filter(id => id.toString() !== classId); // lọc lớp ra khỏi khóa học, filter là lọc các phần tử không thỏa mãn
        return course.save();
    },
    async getClasses(courseId) {
        const course = await Course.findOne({ courseId });
        if (!course) {
            throw new Error(`Course with ID ${courseId} not found`);
        }
        return ClassModel.find({ classId: { $in: course.classes } });
    }
};
export default CourseService;
//# sourceMappingURL=service.js.map