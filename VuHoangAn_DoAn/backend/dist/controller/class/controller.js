import { ClassService } from '../../services/class/service.js';
import ClassImportService from '../../services/class/import.js';
export const ClassController = {
    async getAll(req, res) {
        try {
            const classes = await ClassService.getAll(); // gọi service lấy tất cả lớp học
            return res.status(200).json(classes);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params; // Lấy id từ params
            if (!id) {
                return res.status(400).json({ message: "id not found" });
            }
            return res.status(200).json(await ClassService.getById(id)); // gọi service lấy lớp học theo id
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const data = req.body; // Lấy dữ liệu từ body request
            const newClass = await ClassService.create(data); // gọi service tạo mới lớp học
            return res.status(201).json(newClass);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params; // Lấy id từ params
            if (!id) {
                return res.status(400).json({ message: "id not found" });
            }
            return res.status(200).json(await ClassService.update(id, req.body)); // gọi service cập nhật lớp học
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
    },
    async getStudentsInClass(req, res) {
        try {
            const { id } = req.params; // Lấy id lớp từ params
            if (!id) {
                return res.status(400).json({ message: "Class ID is required" });
            }
            console.log("🔍 Tìm sinh viên của lớp:", id);
            const students = await ClassService.getStudentInClass(id); // gọi service lấy sinh viên theo lớp
            console.log("✅ Tìm thấy", students.length, "sinh viên");
            return res.status(200).json({
                classId: id,
                totalStudents: students.length,
                students: students
            });
        }
        catch (error) {
            console.error("❌ Lỗi khi lấy sinh viên theo lớp:", error);
            return res.status(500).json({
                message: "Không thể lấy danh sách sinh viên",
                error: error.message
            });
        }
    },
    async getStudentsInClassByName(req, res) {
        try {
            const { className } = req.params; // Lấy tên lớp từ params
            if (!className) {
                return res.status(400).json({ message: "Class name is required" });
            }
            console.log("🔍 Tìm sinh viên của lớp:", className);
            const students = await ClassService.getStudentInClassByName(className); // gọi service lấy sinh viên theo tên lớp
            console.log("✅ Tìm thấy", students.length, "sinh viên");
            return res.status(200).json({
                className: className,
                totalStudents: students.length,
                students: students
            });
        }
        catch (error) {
            console.error("❌ Lỗi khi lấy sinh viên theo tên lớp:", error);
            return res.status(500).json({
                message: "Không thể lấy danh sách sinh viên",
                error: error.message
            });
        }
    },
    async importExcel(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Vui lòng tải file lên" });
            }
            console.log("📄 Nhận file:", req.file.originalname, "Size:", req.file.size);
            const report = await ClassImportService.importFromExcel(req.file.path);
            console.log("✅ Import thành công:", report);
            return res.status(200).json({
                message: "Import thành công",
                ...report
            });
        }
        catch (error) {
            console.error("❌ Lỗi import class:", error);
            return res.status(500).json({
                message: "Đã xảy ra lỗi khi import lớp học",
                error: error.message
            });
        }
    },
};
//# sourceMappingURL=controller.js.map