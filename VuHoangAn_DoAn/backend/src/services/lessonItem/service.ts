import LessonItem, { ILessonItem } from "../../models/lessonItem/model.js";

export const lessonItemService = {
  getAllByLesson: async (lessonId: string) => {
    return await LessonItem.find({ lessonId }).sort({ order: 1 });
  },

  getById: async (id: string) => {
    return await LessonItem.findById(id);
  },

  create: async (data: ILessonItem) => {
    const newItem = new LessonItem(data);
    return await newItem.save();
  },

  update: async (id: string, data: Partial<ILessonItem>) => {
    return await LessonItem.findByIdAndUpdate(id, data, { new: true });
  },

  delete: async (id: string) => {
    return await LessonItem.findByIdAndDelete(id);
  },
};
