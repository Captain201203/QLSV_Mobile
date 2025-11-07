// Đường dẫn: backend/src/controller/document/controller.ts
import { Request, Response } from 'express'
import { DocumentService } from '../../services/document/service.js'

export const DocumentController = {
  async getByLesson(req: Request, res: Response) {
    try {
      const rawLessonId = String(req.params.lessonId)
      const lessonId = (() => {
        try { return decodeURIComponent(rawLessonId) } catch { return rawLessonId }
      })()
      if (!lessonId) return res.status(400).json({ message: 'lessonId is required' })
      const docs = await DocumentService.getByLesson(lessonId)
      res.json(docs)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const doc = await DocumentService.getById(id)
      if (!doc) return res.status(404).json({ message: 'Document not found' })
      res.json(doc)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { title, content, documentId } = req.body
      const rawLessonId = String(req.body.lessonId ?? '')
      const lessonId = (() => {
        try { return decodeURIComponent(rawLessonId) } catch { return rawLessonId }
      })()
      // Cho phép content rỗng, chỉ yêu cầu lessonId và title
      if (!lessonId || !title || String(title).trim().length === 0) {
        return res.status(400).json({ message: 'lessonId và title là bắt buộc' })
      }

      // Nếu không truyền documentId, tạo ngẫu nhiên
      const ensuredDocumentId =
        documentId && String(documentId).trim().length > 0
          ? String(documentId)
          : `DOC_${Date.now()}`

      const doc = await DocumentService.create({
        documentId: ensuredDocumentId,
        lessonId,
        title,
        content: content ?? '',
      })
      res.status(201).json(doc)
    } catch (error: any) {
      const msg = String(error?.message ?? 'Internal error')
      if (msg.includes('does not exist')) return res.status(404).json({ message: msg })
      if (msg.includes('already exists')) return res.status(409).json({ message: msg })
      res.status(500).json({ message: msg })
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { title, content } = req.body
      const updated = await DocumentService.update(id, { title, content } as any)
      if (!updated) return res.status(404).json({ message: 'Document not found' })
      res.json(updated)
    } catch (error: any) {
      const msg = String(error?.message ?? 'Internal error')
      res.status(500).json({ message: msg })
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      const deleted = await DocumentService.delete(id)
      if (!deleted) return res.status(404).json({ message: 'Document not found' })
      res.status(204).send()
    } catch (error: any) {
      const msg = String(error?.message ?? 'Internal error')
      res.status(500).json({ message: msg })
    }
  },
}

export default DocumentController


