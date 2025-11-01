import CourseService from '../../services/course/service.js';
export const CourseController = {
    async getAll(req, res) {
        try {
            const course = await CourseService.getAll();
            res.status(200).json(course);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Course ID is required' });
            }
            const course = await CourseService.getById(id);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.status(200).json(course);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const { courseId, courseName, description } = req.body; // lấy dữ liệu từ body request
            if (!courseId || !courseName || !description) {
                return res.status(400).json({ message: 'All fields are required' }); // kiểm tra dữ liệu bắt buộc phải có đầy đủ
            }
            const course = await CourseService.create({
                courseId,
                courseName,
                description
            }); // tạo mới khóa học
            res.status(201).json(course); // trả về khóa học vừa tạo với mã trạng thái 201
        }
        catch (error) {
            res.status(500).json({ message: error.ssage });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params; // lấy id từ tham số url 
            const { courseName, description } = req.body; // lấy dữ liệu từ body request
            if (!id) {
                return res.status(400).json({ message: "ID parameter is required" }); // nếu không có id thì trả về lỗi 
            }
            const course = await CourseService.update(id, {
                courseName,
                description
            }); // nếu có id thì gọi update từ service để cập nhật khóa học
            if (!course) {
                return res.status(404).json({ message: "Course not found" }); // nếu không tìm thấy khóa học trả về lỗi 404
            }
            res.status(200).json(course); // nếu không thì trả về khóa học đã được cập nhật
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params; // lấy id từ tham số url
            if (!id) {
                return res.status(400).json({ message: "ID parameter is required" }); // nếu không có id thì trả lỗi
            }
            const course = await CourseService.delete(id); // nếu có thì gọi delete từ service để xóa khóa học
            if (!course) {
                return res.status(404).json({ message: "Course not found" }); // nếu không tìm thấy khóa học thì trả lỗi
            }
            res.status(200).json({ message: "Course deleted" }); // nếu có thì thông báo xóa thành công
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async addClass(req, res) {
        try {
            const { id } = req.params;
            const { classId } = req.body;
            if (!id || !classId) {
                return res.status(400).json({ message: "ID and Class ID are required" });
            }
            const course = await CourseService.addClass(id, classId);
            res.status(200).json({ message: "Class added" });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async removeClass(req, res) {
        try {
            const { id } = req.params;
            const { classId } = req.body;
            if (!id || !classId) {
                return res.status(400).json({ message: "ID and Class ID are required" });
            }
            const course = await CourseService.removeClass(id, classId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.status(200).json({ message: "Student removed" });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    async getClasses(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID parameter is required" });
            }
            const classes = await CourseService.getClasses(id);
            res.status(200).json(classes);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
export default CourseController;
//# sourceMappingURL=controller.js.map