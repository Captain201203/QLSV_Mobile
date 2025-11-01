import { Request, Response } from "express";
import { ScoreService } from "../../services/score/service.js";

export const ScoreController = {
  // POST /scores
  async create(req: Request, res: Response) {
    try {
      const score = await ScoreService.create(req.body);
      res.status(201).json(score);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // GET /scores
  async getAll(req: Request, res: Response) {
    try {
      const scores = await ScoreService.getAll(req.query);
      res.status(200).json(scores);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET /scores/:id
  async getById(req: Request, res: Response) {
    try {
      const score = await ScoreService.getById(req.params.id);
      if (!score) return res.status(404).json({ message: "Không tìm thấy điểm" });
      res.status(200).json(score);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // PUT /scores/:id
  async update(req: Request, res: Response) {
    try {
      const score = await ScoreService.update(req.params.id, req.body);
      res.status(200).json(score);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // DELETE /scores/:id
  async remove(req: Request, res: Response) {
    try {
      await ScoreService.remove(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default ScoreController;
