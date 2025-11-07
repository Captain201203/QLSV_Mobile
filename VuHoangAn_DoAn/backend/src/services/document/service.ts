// Đường dẫn: backend/src/services/document/service.ts
import DocumentModel, { IDocument } from '../../models/document/model.js'
import LessonModel from '../../models/lesson/model.js'
import mongoose from 'mongoose'

const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const resolveLessonByAnyId = async (id: string) => {
  // Chấp nhận cả lessonId tùy chỉnh và Mongo _id
  const candidates = Array.from(new Set([id, safeDecode(id)]))

  for (const candidate of candidates) {
    if (mongoose.Types.ObjectId.isValid(candidate)) {
      const byObjectId = await LessonModel.findById(candidate)
      if (byObjectId) return byObjectId
    }
    const byLessonId = await LessonModel.findOne({ lessonId: candidate })
    if (byLessonId) return byLessonId
  }
  return null
}

export const DocumentService = {
  async getByLesson(lessonId: string) {
    const lesson = await resolveLessonByAnyId(lessonId)
    if (!lesson) {
      throw new Error(`Lesson with ID ${lessonId} does not exist.`)
    }
    // Lưu trữ document theo trường lessonId (kiểu string)
    // Nếu frontend gửi _id, chúng ta vẫn truy vấn theo lessonId gốc của bài học
    const lessonKey = lesson.lessonId ?? lessonId
    return DocumentModel.find({ lessonId: lessonKey }).sort({ updatedAt: -1 })
  },

  async getById(documentId: string) {
    return DocumentModel.findOne({ documentId })
  },

  async create(data: { documentId: string; lessonId: string; title: string; content: string }) {
    const lesson = await resolveLessonByAnyId(data.lessonId)
    if (!lesson) {
      throw new Error(`Lesson with ID ${data.lessonId} does not exist.`)
    }

    const existing = await DocumentModel.findOne({ documentId: data.documentId })
    if (existing) {
      throw new Error(`Document with ID ${data.documentId} already exists.`)
    }

    const doc = new DocumentModel({
      ...data,
      // Chuẩn hóa lessonId lưu theo khóa lessonId chuỗi của bài học
      lessonId: lesson.lessonId ?? data.lessonId,
    })
    return doc.save()
  },

  async update(documentId: string, data: Partial<IDocument>) {
    return DocumentModel.findOneAndUpdate({ documentId }, data, { new: true })
  },

  async delete(documentId: string) {
    return DocumentModel.findOneAndDelete({ documentId })
  },
}

export default DocumentService


