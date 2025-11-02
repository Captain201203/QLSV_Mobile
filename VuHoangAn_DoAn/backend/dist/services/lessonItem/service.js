import LessonItem from "../../models/lessonItem/model.js";
export const lessonItemService = {
    getAllByLesson: async (lessonId) => {
        return await LessonItem.find({ lessonId }).sort({ order: 1 });
    },
    getById: async (id) => {
        return await LessonItem.findById(id);
    },
    create: async (data) => {
        const newItem = new LessonItem(data);
        return await newItem.save();
    },
    update: async (id, data) => {
        return await LessonItem.findByIdAndUpdate(id, data, { new: true });
    },
    delete: async (id) => {
        return await LessonItem.findByIdAndDelete(id);
    },
};
//# sourceMappingURL=service.js.map