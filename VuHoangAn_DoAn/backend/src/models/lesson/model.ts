import mongoose, { Document, Schema } from 'mongoose'

export interface ILesson extends Document{
    lessonId:string;
    courseId: String;
    title: string;
    description: string;
    order: number;
}

const LessonSchema: Schema = new Schema({
    lessonId: {type: String, required: true},
    courseId: {type: String, required: true, ref: 'Course'},
    title: {type: String, required: true},
    description: {type: String, required: true},
    order: {type: Number, required: true},
})

// Compound unique index: cho phép cùng lessonId ở các khóa học khác nhau
LessonSchema.index({ lessonId: 1, courseId: 1 }, { unique: true })

const LessonModel = mongoose.model<ILesson>('Lesson', LessonSchema)

// Hàm sửa index: xóa index cũ và tạo lại compound index
export const fixLessonIndexes = async () => {
  try {
    const indexes = await LessonModel.collection.getIndexes()
    
    // Xóa index cũ lessonId_1 nếu tồn tại (unique trên lessonId đơn lẻ)
    if (indexes.lessonId_1) {
      try {
        await LessonModel.collection.dropIndex('lessonId_1')
        console.log('✅ Đã xóa index cũ lessonId_1')
      } catch (err: any) {
        if (!err.message?.includes('index not found')) {
          console.warn('⚠️ Không thể xóa index lessonId_1:', err.message)
        }
      }
    }
    
    // Đảm bảo compound index được tạo
    try {
      await LessonModel.collection.createIndex({ lessonId: 1, courseId: 1 }, { unique: true })
      console.log('✅ Đã tạo compound index (lessonId, courseId)')
    } catch (err: any) {
      if (err.code === 85) {
        // Index đã tồn tại với cấu trúc khác, cần drop và tạo lại
        await LessonModel.collection.dropIndex('lessonId_1_courseId_1').catch(() => {})
        await LessonModel.collection.createIndex({ lessonId: 1, courseId: 1 }, { unique: true })
        console.log('✅ Đã tạo lại compound index (lessonId, courseId)')
      } else if (!err.message?.includes('already exists')) {
        console.warn('⚠️ Không thể tạo compound index:', err.message)
      }
    }
  } catch (err: any) {
    console.warn('⚠️ Không thể sửa index cho Lesson:', err.message)
  }
}

export default LessonModel