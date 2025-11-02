import { lessonItemService } from "../../services/lessonItem/service.js";
export const lessonItemController = {
    getAllByLesson: async (req, res) => {
        try {
            const { lessonId } = req.params;
            const items = await lessonItemService.getAllByLesson(lessonId);
            res.status(200).json(items);
        }
        catch (err) {
            res.status(500).json({ message: "Error fetching lesson items", err });
        }
    },
    create: async (req, res) => {
        try {
            const item = await lessonItemService.create(req.body);
            res.status(201).json(item);
        }
        catch (err) {
            res.status(500).json({ message: "Error creating lesson item", err });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await lessonItemService.update(id, req.body);
            res.status(200).json(updated);
        }
        catch (err) {
            res.status(500).json({ message: "Error updating lesson item", err });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await lessonItemService.delete(id);
            res.status(200).json({ message: "Lesson item deleted" });
        }
        catch (err) {
            res.status(500).json({ message: "Error deleting lesson item", err });
        }
    },
};
//# sourceMappingURL=controller.js.map