import { Request, Response } from "express";
import DocumentModel from "../../models/document/model.js";
import { aiService } from "../../services/chat/service.js";
import type { ProviderType } from "../../services/chat/aiProvider.js";

export const aiController = {
  async askDocument(req: Request, res: Response) {
    try {
      const { documentId, question } = req.body;
      const provider = (req.query.provider as ProviderType) || "ollama";

      if (!documentId || !question) {
        return res.status(400).json({ error: "documentId và question là bắt buộc" });
      }

      // Lấy tài liệu trong DB
      const doc = await DocumentModel.findOne({ documentId });
      if (!doc) return res.status(404).json({ error: "Không tìm thấy tài liệu" });

      // Gọi AI service với provider chỉ định
      const answer = await aiService.ask(doc.content, question, provider);

      res.json({ answer });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
};
