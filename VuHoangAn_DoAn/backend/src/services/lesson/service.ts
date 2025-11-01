// Đường dẫn: backend/src/services/lesson/service.ts
import LessonModel, { ILesson } from '../../models/lesson/model.js';
import CourseModel from '../../models/course/model.js';

export const LessonService = {
    async getAll() {
        return LessonModel.find();
    },

    async getById(id: string) {
        return LessonModel.findOne({ lessonId: id });
    },

    async getByCourse(courseId: string) {
        // Kiểm tra khóa học có tồn tại không
        const course = await CourseModel.findOne({ courseId });
        if (!course) {
            throw new Error(`Course with ID ${courseId} does not exist.`);
        }

        return LessonModel.find({ courseId }).sort({ order: 1 });
    },

    async create(data: {
        lessonId: string;
        courseId: string;
        title: string;
        description: string;
        order: number;
    }) {
        // Kiểm tra khóa học có tồn tại không
        const course = await CourseModel.findOne({ courseId: data.courseId });
        if (!course) {
            throw new Error(`Course with ID ${data.courseId} does not exist.`);
        }

        // Kiểm tra bài học đã tồn tại chưa
        const existingLesson = await LessonModel.findOne({ lessonId: data.lessonId });
        if (existingLesson) {
            throw new Error(`Lesson with ID ${data.lessonId} already exists.`);
        }

        const lesson = new LessonModel(data);
        return lesson.save();
    },

    async update(id: string, data: Partial<ILesson>) {
        return LessonModel.findOneAndUpdate(
            { lessonId: id },
            data,
            { new: true }
        );
    },

    async delete(id: string) {
        return LessonModel.findOneAndDelete({ lessonId: id });
    }
};

export default LessonService;