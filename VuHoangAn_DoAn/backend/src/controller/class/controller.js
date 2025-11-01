import { ClassService } from '../../services/class/service.js';
export const ClassController = {
    async getAll(req, res) {
        try {
            const classes = await ClassService.getAll();
            return res.status(200).json(classes);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "id not found" });
            }
            return res.status(200).json(await ClassService.getById(id));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const data = req.body;
            const newClass = await ClassService.create(data);
            return res.status(201).json(newClass);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "id not found" });
            }
            return res.status(200).json(await ClassService.update(id, req.body));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "id not found" });
            }
            return res.status(200).json(await ClassService.delete(id));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
//# sourceMappingURL=controller.js.map