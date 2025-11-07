// Đường dẫn: backend/src/services/lesson/service.ts
import LessonModel, { ILesson } from '../../models/lesson/model.js';
import CourseModel from '../../models/course/model.js';
import mongoose from 'mongoose';

const safeDecode = (value: string): string => {
    try { return decodeURIComponent(value) } catch { return value }
}

const resolveCourseByAnyId = async (id: string) => {
    const candidates = Array.from(new Set([id, safeDecode(id)]));
    for (const candidate of candidates) {
        if (mongoose.Types.ObjectId.isValid(candidate)) {
            const byObjectId = await CourseModel.findById(candidate);
            if (byObjectId) return byObjectId;
        }
        const byCourseId = await CourseModel.findOne({ courseId: candidate });
        if (byCourseId) return byCourseId;
    }
    return null;
}

export const LessonService = {
    async getAll() {
        return LessonModel.find();
    },

    async getById(id: string) {
        return LessonModel.findOne({ lessonId: id });
    },

    async getByCourse(courseId: string) {
        // Kiểm tra khóa học có tồn tại không (hỗ trợ _id và courseId, kèm URL-encoded)
        const course = await resolveCourseByAnyId(courseId);
        if (!course) {
            throw new Error(`Course with ID ${courseId} does not exist.`);
        }

        const key = (course as any).courseId ?? courseId;
        return LessonModel.find({ courseId: key }).sort({ order: 1 });
    },

    async create(data: {
        lessonId: string;
        courseId: string;
        title: string;
        description: string;
        order: number;
    }) {
        // Kiểm tra khóa học có tồn tại không (hỗ trợ _id và courseId, kèm URL-encoded)
        const course = await resolveCourseByAnyId(data.courseId);
if (!course) {
  throw new Error(`Course with ID ${data.courseId} does not exist.`);
}

// ✅ Dùng course.courseId làm khóa chính để so sánh và lưu
const normalizedCourseId = (course as any).courseId;

// Kiểm tra trùng trong cùng khóa học
const existingLesson = await LessonModel.findOne({
  lessonId: data.lessonId,
  courseId: normalizedCourseId,
});

if (existingLesson) {
  throw new Error(
    `Lesson with ID "${data.lessonId}" already exists in course "${normalizedCourseId}".`
  );
}

// ✅ Khi tạo, luôn gán courseId = course.courseId (chuẩn hóa)
const lesson = new LessonModel({
  ...data,
  courseId: normalizedCourseId,
});

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