import { SubjectService } from '../../services/subject/service.js';
export const SubjectController = {
    async getAll(req, res) {
        try {
            const subject = await SubjectService.getAll();
            res.status(200).json(subject);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Id not found" });
            }
            return res.status(200).json(await SubjectService.getById(id));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const data = req.body;
            const newSubject = await SubjectService.create(data);
            return res.status(201).json(newSubject);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID not found" });
            }
            return res.status(200).json(await SubjectService.update(id, req.body));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Id not found" });
            }
            return res.status(200).json(await SubjectService.delete(id));
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
export default SubjectController;
//# sourceMappingURL=controller.js.map