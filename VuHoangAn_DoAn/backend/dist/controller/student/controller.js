import { StudentService } from '../../services/student/service.js';
import { ClassService } from '../../services/class/service.js';
import StudentModel from '../../models/student/model.js';
import AccountModel from '../../models/account/model.js';
import StudentImportService from '../../services/student/import.js';
import bcrypt from 'bcrypt';
//Lấy sinh viên theo lớp
export const getStudentInClass = async (req, res) => {
    try {
        const { id } = req.params;
        const students = await ClassService.getStudentInClass(id);
        res.status(200).json(students);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//Lấy danh sách sinh viên
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
    //Lấy sinh viên theo id ( lấy 1 sinh viên)
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
    // Tạo sinh viên mới
    async create(req, res) {
        try {
            console.log("📝 Dữ liệu nhận được từ frontend:", req.body);
            const data = req.body; // lấy dữ liệu từ body
            // Validation cơ bản
            const requiredFields = ['studentId', 'studentName', 'dateOfBirth', 'phoneNumber', 'email', 'className'];
            const missingFields = requiredFields.filter(field => !data[field]);
            if (missingFields.length > 0) {
                console.log("❌ Thiếu các trường bắt buộc:", missingFields);
                return res.status(400).json({
                    message: "Thiếu thông tin bắt buộc",
                    missingFields: missingFields
                });
            }
            console.log("✅ Validation passed, đang tạo sinh viên...");
            const newStudent = await StudentService.create(data); // tạo sinh viên mới, await để đợi kết quả
            console.log("✅ Tạo sinh viên thành công:", newStudent);
            res.status(201).json(newStudent); // trả về sinh viên mới tạo với mã trạng thái 201
        }
        catch (error) {
            console.error("❌ Lỗi khi thêm sinh viên:", error);
            // Chi tiết hóa lỗi
            if (error.code === 11000) {
                const duplicateField = Object.keys(error.keyPattern)[0];
                return res.status(400).json({
                    message: `${duplicateField === 'studentId' ? 'Mã sinh viên' : 'Email'} đã tồn tại`,
                    error: `Duplicate ${duplicateField}`
                });
            }
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: "Dữ liệu không hợp lệ",
                    errors: Object.values(error.errors).map((err) => err.message)
                });
            }
            res.status(500).json({
                message: "Không thể thêm sinh viên",
                error: error.message,
            });
        }
    },
    //Cập nhật thông tin sinh viên
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
    // xóa sinh viên
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
    },
    async loginStudent(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
            }
            // 1. Tìm account theo email
            const account = await AccountModel.findOne({ email });
            if (!account) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại' });
            }
            // 2. Kiểm tra mật khẩu
            const isValidPassword = await bcrypt.compare(password, account.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Mật khẩu không đúng' });
            }
            // 3. Nếu là sinh viên, tìm thông tin sinh viên
            if (account.role === 'sinh viên') {
                const student = await StudentModel.findOne({ email });
                if (student) {
                    return res.status(200).json({
                        ...student.toJSON(),
                        role: account.role
                    });
                }
            }
            return res.status(403).json({ message: 'Tài khoản không phải là sinh viên' });
        }
        catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: error.message });
        }
    },
    async importExcel(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Vui lòng chọn file" });
            }
            const report = await StudentImportService.importFromExcel(req.file.path);
            return res.status(200).json({
                message: "Import sinh viên thành công",
                ...report,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "Đã xảy ra lỗi khi import sinh viên",
                error: error.message,
            });
        }
    },
    async getSubjectByStudent(req, res) {
        try {
            const { studentId } = req.params;
            if (!studentId) {
                return res.status(400).json({ message: "Student ID is required" });
            }
            const subjects = await StudentService.getSubjectByStudent(studentId);
            return res.status(200).json(subjects);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};
//# sourceMappingURL=controller.js.map