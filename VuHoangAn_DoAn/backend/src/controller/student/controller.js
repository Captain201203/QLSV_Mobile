import { StudentService } from '../../services/student/service.js';
export const StudentController = {
    async getAll(req, res) {
        try {
            const students = await StudentService.getAll(); //lấy tất cả sinh viên
            res.status(200).json(students); //trả về danh sách sinh viên
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params; // lấy id từ tham số url
            if (!id) {
                return res.status(400).json({ message: "ID parameter is required" }); // nếu không có id thì trả về lỗi 400
            }
            const student = await StudentService.getById(id); // lấy sinh viên theo id
            if (!student) {
                return res.status(404).json({ message: "Student not found" }); // nếu không tìm thấy sinh viên thì trả về lỗi 400
            }
            res.status(200).json(student); // trả về sinh viên
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const data = req.body; // lấy dữ liệu từ body
            const newStudent = await StudentService.create(data); // tạo sinh viên mới, await để đợi kết quả
            res.status(201).json(newStudent); // trả về sinh viên mới tạo với mã trạng thái 201
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params; // lấy id từ tham số url
            if (!id) {
                return res.status(400).json({ message: "ID parameter is required" }); // nếu không có id trả về lỗi 400
            }
            const data = req.body; // lấy dữ liệu từ body ( dữ liệu người dùng nhập vào)
            const updateStudent = await StudentService.update(id, data); // cập nhật thông tin sinh viên theo id và dữ liệu mới
            if (!updateStudent) {
                return res.status(404).json({ message: "Student not found" }); // nếu không tìm thấy sinh viên, trả về lỗi 404 và tin nhắn
            }
            return res.status(200).json(updateStudent); // nếu cập nhật thành công, trả về sinh viên
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params; // lấy id từ url
            if (!id) {
                return res.status(400).json({ message: "ID parameter is required" }); // nếu không có id trả về lỗi 400
            }
            const deleteStudent = await StudentService.delete(id); // xóa sinh viên theo id
            if (!deleteStudent) {
                return res.status(404).json({ message: "Student not found" }); // nếu không tìm thấy sinh viên, trả về lỗi 404 và tin nhắn
            }
            return res.status(200).json({ message: "Student deleted" }); // nếu xóa thành công, trả về tin nhắn
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
//# sourceMappingURL=controller.js.map